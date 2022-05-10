import { useEffect, useState } from "react";
import { Card, Group, Text } from "@mantine/core";
import { getTreasuryBalance, TOKEN_NAME} from "../services/contract";
import useProjects from "../hooks/useProjects";
import usePositions from "../hooks/usePositions";

export default function Staking() {
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const { projects } = useProjects();
  const { positions } = usePositions();

  const totalProjects = projects.isSuccess && projects.data.length;

  const totalOpenPositions = positions.isSuccess && positions.data
    .filter(pos => pos.is_open).length;

  const totalStakedTokens = positions.isSuccess && positions.data
    .reduce((acc, obj) => acc + obj.dov_staked + obj.surrendered_dov, 0);

  const totalSurrenderedTokens = positions.isSuccess && positions.data
    .reduce((acc, obj) => acc + obj.surrendered_dov, 0);


  useEffect(() => {
    getTreasuryBalance().then(setTreasuryBalance);
  }, []);

  return (
    <Group>
      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Total Projects
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {totalProjects}
        </Text>
      </Card>

      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Treasury Balance
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {treasuryBalance.toLocaleString()} {TOKEN_NAME}
        </Text>
      </Card>

      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Open Positions
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {totalOpenPositions}
        </Text>
      </Card>

      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Total Staked
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {totalStakedTokens.toLocaleString()} {TOKEN_NAME}
        </Text>
      </Card>

      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Total Surrendered
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {totalSurrenderedTokens.toLocaleString()} {TOKEN_NAME}
        </Text>
      </Card>
    </Group>
  );
}