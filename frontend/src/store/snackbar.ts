import { create } from "zustand";
import React from "react";

interface SnackbarState {
	enabled: boolean;
	message?: string;
	severity?: "success" | "error" | "warning" | "info";
	show?: (message: string) => void;
	info: (message: string) => void;
	warning: (message: string) => void;
	error: (message: string) => void;
	success: (message: string) => void;
	close?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
	enabled: false,
	message: "",
	show: (message: string) => {
		set({ enabled: true, message: message });
	},
	info: (message: string) => {
		set({ enabled: true, message: message, severity: "info" });
	},
	warning: (message: string) => {
		set({ enabled: true, message: message, severity: "warning" });
	},
	error: (message: string) => {
		set({ enabled: true, message: message, severity: "error" });
	},
	success: (message: string) => {
		set({ enabled: true, message: message, severity: "success" });
	},
	close: (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}
		set({ enabled: false });
	},
}));
