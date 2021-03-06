import { useState } from "react";
import { ActionIcon, Button, Drawer, Group, RangeSlider, Text, TextInput } from "@mantine/core";
import { Filter, Search, X } from "tabler-icons-react";

export default function ProjectsFilter({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultValue] = useState(value);
  const [search, setSearch] = useState(value.search);
  const [priceKg, setPriceKg] = useState(value.priceKg);
  const [verifiedKg, setVerifiedKg] = useState(value.verifiedKg);

  function handleSearchChange(event) {
    setSearch(event.currentTarget.value);
    onChange({ search: event.currentTarget.value, priceKg, verifiedKg });
  }

  function handlePriceKgChange(newPriceKg) {
    setPriceKg(newPriceKg);
    onChange({ search, priceKg: newPriceKg, verifiedKg });
  }

  function handleVerifiedKgChange(newVerifiedKg) {
    setVerifiedKg(newVerifiedKg);
    onChange({ search, priceKg, verifiedKg: newVerifiedKg });
  }

  function handleResetSearch() {
    setSearch("");
    onChange({ search: "", priceKg, verifiedKg });
  }

  function handleReset() {
    setSearch(defaultValue.search);
    setPriceKg(defaultValue.priceKg);
    setVerifiedKg(defaultValue.verifiedKg);
    onChange({ search: defaultValue.search, priceKg: defaultValue.priceKg, verifiedKg: defaultValue.verifiedKg });
  }

  return (
    <>
      <ActionIcon size="lg" variant="light" color="indigo" onClick={() => setIsOpen(true)}>
        <Filter size={18} />
      </ActionIcon>

      <Drawer
        title="Filters"
        position="right"
        padding="md"
        zIndex={1000}
        opened={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Text size="sm" mt="xl" color="dimmed" weight={500}>Price</Text>
        <RangeSlider
          mt="xs"
          min={0}
          max={100}
          minRange={1}
          label={null}
          value={priceKg}
          onChange={handlePriceKgChange}
        
        />
        <Group position="apart" mt="xs">
          <Text size="xs" weight={500}>${priceKg[0]}</Text>
          <Text size="xs" weight={500}>${priceKg[1]}</Text>
        </Group>
          
        <Text mt="xl" size="sm" color="dimmed" weight={500}>Supply</Text>
        <RangeSlider
          mt="xs"
          min={0}
          max={5000}
          minRange={1}
          label={null}
          value={verifiedKg}
          onChange={handleVerifiedKgChange}
        />
        <Group position="apart" mt="xs">
          <Text size="xs" weight={500}>{verifiedKg[0]} kg</Text>
          <Text size="xs" weight={500}>{verifiedKg[1]} kg</Text>
        </Group>

        <Text mt="xl" size="sm" color="dimmed" weight={500}>Search</Text>
        <TextInput
          placeholder="Search"
          mt="xs"
          value={search}
          icon={<Search size={18} />}
          rightSection={search && (
            <ActionIcon onClick={handleResetSearch}>
              <X size={18} />
            </ActionIcon>
          )}
          onChange={handleSearchChange}
        />
        
        <Button fullWidth mt="xl" variant="light" onClick={handleReset}>
          Reset
        </Button>
      </Drawer>
    </>
  );
}