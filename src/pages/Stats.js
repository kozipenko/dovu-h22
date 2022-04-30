import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import { useEffect } from "react";
import { getTreasuryBalance, useContract } from "../store/contract";

export default function Staking() {
  const contract = useContract();

  useEffect(() => {
    getTreasuryBalance();
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