import { useState } from "react";
import { Button, Checkbox, CheckboxGroup, Drawer, Group, RangeSlider, Text } from "@mantine/core";
import { Filter } from "tabler-icons-react";
import { useProjects } from "../../store/projects";

export default function ProjectsFilters() {
  const [opened, setOpened] = useState(false);
  const [prices, setPrices] = useState([0, 50]);
  const [supplies, setSupplies] = useState([0, 100]);
  const projects = useProjects();

  const resetFilters = () => {
    projects.resetFilters();
    setPrices([0, 50]);
    setSupplies([0, 100]);
  }

  return (
    <>
      <Button variant="outline" leftIcon={<Filter size={18} />} onClick={() => setOpened(true)}>
        Filters
      </Button>

      <Drawer
        title="Filters"
        padding="md"
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <Text size="sm" mt="xl" color="dimmed" weight={700}>Price</Text>
        <Group position="apart" mt="sm" mb="xs">
          <Text size="xs" weight={700}>${prices[0]}</Text>
          <Text size="xs" weight={700}>${prices[1]}</Text>
        </Group>
        <RangeSlider
          min={0}
          max={50}
          label={null}
          value={prices}
          onChange={(value) => setPrices(value)}
          onChangeEnd={(value) => projects.filterByPrice(value)}
        />

        <Text mt="xl" size="sm" color="dimmed" weight={700}>Total Supply</Text>
        <Group position="apart" mt="sm" mb="xs">
          <Text size="xs" weight={700}>{supplies[0]} tonnes</Text>
          <Text size="xs" weight={700}>{supplies[1]} tonnes</Text>
        </Group>
        <RangeSlider
          min={0}
          max={50}
          label={null}
          value={supplies}
          onChange={(value) => setSupplies(value)}
          onChangeEnd={(value) => projects.filterBySupply(value)}
        />

        <Text mt="xl" size="sm" color="dimmed" weight={700}>Measurement</Text>
        <CheckboxGroup mt="sm" defaultValue={["agrecalc", "cool-farm-tool"]}>
          <Checkbox value="agrecalc" label="Agrecalc" />
          <Checkbox value="cool-farm-tool" label="Cool Farm Tool" />
        </CheckboxGroup>
        
        <Text mt="xl" size="sm" color="dimmed" weight={700}>Carbon Proofs</Text>
        <Checkbox mt="sm" label="Yes" />

        <Button mt="xl" onClick={resetFilters}>Reset</Button>
      </Drawer>
    </>
  );
}