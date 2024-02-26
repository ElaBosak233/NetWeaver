import React from "react";
import { Box, Link, Typography } from "@mui/material";
import { BrowserOpenURL } from "#/wailsjs/runtime";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

function About() {
	return (
		<>
			<Box display={"flex"} flexDirection={"column"} height={"25rem"}>
				<h1>关于</h1>
				<Typography
					variant={"body1"}
					style={{ fontStyle: "italic", opacity: "50%" }}
				>
					Hack for fun not for profit.
				</Typography>
				<Typography variant={"body1"} sx={{ mt: "0.5rem" }}>
					一个基于 Go Wails 的开源项目
				</Typography>
				<Typography variant={"body1"}>
					通常是在 CTF 解题过程中食用，用于快速建立 TCP over Websocket
					隧道
				</Typography>
				<Typography
					variant={"body1"}
					style={{ fontStyle: "italic", opacity: "50%" }}
					sx={{ mt: "1rem" }}
				>
					<div style={{ display: "flex", alignItems: "center" }}>
						<VolunteerActivismIcon sx={{ mr: 1 }} />
						Supported CTF Platforms
					</div>
				</Typography>
				<Typography variant={"body1"} sx={{ mt: "0.5rem" }}>
					<Link
						color={"text.primary"}
						onClick={() =>
							BrowserOpenURL("https://ctf.xidian.edu.cn")
						}
					>
						XDSEC Cyber Terminal
					</Link>
					，
					<Link
						color={"text.primary"}
						onClick={() =>
							BrowserOpenURL(
								"https://github.com/GZTimeWalker/GZCTF"
							)
						}
					>
						GZ::CTF
					</Link>
					，
					<Link
						color={"text.primary"}
						onClick={() =>
							BrowserOpenURL(
								"https://github.com/elabosak233/cloudsdale"
							)
						}
					>
						Cloudsdale
					</Link>
				</Typography>
				<Box flexGrow={1} />
				<Typography variant={"caption"}>
					作者:{" "}
					<Link
						onClick={() =>
							BrowserOpenURL("https://github.com/elabosak233")
						}
					>
						@ElaBosak233
					</Link>
				</Typography>
				<Typography variant={"caption"}>
					仓库:{" "}
					<Link
						onClick={() =>
							BrowserOpenURL(
								"https://github.com/elabosak233/netweaver"
							)
						}
					>
						github.com/elabosak233/netweaver
					</Link>
				</Typography>
				<Typography variant={"caption"}>
					协议:{" "}
					<Link
						onClick={() =>
							BrowserOpenURL(
								"https://www.gnu.org/licenses/gpl-3.0.html"
							)
						}
					>
						{" "}
						GNU GENERAL PUBLIC LICENSE Version 3
					</Link>
				</Typography>
			</Box>
		</>
	);
}

export default About;
