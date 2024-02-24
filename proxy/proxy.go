package proxy

import (
	"errors"
	"fmt"
	"github.com/gorilla/websocket"
	"io"
	"log"
	"net"
	"net/url"
	"sync"
)

type Proxy struct {
	TCPListener net.Listener
	connMap     map[net.Conn]struct{}
	url         string
	host        string
	addr        string
	mutex       sync.Mutex
}

func NewProxy(url string, host string) *Proxy {
	return &Proxy{
		url:     url,
		host:    host,
		connMap: make(map[net.Conn]struct{}),
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
	p.TCPListener = tcpListener

	log.Printf("TCP server is listening on %s\n", tcpListener.Addr().String())

	// Accept TCP connections and handle them
	go func() {
		for {
			tcpConn, err := p.TCPListener.Accept()
			if err != nil {
				// 检查错误是否是因为监听器被关闭
				var opErr *net.OpError
				if errors.As(err, &opErr) && opErr.Op == "accept" {
					log.Printf("TCPListener closed, stopping accept loop: %v", err)
					break
				}
				log.Printf("Error accepting: %v", err)
				continue
			}
			p.mutex.Lock()
			p.connMap[tcpConn] = struct{}{}
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
	if p.TCPListener != nil {
		p.TCPListener.Close()
	}
	for conn := range p.connMap {
		conn.Close()
	}

	return nil
}

func (p *Proxy) handleTCPClient(tcpConn net.Conn) {
	log.Printf("Accepted TCP connection from %s\n", tcpConn.RemoteAddr().String())
	defer func() {
		tcpConn.Close()
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
		return
	}
	defer wsConn.Close()

	log.Printf("Connected to WebSocket server %s\n", u.String())

	// 从TCP连接复制数据到WebSocket
	go func() {
		defer tcpConn.Close()
		defer wsConn.Close()
		for {
			buf := make([]byte, 1024)
			n, err := tcpConn.Read(buf)
			if err != nil {
				log.Printf("TCP Read error: %v", err)
				break
			}
			err = wsConn.WriteMessage(websocket.BinaryMessage, buf[:n])
			if err != nil {
				log.Printf("WebSocket WriteMessage error: %v", err)
				break
			}
		}
	}()

	// 从WebSocket连接复制数据到TCP
	for {
		_, r, err := wsConn.NextReader()
		if err != nil {
			log.Printf("NextReader error: %v", err)
			break
		}
		buf, err := io.ReadAll(r)
		if err != nil {
			log.Printf("ReadAll error: %v", err)
			break
		}
		if _, err := tcpConn.Write(buf); err != nil {
			log.Printf("TCP Write error: %v", err)
			break
		}
	}
}
