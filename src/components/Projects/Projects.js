import { useState } from "react";
import { Center, Group, Loader, SimpleGrid, Stack, Text } from "@mantine/core";
import { useApi } from "../../services/api";
import ProjectsFilter from "./ProjectsFilter";
import ProjectsCard from "./ProjectsCard";

export default function Projects() {
  const [filter, setFilter] = useState({ search: "", priceKg: [0, 100], verifiedKg: [0, 5000] });
  const api = useApi();

  const filtered = api.projects.data
    .filter(p => p.verified_kg >= filter.verifiedKg[0] && p.verified_kg <= filter.verifiedKg[1])
    .filter(p => p.price_kg >= filter.priceKg[0] && p.price_kg <= filter.priceKg[1])
    .filter(p => p.name.toLowerCase().includes(filter.search))
  
  return (
    <Stack spacing="md">
      <Group position="apart">
        <Text size="lg" weight={700}>Projects</Text>
        <ProjectsFilter value={filter} onChange={setFilter} />
      </Group>

      {api.projects.isLoading && (
        <Center mt="xl">
          <Loader variant="dots" />
        </Center>
      )}

      <SimpleGrid
        spacing="xl"
        cols={4}
        breakpoints={[
          { maxWidth: "xs", cols: 1 },
          { maxWidth: "sm", cols: 2 },
          { maxWidth: "md", cols: 2 },
          { maxWidth: "lg", cols: 3 },
        ]}
      >
        {api.projects.isSuccess && filtered.map(project => (
          <ProjectsCard key={project.id} project={project} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}