import { useEffect, useState } from "react";
import { Group, Paper, Text } from "@mantine/core";
import { getAccountBalance, getTreasuryBalance, TOKEN_NAME } from "../store/contract";

export default function Staking() {
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);

  async function loadTreasuryBalance() {
    const balance = await getTreasuryBalance();
    setTreasuryBalance(balance);
  }

  async function loadAccountBalance() {
    const balance = await getAccountBalance();
    setAccountBalance(balance);
  }

  useEffect(() => {
    loadTreasuryBalance();
    loadAccountBalance();
  }, []);

  return (
    <Group>
      <Paper withBorder p="md" radius="md">
        <Text size="xs" color="dimmed" weight={700}>
          Treasury Balance
        </Text>
        <Text mt="xs" weight={500} sx={{ fontSize: 24 }}>
          {treasuryBalance.toLocaleString()} {TOKEN_NAME}
        </Text>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Text size="xs" color="dimmed" weight={700}>
          Account Balance
        </Text>
        <Text mt="xs" weight={500} sx={{ fontSize: 24 }}>
          {accountBalance.toLocaleString()} {TOKEN_NAME}
        </Text>
      </Paper>
    </Group>
  );
}