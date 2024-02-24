import { Box, Card, IconButton, Link, List, ListItem } from "@mui/material";
import { useProxyStore } from "@/store/proxy";
import CloseIcon from "@mui/icons-material/Close";
import { StopProxy } from "#/wailsjs/go/main/App";
import BoltIcon from "@mui/icons-material/Bolt";
import { ClipboardSetText } from "#/wailsjs/runtime";
import { useSnackbarStore } from "@/store/snackbar";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function History() {

	const proxyStore = useProxyStore();
	const snackbarStore = useSnackbarStore();

	function copyToClipboard(text: string) {
		ClipboardSetText(text).then((success: boolean) => {
			if (success) {
				snackbarStore.success("已复制到剪贴板");
			}
		});
	}

	function extractURL(url: string) {
		const pattern = /wss?:\/\/([^\/]+)/;
		const match = url.match(pattern);
		return match ? match[1] : null;
	}

	return (
		<Box display={"flex"} flexDirection={"column"} height={"25rem"}>
			<h1 style={{ display: "flex", alignItems: "center" }}>
				<BoltIcon sx={{ mr: 1, fontSize: "2rem" }} color={"warning"} />
				活跃连接
			</h1>
			{
				Object.entries(proxyStore.active).map(([addr, url]) => {
					return (
						<Card key={addr} style={{ display: "flex", marginTop: "0.5rem", justifyContent: "space-between", alignItems: "center" }} sx={{ p: 2 }}>
							<div>
								<span style={{ fontSize: "1rem" }}>{extractURL(url)}</span> → <span style={{ fontSize: "1rem" }}>{addr}</span>
								<div>
									<Link style={{ fontSize: "0.7rem" }} onClick={() => {
										copyToClipboard(url);
									}}>{ url }</Link>
								</div>
							</div>
							<div>
								<IconButton color={"success"} onClick={() => {
									copyToClipboard(addr);
								}}>
									<ContentCopyIcon />
								</IconButton>
								<IconButton color={"error"} onClick={() => {
									StopProxy(addr).then(() => {
										proxyStore.remove(addr);
									});
								}}>
									<CloseIcon />
								</IconButton>
							</div>
						</Card>
					);
				})
			}
			<h1 style={{ display: "flex", alignItems: "center" }}>
				<CloseIcon sx={{ mr: 1, fontSize: "2rem" }} color={"error"} />
				失效连接
			</h1>
			{
				Object.entries(proxyStore.inactive).map(([addr, url]) => {
					return (
						<Card key={addr} style={{ display: "flex", marginTop: "0.5rem", justifyContent: "space-between", alignItems: "center" }} sx={{ p: 2 }}>
							<div>
								<span style={{ fontSize: "1rem" }}>{extractURL(url)}</span> → <span style={{ fontSize: "1rem" }}>{addr}</span>
								<div>
									<Link style={{ fontSize: "0.7rem" }} onClick={() => {
										copyToClipboard(url);
									}}>{ url }</Link>
								</div>
							</div>
						</Card>
					);
				})
			}
		</Box>
	);
}

export default History;