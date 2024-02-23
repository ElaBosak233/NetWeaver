import { create } from "zustand";
import { PaletteMode, PaletteOptions } from "@mui/material";
import { blue, grey } from "@mui/material/colors";

interface ThemeState {
	mode: PaletteMode;
	toggle: () => void;
	palette: () => PaletteOptions;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
	mode: "dark",
	toggle: () => set((state) => ({ mode: state.mode === "light" ? "dark": "light" })),
	palette: () => ({
		mode: get().mode,
		...(get().mode === "light"
			? {
				// palette values for light mode
				primary: blue,
				divider: grey[200],
				text: {
					primary: grey[900],
					secondary: grey[800],
				},
			}
			: {
				// palette values for dark mode
				primary: grey,
				divider: grey[800],
				background: {
					default: grey[900],
					paper: grey[900],
				},
				text: {
					primary: "#fff",
					secondary: "#ccc",
				},
			}),
	}),
}));