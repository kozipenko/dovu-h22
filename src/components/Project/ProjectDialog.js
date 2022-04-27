import { Group, Modal } from "@mantine/core";
import { useProjects } from "../../store/projects";

export default function ProjectDialog() {
  const projects = useProjects();

  return (
    <Modal
      zIndex={1000}
      title={projects?.selected?.name}
      opened={projects.selected !== null}
      onClose={projects.deselect}
    >
      <Group position="apart">
        
      </Group>
    </Modal>
  );
}