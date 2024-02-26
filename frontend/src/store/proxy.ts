import { create } from "zustand";

interface Proxy {
	addr: string;
	url: string;
}

interface ProxyState {
	active: Record<string, Proxy>;
	inactive: Record<string, Proxy>;
	add: (addr: string, proxy: Proxy) => void;
	remove: (addr: string) => void;
}

export const useProxyStore = create<ProxyState>((set) => ({
	active: {},
	inactive: {},
	add: (id: string, proxy: Proxy) => {
		set((state) => {
			state.active[id] = proxy;
			return { active: state.active };
		});
	},
	remove: (id: string) => {
		set((state) => {
			state.inactive[id] = state.active[id];
			delete state.active[id];
			return { active: state.active, inactive: state.inactive };
		});
	},
}));
