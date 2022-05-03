import { Group, Paper, Text } from "@mantine/core";
import { useEffect } from "react";
import { loadTreasuryBalance, useContract } from "../store/contract";

export default function Staking() {
  const contract = useContract();

  useEffect(() => {
    loadTreasuryBalance();
  }, []);

  return (
    <Group position="apart">
      <Paper withBorder p="md" radius="md">
        <Text size="xs" color="dimmed" weight={700}>
          Treasury Balance
        </Text>
        <Text mt="xs" weight={500} sx={{ fontSize: 24 }}>
          {contract.treasuryBalance}
        </Text>
      </Paper>
    </Group>
  );
}