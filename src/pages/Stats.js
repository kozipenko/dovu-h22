import { Card, Group, Text } from "@mantine/core";
import { TOKEN_NAME } from "../utils/constants";
import useApi from "../hooks/api";

export default function Staking() {
  const { getTreasuryBalance, getProjects, getPositions } = useApi();

  const totalOpenPositions = getPositions.data
    .filter(pos => !pos.is_closed).length;

  const totalStakedTokens = getPositions.data
    .reduce((acc, obj) => acc + obj.dov_staked + obj.surrendered_dov, 0);

  const totalSurrenderedTokens = getPositions.data
    .reduce((acc, obj) => acc + obj.surrendered_dov, 0);

  return (
    <Group>
      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Total Projects
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {getProjects.data.length}
        </Text>
      </Card>

      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Treasury Balance
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {getTreasuryBalance.data.toLocaleString()} {TOKEN_NAME}
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