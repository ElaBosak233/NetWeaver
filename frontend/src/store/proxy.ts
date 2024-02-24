import { create } from "zustand";

interface ProxyState {
	active: Record<string, string>;
	inactive: Record<string, string>;
	add: (addr: string, url: string) => void;
	remove: (addr: string) => void;
}

export const useProxyStore = create<ProxyState>((set) => ({
	active: {},
	inactive: {},
	add: (addr: string, url: string) => {
		set((state) => {
			state.active[addr] = url;
			return { active: state.active };
		});
	},
	remove: (addr: string) => {
		set((state) => {
			state.inactive[addr] = state.active[addr];
			delete state.active[addr];
			return { active: state.active, inactive: state.inactive };
		});
	}
}));