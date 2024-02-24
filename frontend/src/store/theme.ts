import { create } from "zustand";
import { PaletteMode, PaletteOptions } from "@mui/material";
import { blue, grey } from "@mui/material/colors";

interface ThemeState {
	mode: PaletteMode;
	palette: () => PaletteOptions;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
	mode: "dark",
	palette: () => ({
		mode: get().mode,
		...({
			primary: grey,
			secondary: grey,
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