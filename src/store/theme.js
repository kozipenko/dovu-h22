import { proxy, useSnapshot } from "valtio";

export const state = proxy({
  colorScheme: "light",
  primaryColor: "indigo",
  toggleColorScheme: () => state.colorScheme = state.colorScheme === "light" ? "dark" : "light" 
});

export const useTheme = () => useSnapshot(state);