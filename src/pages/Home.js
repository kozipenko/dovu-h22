import Stats from "../components/Stats/Stats";
import Projects from "../components/Projects/Projects";
import { Stack } from "@mantine/core";

export default function Home() {
  return (
    <Stack spacing="xl">
      <Stats />
      <Projects />
    </Stack>
  );
}