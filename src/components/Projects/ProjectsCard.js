import { Badge, Button, Card, createStyles, Group, Image, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";

const useStyles = createStyles(theme => ({
  root: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
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
        <Image src={project.coverImg} height={160} />
      </Card.Section>

      <Card.Section p="md">
        <Stack spacing="xs">
          <Text weight={500}>{project.name}</Text>
          <Group spacing="xs">
            <Badge
              size="sm"
              radius="xs"
              variant="filled"
              color={project.supplyRemaining === 0 ? "red" : "green"}
              >
                {project.supplyRemaining === 0 ? "No Stock" : "In Stock"}
              </Badge>
            <Badge size="sm" variant="filled" radius="xs">Price ${project.price}</Badge>
            <Badge size="sm" variant="filled" radius="xs">APY {project.maxApy}%</Badge>
          </Group>
          <Group spacing="xs">
            <Badge size="sm" variant="filled" radius="xs">{project.stakers} Stakers</Badge>
            <Badge size="sm" variant="filled" radius="xs">Collateral {project.collateral}%</Badge>
          </Group>
        </Stack>
      </Card.Section>

      <Card.Section className={classes.buttons}>
        <Group grow spacing="xs">
          <Button
            size="xs"
            color="green"
            variant="light"
            disabled={project.supplyRemaining === 0}
            onClick={openProjectPurchaseModal}
          >
            Purchase
          </Button>
          <Button
            size="xs"
            color="blue"
            variant="light"
            disabled={project.supplyRemaining === 0}
            onClick={openProjectStakeModal}
          >
            Stake
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}