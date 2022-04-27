import { useState } from "react";
import { ActionIcon, Button, Checkbox, CheckboxGroup, Drawer, Group, RangeSlider, Text, TextInput } from "@mantine/core";
import { Filter, Search, X } from "tabler-icons-react";
import { useProjects } from "../../store/projects";

export default function ProjectsFilters() {
  const [opened, setOpened] = useState(false);
  const projects = useProjects();

  return (
    <>
      <Group>
        <ActionIcon size="lg" variant="outline" color="indigo" onClick={() => setOpened(true)}>
          <Filter size={18} />
        </ActionIcon>

        <TextInput
          placeholder="Search"
          value={projects.filters.search}
          icon={<Search size={18} />}
          rightSection={projects.filters.search && (
            <ActionIcon onClick={() => projects.setSearchFilter("")}>
              <X size={18} />
            </ActionIcon>
          )}
          onChange={(e) => projects.setSearchFilter(e.target.value)}
        />
      </Group>

      <Drawer
        title="Filters"
        padding="md"
        zIndex={1000}
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <Text size="sm" mt="xl" weight={500}>Carbon Offset Price</Text>
        <RangeSlider
          mt="xs"
          min={0}
          max={50}
          minRange={1}
          label={null}
          value={projects.filters.price}
          onChange={projects.setPriceFilter}
        
        />
        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed" weight={500}>${projects.filters.price[0]}</Text>
          <Text size="xs" color="dimmed" weight={500}>${projects.filters.price[1]}</Text>
        </Group>
          
        <Text mt="xl" size="sm" weight={500}>Carbon Supply Remaining</Text>
        <RangeSlider
          mt="xs"
          min={0}
          max={100}
          minRange={1}
          label={null}
          value={projects.filters.supply}
          onChange={projects.setSupplyFilter}
        />
        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed" weight={500}>{projects.filters.supply[0]}t</Text>
          <Text size="xs" color="dimmed" weight={500}>{projects.filters.supply[1]}t</Text>
        </Group>

        <Text mt="xl" size="sm" weight={500}>Staking APY</Text>
        <RangeSlider
          mt="xs"
          min={0}
          max={50}
          minRange={1}
          label={null}
          value={projects.filters.maxApy}
          onChange={projects.setMaxApyFilter}
        />
        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed" weight={500}>{projects.filters.maxApy[0]}%</Text>
          <Text size="xs" color="dimmed" weight={500}>{projects.filters.maxApy[1]}%</Text>
        </Group>

        <Text mt="xl" size="sm" color="dimmed" weight={700}>Measurement</Text>
        <CheckboxGroup mt="sm" defaultValue={["agrecalc", "cool-farm-tool"]}>
          <Checkbox value="agrecalc" label="Agrecalc" />
          <Checkbox value="cool-farm-tool" label="Cool Farm Tool" />
        </CheckboxGroup>
        
        <Text mt="xl" size="sm" color="dimmed" weight={700}>Carbon Proofs</Text>
        <Checkbox mt="sm" label="Yes" />

        <Button mt="xl" onClick={projects.resetFilters}>Reset</Button>
      </Drawer>
    </>
  );
}