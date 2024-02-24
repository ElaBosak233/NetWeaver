import Button from "@mui/material/Button";
import React, { useState } from "react";
import { StartProxy } from "#/wailsjs/go/main/App";
import { useSnackbarStore } from "@/store/snackbar";
import { useProxyStore } from "@/store/proxy";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import CableIcon from "@mui/icons-material/Cable";
import LinkIcon from "@mui/icons-material/Link";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

function Index() {
	const proxyStore = useProxyStore();
	const snackbarStore = useSnackbarStore();
	const navigate = useNavigate();

	const [url, setUrl] = useState("");
	const [host, setHost] = useState("127.0.0.1");

	function toggleHost() {
		setHost(host === "127.0.0.1" ? "0.0.0.0" : "127.0.0.1");
	}

	function proxy() {
		if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
			snackbarStore.error("Websocket URL 格式错误");
			return;
		}
		StartProxy(url, host).then((res) => {
			proxyStore.add(res?.id, {
				addr: res?.addr,
				url: url,
			});
			snackbarStore.success(`代理启动成功 ${res?.addr}`);
			navigate("/history");
		});
	}
	return (
		<Box display={"flex"} flexDirection={"column"} height={"25rem"} justifyContent={"center"}>
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				<CableIcon color={"primary"} sx={{ fontSize: "5rem" }}/>
				<div style={{ fontSize: "3rem" }}>
					开始
				</div>
			</div>
			<div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
				<Tooltip title={host} placement="top">
					<IconButton sx={{ borderRadius: "5px" }} size={"large"} onClick={toggleHost}>
						{ host === "127.0.0.1" ? <LockIcon /> : <PublicIcon />}
					</IconButton>
				</Tooltip>
				<TextField label={"[ws/wss]://"} variant="outlined" onChange={(e: any) => setUrl(e.target.value)} />
				<Button startIcon={<LinkIcon />} onClick={proxy} variant={"contained"} size={"large"} disableElevation>
					连接
				</Button>
			</div>
		</Box>
	)
}

export default Index;