import {
	Box, Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from '@mui/icons-material/Info';

function Sidebar() {
	const navigate = useNavigate();

	return (
		<Drawer
			variant={"permanent"}
			sx={{
				width: "8rem",
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: { width: "8rem", boxSizing: "border-box" },
			}}
		>
			<Toolbar variant={"dense"} />
			<Box>
				<List>
					<ListItem disablePadding>
						<ListItemButton onClick={() => {
							navigate("/");
						}}>
							<HomeIcon sx={{ fontSize: "1.2rem" }} style={{ marginRight: "1rem" }} color="primary" />
							<span style={{ fontSize: "0.8rem" }}>主页</span>
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton onClick={() => {
							navigate("/history");
						}}>
							<HistoryIcon sx={{ fontSize: "1.2rem" }} style={{ marginRight: "1rem" }} color="primary" />
							<span style={{ fontSize: "0.8rem" }}>历史</span>
						</ListItemButton>
					</ListItem>
				</List>
			</Box>
			<Box flexGrow={1} />
			<Box>
				<List>
					<ListItem disablePadding>
						<ListItemButton>
							<SettingsIcon sx={{ fontSize: "1.2rem" }} style={{ marginRight: "1rem" }} color="primary" />
							<span style={{ fontSize: "0.8rem" }}>设置</span>
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton onClick={() => {
							navigate("/about");
						}}>
							<InfoIcon sx={{ fontSize: "1.2rem" }} style={{ marginRight: "1rem" }} color="primary" />
							<span style={{ fontSize: "0.8rem" }}>关于</span>
						</ListItemButton>
					</ListItem>
				</List>
			</Box>
		</Drawer>
	);
}

export default Sidebar;