import React, { useMemo } from "react";
import "@/assets/css/main.css";
import "@fontsource/jetbrains-mono";
import {
	Alert,
	createTheme,
	CssBaseline,
	Snackbar,
	ThemeProvider,
} from "@mui/material";
import { useSnackbarStore } from "@/store/snackbar";
import { useThemeStore } from "@/store/theme";
import AppLayout from "@/layouts/AppLayout";
import { HashRouter, Route, Routes } from "react-router-dom";
import Index from "@/pages";
import About from "@/pages/About";
import History from "@/pages/History";
import { EventsOn } from "#/wailsjs/runtime";
import { useProxyStore } from "@/store/proxy";

function App() {
	const snackBarStore = useSnackbarStore();
	const themeStore = useThemeStore();
	const proxyStore = useProxyStore();

	const theme = useMemo(
		() =>
			createTheme({
				palette: themeStore.palette(),
				typography: {
					fontFamily: "Jetbrains Mono",
				},
			}),
		[themeStore.mode]
	);

	EventsOn("dial_err", (response: string) => {
		const obj = JSON.parse(response);
		proxyStore.remove(obj?.id);
	});

	return (
		<div id="App" className={"no-select"}>
			<ThemeProvider theme={theme}>
				<CssBaseline enableColorScheme />
				<HashRouter basename={"/"}>
					<AppLayout>
						<Routes>
							<Route path="/" element={<Index />} />
							<Route path="/about" element={<About />} />
							<Route path="/history" element={<History />} />
							{/* more... */}
						</Routes>
					</AppLayout>
				</HashRouter>
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					open={snackBarStore.enabled}
					onClose={snackBarStore.close}
					autoHideDuration={2000}
				>
					<Alert
						onClose={snackBarStore.close}
						severity={snackBarStore.severity || "info"}
						sx={{ width: "100%" }}
					>
						{snackBarStore.message}
					</Alert>
				</Snackbar>
			</ThemeProvider>
		</div>
	);
}

export default App;
