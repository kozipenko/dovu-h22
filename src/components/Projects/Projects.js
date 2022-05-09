import { useState } from "react";
import { Center, Loader, SimpleGrid } from "@mantine/core";
import { useQuery } from "react-query";
import { getProjects } from "../../services/projects";
import ProjectsFilter from "./ProjectsFilter";
import ProjectsCard from "./ProjectsCard";

export default function Projects() {
  const [filter, setFilter] = useState({ search: "", priceKg: [0, 100], verifiedKg: [0, 5000] });
  const query = useQuery("project", getProjects, {
    select: (projects) => projects
      .filter(p => p.verified_kg >= filter.verifiedKg[0] && p.verified_kg <= filter.verifiedKg[1])
      .filter(p => p.price_kg >= filter.priceKg[0] && p.price_kg <= filter.priceKg[1])
      .filter(p => p.name.toLowerCase().includes(filter.search))
  });

  return (
    <>
      <ProjectsFilter value={filter} onChange={setFilter} />

      {query.isLoading && (
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
        {query.isSuccess && query.data.map(project => (
          <ProjectsCard key={project.id} project={project} />
        ))}
      </SimpleGrid>
    </>
  );
}