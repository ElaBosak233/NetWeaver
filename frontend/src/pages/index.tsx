import logo from "@/assets/images/logo-universal.png";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { StartProxy } from "#/wailsjs/go/main/App";
import { useSnackbarStore } from "@/store/snackbar";
import { Box, TextField } from "@mui/material";

function Index() {

	const snackBarStore =  useSnackbarStore();

	const [resultText, setResultText] = useState(
		""
	);
	const [name, setName] = useState("");
	const updateName = (e: any) => setName(e.target.value);
	const updateResultText = (result: string) => setResultText(result);

	function greet() {
		StartProxy(name).then(updateResultText);
	}
	return (
		<Box>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<TextField label={"[ws/wss]://"} variant="outlined" onChange={updateName} />
				<Button onClick={greet} variant={"contained"} size={"large"}>
					Connect
				</Button>
			</div>
			<div>
				{resultText}
			</div>
			<div>
				<Button onClick={() => {
					snackBarStore.info(resultText);
				}}>
					Show Snackbar
				</Button>
			</div>
		</Box>
	)
}

export default Index;