import { Group, Modal, Text } from "@mantine/core";
import { useProjects } from "../../store/projects";

export default function ProjectDialog() {
  const projects = useProjects();

  return (
    <Modal
      title={projects?.selected?.name}
      opened={projects.selected !== null}
      onClose={projects.deselect}
    >
      <Group position="apart">
        
      </Group>
    </Modal>
  );
}