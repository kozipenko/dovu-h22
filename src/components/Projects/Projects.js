import { SimpleGrid } from "@mantine/core";
import { useQuery } from "react-query";
import { getProjects } from "../../services/projects";
import ProjectsFilter from "./ProjectsFilter";
import ProjectsCard from "./ProjectsCard";

export default function Projects() {
  const query = useQuery("project", getProjects);

  return (
    <>
      <ProjectsFilter />

      <SimpleGrid
        spacing="md"
        mt="md"
        cols={4}
        breakpoints={[
          { maxWidth: "xs", cols: 1 },
          { maxWidth: "sm", cols: 2 },
          { maxWidth: "md", cols: 3 },
          { maxWidth: "lg", cols: 3 },
        ]}
      >
        {query.isFetched && query.data.map(project => (
          <ProjectsCard key={project.id} project={project} />
        ))}
      </SimpleGrid>
    </>
  );
}