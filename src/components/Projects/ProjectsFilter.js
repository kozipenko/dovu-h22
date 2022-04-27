import { useState } from "react";
import { ActionIcon, Button, Checkbox, CheckboxGroup, Drawer, Group, RangeSlider, Text, TextInput } from "@mantine/core";
import { Filter, Search, X } from "tabler-icons-react";
import { useProjects } from "../../store/projects";

export default function ProjectsFilters() {
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState("");
  const [prices, setPrices] = useState([0, 50]);
  const [supplies, setSupplies] = useState([0, 100]);
  const [apy, setApy] = useState([0, 100]);
  const projects = useProjects();

  const resetFilters = () => {
    projects.resetFilters();
    setPrices([0, 50]);
    setSupplies([0, 100]);
  }

  const handleSearch = (text) => {
    setSearch(text);
    projects.filterByText(text);
  }

  return (
    <>
      <Group>
        <ActionIcon size="lg" variant="outline" color="indigo" onClick={() => setOpened(true)}>
          <Filter size={18} />
        </ActionIcon>

        <TextInput
          placeholder="Search"
          value={search}
          icon={<Search size={18} />}
          rightSection={search && (
            <ActionIcon onClick={() => handleSearch("")}>
              <X size={18} />
            </ActionIcon>
          )}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Group>

      <Drawer
        title="Filters"
        padding="md"
        zIndex={1000}
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <Text size="sm" mt="xl" color="dimmed" weight={700}>Carbon Offset Price</Text>
        <Group position="apart" mt="sm" mb="xs">
          <Text size="xs" weight={700}>Min: ${prices[0]}</Text>
          <Text size="xs" weight={700}>Max: ${prices[1]}</Text>
        </Group>
        <RangeSlider
          min={0}
          max={50}
          minRange={1}
          label={null}
          value={prices}
          onChange={(value) => setPrices(value)}
          onChangeEnd={(value) => projects.filterByPrice(value)}
        />

        <Text mt="xl" size="sm" color="dimmed" weight={700}>Total Carbon Supply</Text>
        <Group position="apart" mt="sm" mb="xs">
          <Text size="xs" weight={700}>Min: {supplies[0]}t</Text>
          <Text size="xs" weight={700}>Max: {supplies[1]}t</Text>
        </Group>
        <RangeSlider
          min={0}
          max={100}
          minRange={1}
          label={null}
          value={supplies}
          onChange={(value) => setSupplies(value)}
          onChangeEnd={(value) => projects.filterBySupply(value)}
        />

        <Text mt="xl" size="sm" color="dimmed" weight={700}>Staking APY</Text>
        <Group position="apart" mt="sm" mb="xs">
          <Text size="xs" weight={700}>Min: {apy[0]}%</Text>
          <Text size="xs" weight={700}>Max: {apy[1]}%</Text>
        </Group>
        <RangeSlider
          min={0}
          max={100}
          minRange={1}
          label={null}
          value={apy}
          onChange={(value) => setApy(value)}
          onChangeEnd={(value) => projects.filterByApy(value)}
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