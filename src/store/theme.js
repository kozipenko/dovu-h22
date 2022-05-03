import { proxy, useSnapshot } from "valtio";

export const theme = proxy({
  colorScheme: "light",
  primaryColor: "indigo"
});

export const useTheme = () => useSnapshot(theme);

export function toggleColorScheme() {
  theme.colorScheme = theme.colorScheme === "light" ? "dark" : "light";
}