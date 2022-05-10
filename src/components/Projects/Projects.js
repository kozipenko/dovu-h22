import { useState } from "react";
import { Center, Loader, SimpleGrid } from "@mantine/core";
import useProjects from "../../hooks/useProjects";
import ProjectsFilter from "./ProjectsFilter";
import ProjectsCard from "./ProjectsCard";

export default function Projects() {
  const [filter, setFilter] = useState({ search: "", priceKg: [0, 100], verifiedKg: [0, 5000] });
  const { projects } = useProjects();

  const filtered = projects.isSuccess && projects.data
    .filter(p => p.verified_kg >= filter.verifiedKg[0] && p.verified_kg <= filter.verifiedKg[1])
    .filter(p => p.price_kg >= filter.priceKg[0] && p.price_kg <= filter.priceKg[1])
    .filter(p => p.name.toLowerCase().includes(filter.search))
  
  return (
    <>
      <ProjectsFilter value={filter} onChange={setFilter} />

      {projects.isLoading && (
        <Center mt="xl">
          <Loader variant="dots" />
        </Center>
      )}

      <SimpleGrid
        spacing="xl"
        mt="xl"
        cols={4}
        breakpoints={[
          { maxWidth: "xs", cols: 1 },
          { maxWidth: "sm", cols: 2 },
          { maxWidth: "md", cols: 3 },
          { maxWidth: "lg", cols: 3 },
        ]}
      >
        {projects.isSuccess && filtered.map(project => (
          <ProjectsCard key={project.id} project={project} />
        ))}
      </SimpleGrid>
    </>
  );
}