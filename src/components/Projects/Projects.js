import { SimpleGrid } from "@mantine/core";
import { useProjects } from "../../store/projects";
import Project from "../Project/Project";
import ProjectPurchaseDialog from "../Project/ProjectPurchaseDialog";
import ProjectDelegateDialog from "../Project/ProjectDelegateDialog";
import ProjectsFilter from "./ProjectsFilter";

export default function Projects() {
  const projects = useProjects();

  return (
    <>
      <ProjectsFilter />
      <ProjectPurchaseDialog />
      <ProjectDelegateDialog />

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
          <Project
            key={project.id}
            project={project}
            onPurchase={() => projects.openPurchaseDialog(project.id)}
            onDelegate={() => projects.openDelegateDialog(project.id)}
          />
        ))}
      </SimpleGrid>
    </>
  );
}