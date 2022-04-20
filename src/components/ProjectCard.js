import { Badge, Button, Card, createStyles, Group, Image, Progress, Stack, Text } from "@mantine/core";

const useStyles = createStyles(theme => ({
  section: {
    borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`
  }
}));

export default function ProjectCard({ project }) {
  const { classes } = useStyles();

  return (
    <Card p="md" shadow="sm" radius="md">
      <Card.Section>
        <Image src={project.img} height={180} />
      </Card.Section>

      <Card.Section mt="sm" px="sm" >
        <Group position="apart">
          <Text size="sm" weight={500}>{project.name}</Text>
          <Badge radius="xs" size="sm">{project.type}</Badge>
        </Group>
      </Card.Section>

      <Card.Section mt="sm" px="sm" pb="sm" className={classes.section}>
        <Group>
          <Badge size="sm" radius="xs" variant="outline">{project.apy_1y}% APY 1Y</Badge>
          <Badge size="sm" radius="xs" variant="outline">{project.apy_2y}% APY 2Y</Badge>
        </Group>
      </Card.Section>

      <Card.Section mt="sm" px="sm" pb="sm" className={classes.section}>
        <Stack spacing="xs">
          <div>
            <Text size="xs" color="dimmed">Carbon available</Text>
            <Progress mt={4} size="xl" color="green" label={`${project.remaining_carbon}%`} value={project.remaining_carbon} />
          </div>
          <div>
            <Text size="xs" color="dimmed">Collateral Risk</Text>
            <Progress mt={4} size="xl" color="blue" label={`${project.collateral_risk}%`} value={project.collateral_risk} />
          </div>
        </Stack>
      </Card.Section>

      <Card.Section mt="sm" px="sm" pb="sm">
        <Group position="center">
          <Button size="xs" color="green" variant="light">Purchase</Button>
          <Button size="xs" color="blue" variant="light">Delegate</Button>
        </Group>
      </Card.Section>
    </Card>
  );
}