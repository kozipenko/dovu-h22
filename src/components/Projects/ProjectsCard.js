import { Badge, Button, Card, createStyles, Group, Image, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";

const useStyles = createStyles(theme => ({
  root: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.xs,
    transition: "all .1s ease-in-out",
    ":hover": { transform: "scale(1.005)" }
  },
  buttons: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[2]}`
  }
}));

export default function ProjectsCard({ project }) {
  const { classes } = useStyles();
  const modals = useModals();

  function openProjectPurchaseModal() {
    modals.openContextModal("projectPurchase", {
      title: `Purchase ${project.name} Offsets`,
      innerProps: {
        project
      }
    });
  }

  function openProjectStakeModal() {
    modals.openContextModal("projectStake", {
      title: `Stake to ${project.name}`,
      innerProps: {
        project
      }
    });
  }
  
  return (
    <Card p={0} className={classes.root}>
      <Card.Section>
        <Image withPlaceholder src={project.image} height={160} />
      </Card.Section>

      <Card.Section p="md">
        <Stack spacing="xs">
          <Text weight={500}>{project.name}</Text>
          <Group spacing="xs">
            <Badge
              size="sm"
              radius="xs"
              variant="outline"
              color={project.verified_kg === 0 ? "red" : "green"}
              >
                {project.verified_kg === 0 ? "No Stock" : "In Stock"}
              </Badge>
            <Badge size="sm" variant="outline" radius="xs">${project.price_kg}/kg</Badge>
            <Badge size="sm" variant="outline" radius="xs">25% APY</Badge>
            <Badge size="sm" variant="outline" radius="xs">{project?.verified_kg?.toLocaleString()} kg supply</Badge>
            <Badge size="sm" variant="outline" radius="xs">Risk {project.collateral_risk}%</Badge>
          </Group>
        </Stack>
      </Card.Section>

      <Card.Section className={classes.buttons}>
        <Group grow spacing="xs">
          <Button
            size="xs"
            color="green"
            variant="light"
            disabled={project.verified_kg === 0}
            onClick={openProjectPurchaseModal}
          >
            Purchase
          </Button>
          <Button
            size="xs"
            color="blue"
            variant="light"
            disabled={project.verified_kg === 0}
            onClick={openProjectStakeModal}
          >
            Stake
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}