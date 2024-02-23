package proxy

import (
	"context"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net"
)

type Proxy struct {
	ctx         context.Context
	cancel      context.CancelFunc
	TCPListener net.Listener
	WSConn      *websocket.Conn
}

func NewProxy() *Proxy {
	return &Proxy{}
}

func (p *Proxy) Start(url string) (string, error) {
	// Connect to the WebSocket server
	dialer := websocket.Dialer{}
	wsConn, _, err := dialer.Dial(url, nil)
	if err != nil {
		return "", fmt.Errorf("error connecting to WebSocket: %s", err.Error())
	}
	p.WSConn = wsConn

	tcpListener, err := net.Listen("tcp", "localhost:0")
	if err != nil {
		return "", fmt.Errorf("error listening: %s", err.Error())
	}
	p.TCPListener = tcpListener

	log.Printf("TCP server is listening on %s\n", tcpListener.Addr().String())

	// Create a context for cancellation
	ctx, cancel := context.WithCancel(context.Background())
	p.ctx = ctx
	p.cancel = cancel

	// Accept TCP connections and handle them
	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			default:
				tcpConn, err := tcpListener.Accept()
				if err != nil {
					log.Println("Error accepting:", err.Error())
					continue
				}

				go p.handleTCPClient(tcpConn)
			}
		}
	}()
	return tcpListener.Addr().String(), nil
}

func (p *Proxy) Stop() error {
	// Cancel the context
	p.cancel()

	// Close the TCP listener
	err := p.TCPListener.Close()
	if err != nil {
		return fmt.Errorf("Error closing TCP listener: %s", err.Error())
	}

	// Close the WebSocket connection
	err = p.WSConn.Close()
	if err != nil {
		return fmt.Errorf("Error closing WebSocket connection: %s", err.Error())
	}

	return nil
}

func (p *Proxy) handleTCPClient(tcpConn net.Conn) {
	defer tcpConn.Close()
	log.Printf("Accepted connection from %s\n", tcpConn.RemoteAddr().String())

	for {
		select {
		case <-p.ctx.Done():
			return
		default:
			buffer := make([]byte, 1024)
			n, err := tcpConn.Read(buffer)
			if err != nil {
				log.Println("Error reading:", err.Error())
				break
			}
			data := buffer[:n]

			err = p.WSConn.WriteMessage(websocket.BinaryMessage, data)
			if err != nil {
				log.Println("Error sending to websocket:", err.Error())
				break
			}

			_, response, err := p.WSConn.ReadMessage()
			if err != nil {
				log.Println("Error reading from websocket:", err.Error())
				break
			}

			_, err = tcpConn.Write(response)
			if err != nil {
				log.Println("Error sending to TCP client:", err.Error())
				break
			}
		}
	}
}
