import { Button, Group, NumberInput, Select, Text } from "@mantine/core";
import { useCallback, useState } from "react";
import { addProject, addVerifiedCarbon, removeVerifiedCarbon } from "../../store/contract";
import projectsData from "../../data/projects";

export default function OwnerProjectsModal() {
  const [project, setProject] = useState(null);
  const projects = useCallback(projectsData.map(p => ({ label: p.name, value: p.id })));

  // TODO: implement
  async function handleAddProject(accountId, verifiedCarbonKg) {
    const response = await addProject(accountId, verifiedCarbonKg);
    console.log(response);
  }

  // TODO: implement
  async function handleAddVerifiedCarbon() {
    return;
  }

  // TODO: implement
  async function handleRemoveVerifiedCarbon() {
    return;
  }

  function handleChangeProject(id) {
    setProject(projects.find(p => p.value === id));
  }

  function handleCreateProject(name) {
    const newProject = { name, id: Math.random() * (1000-100) + 100 };
    projectsData.push(newProject);
  }

  console.log(project);

  return (
    <>
      <Select
        creatable
        searchable
        placeholder="Select or create a project"
        label={<Text size="xs" color="dimmed">Project Name</Text>}
        value={project?.value}
        zIndex={1000}
        getCreateLabel={(query) => <Text size="sm" color="indigo" weight={500}>Create {query}</Text>}
        data={projects}
        sx={{flex:1}}
        onChange={handleChangeProject}
        onCreate={handleCreateProject}
      />

      {project && (
        <Group mt="md" align="end">
          <NumberInput
            label={<Text size="xs" color="dimmed">Verified Carbon (KG)</Text>}
            sx={{flex:1}}
          />
          <Button size="sm">Set</Button>
        </Group>
      )}
    </>
  );
}
