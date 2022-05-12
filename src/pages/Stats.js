import { Card, Group, Text } from "@mantine/core";
import { TOKEN_NAME } from "../utils/constants";
import { useApi } from "../services/api";

export default function Staking() {
  const api = useApi();

  const totalOpenPositions = api.positions.data
    .filter(pos => !pos.is_closed).length;

  const totalStakedTokens = api.positions.data
    .reduce((acc, obj) => acc + obj.dov_staked, 0);

  const totalSurrenderedTokens = api.positions.data
    .reduce((acc, obj) => acc + obj.surrendered_dov, 0);

  return (
    <Group>
      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Total Projects
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {api.projects.data.length}
        </Text>
      </Card>

      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Treasury Balance
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {api.treasuryBalance.data.toLocaleString()} {TOKEN_NAME}
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