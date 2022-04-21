import { Box, Modal, SegmentedControl, Text } from "@mantine/core";
import { useState } from "react";
import { useProject } from "../store/project";

export default function ProjectModal() {
  const [display, setDisplay] = useState("Offsets");
  const project = useProject();

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
      title={<Text weight={700}>{project.data.name}</Text>}
      opened={project.isModalOpen}
      onClose={project.close}
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