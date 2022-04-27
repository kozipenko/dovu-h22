import { Badge, Card, createStyles, Divider, Group, Image, Stack, Text } from "@mantine/core";

const useStyles = createStyles(theme => ({
  root: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
    transition: "all .1s ease-in-out",
    cursor: "pointer",
    ":hover": { transform: "scale(1.015)" }
  }
}));

export default function Project({ project, onSelect }) {
  const { classes } = useStyles();
  
  return (
    <Card p={0} className={classes.root} onClick={onSelect}>
      <Card.Section>
        <Image src={project.coverImg} height={160} />
      </Card.Section>

      <Card.Section p="md">
        <Stack>
          <Text weight={500}>{project.name}</Text>
          <Group position="apart">
            <Text align="center" size="sm" color="green" weight={900}>
              <Text size="xs" color="dimmed" weight={500}>PRICE</Text> ${project.price}
            </Text>
            <Text align="center" size="sm" color="cyan" weight={900}>
              <Text size="xs" color="dimmed" weight={500}>SUPPLY</Text> {project.supplyRemaining}t
            </Text>
            <Text align="center" size="sm" color="indigo" weight={900}>
              <Text size="xs" color="dimmed" weight={500}>APY</Text> {project.maxApy}%
            </Text>
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
}