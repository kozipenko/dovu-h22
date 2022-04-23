import { ActionIcon } from "@mantine/core";
import { Moon, Sun } from "tabler-icons-react";
import { useTheme } from "../store/theme";

export default function ThemeButton() {
  const theme = useTheme();
  
  return (
    <ActionIcon size="lg" color="indigo" variant="light" onClick={theme.toggleColorScheme}>
      {theme.colorScheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </ActionIcon>
  );
}