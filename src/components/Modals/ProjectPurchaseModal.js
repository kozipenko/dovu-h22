import { useState } from "react";
import { Button, Group, NumberInput, Paper, Text } from "@mantine/core";
import { Leaf } from "tabler-icons-react";

export default function ProjectPurchaseModal({ context, id, innerProps }) {
  const [amount, setAmount] = useState(0);
  const [cost, setCost] = useState(0);
  
  // TOOD
  async function handleOffsetPurchase() {
    // Implement USER contract method to remove verified_kg
  }

  function handleChangeAmount(value) {
    setAmount(value);
    setCost(value * innerProps.project.price_kg);
  }

  return (
    <>
      <Paper withBorder mt="xl" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Price:</Text>
          <Text size="xs" weight={500}>${innerProps.project.price_kg.toLocaleString()}</Text>
        </Group>
        
        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Supply Remaining:</Text>
          <Text size="xs" weight={500}>{innerProps.project.verified_kg.toLocaleString()} kg</Text>
        </Group>
      </Paper>

      <NumberInput
        mt="xl"
        description="Amount (kg)"
        icon={<Leaf size={18} />}
        min={0}
        value={amount}
        onChange={handleChangeAmount}
      />

      <Text mt="xs" size="xs">Order Total: ${cost.toLocaleString()}</Text>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={amount > innerProps.project.verified_kg}
          onClick={handleOffsetPurchase}
        >
          Purchase
        </Button>
      </Group>
    </>
  );
}