import { SimpleGrid } from "@mantine/core";
import { useProject } from "../store/project";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import projects from "../data/projects";

export default function HomeRoute() {
  const project = useProject();

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
        {projects.map(p =>
          <ProjectCard
            key={p.id}
            name={p.name}
            coverImg={p.coverImg}
            maxApy={p.maxApy}
            onSelect={() => project.open(p)}
          />
        )}
      </SimpleGrid>

      <ProjectModal />
    </div>
  );
}