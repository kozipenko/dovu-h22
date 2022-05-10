import { useEffect, useState } from "react";
import { Card, Group, Text } from "@mantine/core";
import { useQuery } from "react-query";
import { getTreasuryBalance, TOKEN_NAME} from "../services/contract";
import { getAllActiveStakingPositions, getAllStakedTokens, getAllSurrenderedTokens, getProjects } from "../services/api";

export default function Staking() {
  const query = useQuery("projects", getProjects);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [allStakedTokens, setAllStakedTokens] = useState(0);
  const [allSurrenderedTokens, setAllSurrenderedTokens] = useState(0);
  const [allActiveStakingPositions, setAllActiveStakingPositions] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    getTreasuryBalance().then(setTreasuryBalance);
    getAllStakedTokens().then(setAllStakedTokens);
    getAllSurrenderedTokens().then(setAllSurrenderedTokens);
    getAllActiveStakingPositions().then(setAllActiveStakingPositions);
  }, []);

  useEffect(() => {  
    query.isSuccess && setTotalProjects(query.data.length);
  }, [query]);

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
          Active Positions
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {allActiveStakingPositions}
        </Text>
      </Card>

      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Total Staked
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {allStakedTokens.toLocaleString()} {TOKEN_NAME}
        </Text>
      </Card>

      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Total Surrendered
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {allSurrenderedTokens.toLocaleString()} {TOKEN_NAME}
        </Text>
      </Card>
    </Group>
  );
}