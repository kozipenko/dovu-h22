import { SimpleGrid } from "@mantine/core";
import { useProjects } from "../../store/projects";
import Project from "../Project/Project";
import ProjectDialog from "../Project/ProjectDialog";
import ProjectsFilter from "./ProjectsFilter";

export default function Projects() {
  const projects = useProjects();

  return (
    <>
      <ProjectsFilter />
      <ProjectDialog />

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
        {projects.data.map(project => (
          <Project key={project.id} project={project} onSelect={() => projects.select(project.id)} />
        ))}
      </SimpleGrid>
    </>
  );
}