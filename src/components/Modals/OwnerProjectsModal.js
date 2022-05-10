import { useState } from "react";
import { Button, Group, Select, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import useProjects from "../../hooks/useProjects";

export default function OwnerProjectsModal({ context, id }) {
  const [project, setProject] = useState(null);
  const { projects } = useProjects();
  const modals = useModals();

  function handleOpenOwnerProjectsEditModal() {
    modals.openContextModal("ownerEditProject", {
      title: `Edit ${project.name}`,
      innerProps: { project }
    });
  }

  function handleOpenOwnerProjectsNewModal() {
    modals.openContextModal("ownerNewProject", {
      title: "Create New Project"
    });
  }

  function handleProjectChange(id) {
    setProject(projects.data.find(p => p.id === id));
  }
 
  return (
    <>
      <Group align="end">
        <Select
          clearable
          placeholder="Select Project"
          label={<Text size="xs" color="dimmed">Project</Text>}
          zIndex={1000}
          value={project?.id}
          data={projects.isSuccess ? projects.data.map(p => ({ label: p.name, value: p.id })) : []}
          onChange={handleProjectChange}
          sx={{flex: 1}}
        />
        <Button
          variant="light"
          color="green"
          disabled={!project}
          onClick={handleOpenOwnerProjectsEditModal}
        >
          Edit
        </Button>
      </Group>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          onClick={handleOpenOwnerProjectsNewModal}
        >
          New
        </Button>
      </Group>
    </>
  );
}
