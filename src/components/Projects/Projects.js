import { SimpleGrid } from "@mantine/core";
import { useProjects } from "../../store/projects";
import Project from "../Project/Project";
import ProjectPurchaseDialog from "../Project/ProjectPurchaseDialog";
import ProjectStakeDialog from "../Project/ProjectStakeDialog";
import ProjectsFilter from "./ProjectsFilter";

export default function Projects() {
  const projects = useProjects();

  return (
    <>
      <ProjectsFilter />
      <ProjectPurchaseDialog />
      <ProjectStakeDialog />

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
          <Project key={project.id} data={project} />
        ))}
      </SimpleGrid>
    </>
  );
}