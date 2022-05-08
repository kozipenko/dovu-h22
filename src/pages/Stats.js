import { useEffect, useState } from "react";
import { Group, Paper, Text } from "@mantine/core";
import { getAccountBalance } from "../services/wallet";
import { getTreasuryBalance, TOKEN_NAME} from "../services/contract";

export default function Staking() {
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);

  useEffect(() => {
    getAccountBalance().then(setAccountBalance);
    getTreasuryBalance().then(setTreasuryBalance);
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