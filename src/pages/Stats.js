import { useEffect, useState } from "react";
import { Card, Group, Text } from "@mantine/core";
import { useQuery } from "react-query";
import { getTreasuryBalance, TOKEN_NAME} from "../services/contract";
import { getProjects } from "../services/projects";

export default function Staking() {
  const query = useQuery("projects", getProjects);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    getTreasuryBalance().then(setTreasuryBalance);
  }, []);

  useEffect(() => {  
    query.isSuccess && setTotalProjects(query.data.length);
  }, [query]);

  return (
    <Group>
      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Treasury Balance
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {treasuryBalance.toLocaleString()}
          <Text component="span" ml="xs">{TOKEN_NAME}</Text>
        </Text>
      </Card>

      <Card p="md" radius="md" shadow="xs">
        <Text size="xs" color="dimmed" weight={700}>
          Total Projects
        </Text>
        <Text mt="xs" size="xl" weight={500}>
          {totalProjects}
        </Text>
      </Card>
    </Group>
  );
}