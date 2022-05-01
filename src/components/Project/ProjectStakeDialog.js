import { useState } from "react";
import { Button, Checkbox, Group, Modal, NumberInput, Select, Text } from "@mantine/core";
import { closeDialogs, useProjects } from "../../store/projects";

export default function ProjectStakeDialog() {
  const [amount, setAmount] = useState(0);
  const [term, setTerm] = useState("1");
  const projects = useProjects();

  return (
    <Modal
      zIndex={1000}
      title={projects?.active?.name}
      opened={projects.isStakeDialogOpen}
      onClose={closeDialogs}
    >
      <Group spacing="xs">
        <NumberInput
          hideControls
          sx={{ flex: 1 }}
          description="Amount (DOV)"
          placeholder="DOV"
          value={amount}
          onChange={setAmount}
        />
        <Select
          description="Term (Years)"
          zIndex={1000}
          value={term}
          sx={{ maxWidth: 76 }}
          data={["1","2","3","4","5","6","7","8","9","10"]}
          onChange={setTerm}
        />
      </Group>
      
      <Text mt="md" size="xs" color="dimmed">Rewards (DOV)</Text>
      <Group mt="xs" position="apart">
        <Text align="center" size="xs" weight={500}>
          Daily
          <Text size="lg" color="indigo" weight={700}>200</Text>
        </Text>

        <Text align="center" size="xs" weight={500}>
          Weekly
          <Text size="lg" color="indigo" weight={700}>300</Text>
        </Text>

        <Text align="center" size="xs" weight={500}>
          Monthly
          <Text size="lg" color="indigo" weight={700}>400</Text>
        </Text>

        <Text align="center" size="xs" weight={500}>
          Total
          <Text size="lg" color="indigo" weight={700}>500</Text>
        </Text>
        <Text align="center" size="xs" weight={500}>
          APY
          <Text size="lg" color="indigo" weight={700}>24%</Text>
        </Text>
      </Group>

      <Checkbox mt="xl" size="xs" label="I agree to the User Agreement and Privacy Policy" />
      <Button mt="md" variant="light">Stake</Button>
    </Modal>
  );
}