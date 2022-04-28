import { Modal } from "@mantine/core";
import { useProjects } from "../../store/projects";

export default function ProjectDelegateDialog() {
  const projects = useProjects();

  return (
    <Modal
      zIndex={1000}
      title={projects?.selected?.name}
      opened={projects.isDelegateDialogOpen}
      onClose={projects.closeDialog}
    >
      <span>Delegate</span>
    </Modal>
  );
}