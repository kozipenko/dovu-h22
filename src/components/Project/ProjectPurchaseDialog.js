import { Modal } from "@mantine/core";
import { useProjects } from "../../store/projects";

export default function ProjectPurchaseDialog() {
  const projects = useProjects();

  return (
    <Modal
      zIndex={1000}
      title={projects?.selected?.name}
      opened={projects.isPurchaseDialogOpen}
      onClose={projects.closeDialog}
    >
      <span>Purchase</span>
    </Modal>
  );
}