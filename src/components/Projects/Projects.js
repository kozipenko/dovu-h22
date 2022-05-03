import { SimpleGrid } from "@mantine/core";
import { useProjects } from "../../store/projects";
import ProjectsFilter from "./ProjectsFilter";
import ProjectsCard from "./ProjectsCard";

export default function Projects() {
  const projects = useProjects();

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
        {projects.filtered.map(project => (
          <ProjectsCard key={project.id} project={project} />
        ))}
      </SimpleGrid>
    </>
  );
}