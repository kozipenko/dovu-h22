import { SimpleGrid } from "@mantine/core";
import ProjectCard from "../components/ProjectCard";
import projects from "../data/projects";

export default function HomeRoute() {

  return (
    <div>
      <SimpleGrid
        spacing="lg"
        cols={4}
        breakpoints={[
          { maxWidth: "xs", cols: 1 },
          { maxWidth: "sm", cols: 2 },
          { maxWidth: "md", cols: 3 },
          { maxWidth: "lg", cols: 4 },
        ]}
      >
      { projects.map(project => <ProjectCard key={project.id} project={project} />)}
      </SimpleGrid>
    </div>
  );
}