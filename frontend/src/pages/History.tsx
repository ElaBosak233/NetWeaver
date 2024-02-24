import { Box, Card, IconButton, Link } from "@mui/material";
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
		<Box display={"flex"} flexDirection={"column"} minHeight={"25rem"}>
			<h1 style={{ display: "flex", alignItems: "center" }}>
				<BoltIcon sx={{ mr: 1, fontSize: "2rem" }} color={"warning"} />
				活跃连接
			</h1>
			{
				Object.entries(proxyStore.active).reverse().map(([id, proxy]) => {
					return (
						<Card key={id} style={{
							display: "flex", marginTop: "0.5rem", justifyContent: "space-between", alignItems: "center"
						}} sx={{ p: 2, maxHeight: "4.5rem", minHeight: "4.5rem" }}>
							<div style={{ marginLeft: "0.25rem" }}>
								<span style={{ fontSize: "1rem" }}>{extractURL(proxy.url)}</span> → <span style={{ fontSize: "1rem" }}>{proxy.addr}</span>
								<div>
									<Link style={{ fontSize: "0.7rem" }} onClick={() => {
										copyToClipboard(proxy.url);
									}}>{ proxy.url }</Link>
								</div>
							</div>
							<div>
								<IconButton color={"success"} onClick={() => {
									copyToClipboard(proxy.addr);
								}}>
									<ContentCopyIcon />
								</IconButton>
								<IconButton color={"error"} onClick={() => {
									StopProxy(id).then(() => {
										proxyStore.remove(id);
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
				Object.entries(proxyStore.inactive).map(([id, proxy]) => {
					return (
						<Card key={id} style={{
							display: "flex", marginTop: "0.5rem", justifyContent: "space-between", alignItems: "center"
						}} sx={{ p: 2, maxHeight: "4.5rem", minHeight: "4.5rem" }}>
							<div style={{ marginLeft: "0.25rem" }}>
								<span style={{ fontSize: "1rem" }}>{extractURL(proxy.url)}</span> → <span style={{ fontSize: "1rem" }}>{proxy.addr}</span>
								<div>
									<Link style={{ fontSize: "0.7rem" }} onClick={() => {
										copyToClipboard(proxy.url);
									}}>{ proxy.url }</Link>
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