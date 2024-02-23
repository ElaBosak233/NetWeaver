package main

import (
	"context"
	"github.com/elabosak233/netweaver/proxy"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) StartProxy(url string) string {
	p := proxy.NewProxy()
	addr, _ := p.Start(url)
	return addr
}
