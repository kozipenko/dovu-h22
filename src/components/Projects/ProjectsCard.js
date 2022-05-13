import { Badge, Button, Card, createStyles, Group, Image, Progress, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { TOKEN_NAME } from "../../utils/constants";

const useStyles = createStyles(theme => ({
  root: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.xs,
    transition: "all .1s ease-in-out",
    ":hover": { transform: "scale(1.005)" }
  },
  header: {
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[2]}`
  },
  footer: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[2]}`
  }
}));

export default function ProjectsCard({ project }) {
  const { classes } = useStyles();
  const modals = useModals();

  function openProjectPurchaseModal() {
    modals.openContextModal("projectPurchase", {
      title: `${project.name} Offsets`,
      innerProps: {
        project
      }
    });
  }

  function openProjectStakeModal() {
    modals.openContextModal("projectStake", {
      title: `${project.name} Staking`,
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

      <Card.Section className={classes.header}>
        <Text weight={500}>{project.name}</Text>
      </Card.Section>

      <Card.Section p="md">
        <Group spacing="xs">
          <Badge size="sm" variant="outline" radius="xs" color={project.verified_kg > 0 ? "green" : "red"}>
            {project.verified_kg > 0 ? "IN STOCK" : "NO STOCK"}
          </Badge>
          <Badge size="sm" variant="outline" radius="xs">${project.price_kg}</Badge>
          <Badge size="sm" variant="outline" radius="xs">25% apy</Badge>
          <Badge size="sm" variant="outline" radius="xs">{project.verified_kg.toLocaleString()} kg</Badge>
          <Badge size="sm" variant="outline" radius="xs">{project.staked_tokens.toLocaleString()} {TOKEN_NAME}</Badge>
        </Group>
      </Card.Section>

      <Card.Section className={classes.footer}>
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
      <Progress
        size="xl"
        radius={0}
        value={parseInt(project.collateral_risk)}
      />
    </Card>
  );
}