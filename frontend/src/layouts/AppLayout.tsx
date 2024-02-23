import { ReactNode } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { Box } from "@mui/material";

function AppLayout({ children } : { children: ReactNode }) {
  return (
	<>
		<Header />
		<Sidebar />
		<Box
			component="section"
			sx={{ flexGrow: 1,  height: 400, ml: 16, mt: 6, p: 3 }}
		>
			{ children }
		</Box>
	</>
  );
}

export default AppLayout;