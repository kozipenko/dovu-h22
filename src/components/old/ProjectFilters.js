import { Button, Checkbox, CheckboxGroup, Drawer, Group, RangeSlider, Text } from "@mantine/core";
import { Filter } from "tabler-icons-react";
import { useProjects } from "../store/projects";

export default function ProjectFilters() {
  const projects = useProjects();

  return (
    <>
      <Button variant="outline" leftIcon={<Filter size={18} />} onClick={projects.openFilters}>
        Filters
      </Button>

      <Drawer
        title={<Text weight={700}>Filters</Text>}
        padding="md"
        opened={projects.isFiltersOpen}
        onClose={projects.closeFilters}
      >
        <Text size="sm" color="dimmed" weight={700}>Price</Text>
        <Group position="apart" mt="sm" mb="xs">
          <Text size="xs" weight={700}>${projects.filters.prices[0]}</Text>
          <Text size="xs" weight={700}>${projects.filters.prices[1]}</Text>
        </Group>
        <RangeSlider
          min={0}
          max={50}
          label={null}
          value={projects.filters.prices}
          onChange={(prices) => projects.setPriceFilter(prices)}
        />

        <Text mt="xl" size="sm" color="dimmed" weight={700}>Total Supply</Text>
        <Group position="apart" mt="sm" mb="xs">
          <Text size="xs" weight={700}>{projects.filters.supplies[0]} tonnes</Text>
          <Text size="xs" weight={700}>{projects.filters.supplies[1]} tonnes</Text>
        </Group>
        <RangeSlider
          min={0}
          max={50}
          label={null}
          value={projects.filters.supplies}
          onChange={(supplies) => projects.setSuppliesFilter(supplies)}
        />

        <Text mt="xl" size="sm" color="dimmed" weight={700}>Measurement</Text>
        <CheckboxGroup mt="sm" defaultValue={["agrecalc", "cool-farm-tool"]}>
          <Checkbox value="agrecalc" label="Agrecalc" />
          <Checkbox value="cool-farm-tool" label="Cool Farm Tool" />
        </CheckboxGroup>
        
        <Text mt="xl" size="sm" color="dimmed" weight={700}>Carbon Proofs</Text>
        <Checkbox mt="sm" label="Yes" />
      </Drawer>
    </>
  );
}