import { Badge, Card, createStyles, Group, Image, Stack, Text } from "@mantine/core";

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

export default function ProjectCard({ name, coverImg, maxApy, onSelect }) {
  const { classes } = useStyles();

  return (
    <Card className={classes.root} onClick={onSelect}>
      <Card.Section>
        <Image src={coverImg} height={160} />
      </Card.Section>
      
      <Card.Section p="md">
        <Stack spacing="xs">
          <Group position="apart">
            <Text weight={500}>{name}</Text>
            <Text align="center" size="sm" weight={900} color="indigo">
              {maxApy}% <Text size="xs" color="dimmed">APY</Text>
            </Text>
          </Group>
          <Group spacing="xs">
            <Badge radius="xs" size="xs" color="cyan">New</Badge>
            <Badge radius="xs" size="xs" color="green">In Stock</Badge>
            <Badge radius="xs" size="xs" color="indigo">Multipliers</Badge>
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
}