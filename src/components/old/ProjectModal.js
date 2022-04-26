import { Box, Modal, SegmentedControl, Text } from "@mantine/core";
import { useState } from "react";
import { useProjects } from "../store/projects";

export default function ProjectModal() {
  const [display, setDisplay] = useState("Offsets");
  const projects = useProjects();

  const renderOffsets = () => (
    <Box mt="md">
      <Text>Offsets</Text>
    </Box>
  );

  const renderStaking = () => (
    <Box mt="md">
      <Text>Staking</Text>
    </Box>
  );

  return (
    <Modal
      title={<Text weight={700}>{projects.activeProject.name}</Text>}
      opened={projects.isProjectOpen}
      onClose={projects.closeProject}
    >
      <SegmentedControl
        fullWidth
        color="indigo"
        value={display}
        onChange={setDisplay}
        data={["Offsets","Staking"]}
      />

      {display === "Offsets" && renderOffsets()}
      {display === "Staking" && renderStaking()}
    </Modal>
  );
}