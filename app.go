package main

import (
	"context"
	"github.com/elabosak233/netweaver/proxy"
	"log"
	"sync"
)

type App struct {
	ctx     context.Context
	proxies map[string]*proxy.Proxy
	mu      sync.Mutex
}

func NewApp() *App {
	return &App{
		proxies: make(map[string]*proxy.Proxy),
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) StartProxy(url string, host string) map[string]string {
	p := proxy.NewProxy(a.ctx, url, host)
	addr, _ := p.Start()
	a.mu.Lock()
	defer a.mu.Unlock()
	a.proxies[p.ID] = p
	log.Printf("Proxy started on %v\n", &p)
	return map[string]string{
		"addr": addr,
		"id":   p.ID,
	}
}

func (a *App) StopProxy(id string) {
	a.mu.Lock()
	defer a.mu.Unlock()
	if p, ok := a.proxies[id]; ok {
		_ = p.Stop()
		delete(a.proxies, id)
	}
}
