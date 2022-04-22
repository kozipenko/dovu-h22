import { SimpleGrid } from "@mantine/core";
import { useProjects } from "../store/projects";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import ProjectFilters from "../components/ProjectFilters";

export default function HomeRoute() {
  const projects = useProjects();

  return (
    <>
      <ProjectFilters />

      <SimpleGrid
        spacing="xl"
        mt="md"
        cols={4}
        breakpoints={[
          { maxWidth: "xs", cols: 1 },
          { maxWidth: "sm", cols: 2 },
          { maxWidth: "md", cols: 3 },
          { maxWidth: "lg", cols: 3 },
        ]}
      >
        {projects.data.map(p =>
          <ProjectCard
            key={p.id}
            name={p.name}
            coverImg={p.coverImg}
            maxApy={p.maxApy}
            onSelect={() => projects.openProject(p.id)}
          />
        )}
      </SimpleGrid>

      <ProjectModal />
    </>
  );
}