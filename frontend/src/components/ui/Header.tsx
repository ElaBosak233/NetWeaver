import { AppBar, IconButton, Toolbar } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import CableIcon from "@mui/icons-material/Cable";
import { Quit, WindowMinimise } from "#/wailsjs/runtime";
import React from "react";

function Header() {
	return (
		<AppBar
			position={"fixed"}
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
			style={{ "--wails-draggable": "drag" } as React.CSSProperties}
			className={"no-select"}
		>
			<Toolbar variant={"dense"}>
				<CableIcon
					sx={{
						marginRight: 1,
					}}
				/>
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
					style={
						{
							marginRight: "0.5rem",
							"--wails-draggable": "no-drag",
						} as React.CSSProperties
					}
					onClick={() => WindowMinimise()}
				>
					<RemoveIcon />
				</IconButton>
				<IconButton
					size="small"
					edge="end"
					color="inherit"
					style={
						{
							"--wails-draggable": "no-drag",
						} as React.CSSProperties
					}
					onClick={() => Quit()}
				>
					<CloseIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}

export default Header;
