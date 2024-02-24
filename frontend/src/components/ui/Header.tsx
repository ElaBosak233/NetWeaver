import { AppBar, IconButton, Toolbar, useTheme } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import CableIcon from "@mui/icons-material/Cable";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Quit, WindowMinimise, WindowSetDarkTheme, WindowSetLightTheme, LogInfo } from "#/wailsjs/runtime";
import { useThemeStore } from "@/store/theme";
import React, { useState } from "react";

function Header() {
	const themeStore = useThemeStore();

	return (
		<AppBar position={"fixed"} sx={{
			zIndex: (theme) => theme.zIndex.drawer + 1,
		}} style={{"--wails-draggable": "drag"} as React.CSSProperties} className={"no-select"}>
			<Toolbar variant={"dense"}>
				<CableIcon sx={{
					marginRight: 1,
				}} />
				<span
					style={{
						flex: 1,
						textAlign: "start",
						fontSize: "1.1rem",
						fontFamily: "Jetbrains Mono",
				}}
				>
					NetWeaver
				</span>
				<IconButton
					size="small"
					edge="end"
					color="inherit"
					style={{ marginRight: "0.5rem" }}
					onClick={() => WindowMinimise()}
				>
					<RemoveIcon />
				</IconButton>
				<IconButton
					size="small"
					edge="end"
					color="inherit"
					onClick={() => Quit()}
				>
					<CloseIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}

export default Header;