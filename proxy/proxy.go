package proxy

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"io"
	"log"
	"net"
	"net/url"
	"sync"
)

type Proxy struct {
	ID          string
	url         string
	host        string
	addr        string
	tcpListener net.Listener
	connMap     map[net.Conn]bool
	mutex       sync.Mutex
	ctx         context.Context
}

func NewProxy(ctx context.Context, url string, host string) *Proxy {
	return &Proxy{
		ID:      uuid.NewString(),
		url:     url,
		host:    host,
		connMap: make(map[net.Conn]bool),
		ctx:     ctx,
	}
}

func (p *Proxy) Start() (string, error) {
	if p.host == "0.0.0.0" {
		p.host = ""
	}

	tcpListener, err := net.Listen("tcp", fmt.Sprintf("%s:0", p.host))
	if err != nil {
		return "", fmt.Errorf("error listening: %s", err.Error())
	}
	p.tcpListener = tcpListener

	log.Printf("TCP server is listening on %s\n", tcpListener.Addr().String())

	// Accept TCP connections and handle them
	go func() {
		for {
			tcpConn, _err := p.tcpListener.Accept()
			if _err != nil {
				var opErr *net.OpError
				if errors.As(_err, &opErr) && opErr.Op == "accept" {
					log.Printf("tcpListener closed, stopping accept loop: %v", _err)
					break
				}
				log.Printf("Error accepting: %v", _err)
				continue
			}
			p.mutex.Lock()
			p.connMap[tcpConn] = true
			p.mutex.Unlock()
			go p.handleTCPClient(tcpConn)
		}
	}()
	p.addr = tcpListener.Addr().String()
	return tcpListener.Addr().String(), nil
}

func (p *Proxy) Stop() error {
	p.mutex.Lock()
	defer p.mutex.Unlock()
	if p.tcpListener != nil {
		_ = p.tcpListener.Close()
	}
	for conn := range p.connMap {
		_ = conn.Close()
	}

	return nil
}

func (p *Proxy) handleTCPClient(tcpConn net.Conn) {
	log.Printf("Accepted TCP connection from %s\n", tcpConn.RemoteAddr().String())
	defer func() {
		_ = tcpConn.Close()
		p.mutex.Lock()
		delete(p.connMap, tcpConn)
		p.mutex.Unlock()
	}()

	u, err := url.Parse(p.url)
	if err != nil {
		log.Printf("Failed to parse websocket URL: %v", err)
		return
	}

	wsDialer := websocket.DefaultDialer
	wsConn, _, err := wsDialer.Dial(u.String(), nil)
	if err != nil {
		log.Printf("Dial error: %v", err)
		response := map[string]interface{}{
			"id": p.ID,
		}
		data, _ := json.Marshal(response)
		fmt.Println(string(data))
		runtime.EventsEmit(p.ctx, "dial_err", string(data))
		go func() {
			_ = p.Stop()
		}()
		return
	}
	defer func(wsConn *websocket.Conn) {
		_ = wsConn.Close()
	}(wsConn)

	log.Printf("Connected to WebSocket server %s\n", u.String())

	// TCP -> Websocket
	go func() {
		defer func(tcpConn net.Conn) {
			_ = tcpConn.Close()
		}(tcpConn)
		defer func(wsConn *websocket.Conn) {
			_ = wsConn.Close()
		}(wsConn)
		for {
			buf := make([]byte, 1024)
			n, _err := tcpConn.Read(buf)
			if _err != nil {
				log.Printf("TCP Read error: %v", _err)
				break
			}
			_err = wsConn.WriteMessage(websocket.BinaryMessage, buf[:n])
			if err != nil {
				log.Printf("WebSocket WriteMessage error: %v", _err)
				break
			}
		}
	}()

	// Websocket -> TCP
	for {
		_, r, _err := wsConn.NextReader()
		if _err != nil {
			log.Printf("NextReader error: %v", _err)
			break
		}
		buf, _err := io.ReadAll(r)
		if _err != nil {
			log.Printf("ReadAll error: %v", _err)
			break
		}
		if _, _err = tcpConn.Write(buf); _err != nil {
			log.Printf("TCP Write error: %v", _err)
			break
		}
	}
}
