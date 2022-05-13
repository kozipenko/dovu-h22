import { Badge, Button, Card, createStyles, Group, Image, SimpleGrid, Text, ThemeIcon } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Coin, Leaf, Receipt, Stack2 } from "tabler-icons-react";

const useStyles = createStyles(theme => ({
  root: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.xs,
    transformStyle: "preserve-3d",
    transition: "all .1s ease-in-out",
    ":hover": { transform: "scale(1.005)" }
  },
  image: {
    position: "relative"
  },
  badges: {
    position: "absolute",
    bottom: 6,
    left: 6
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
      <Card.Section className={classes.image}>
        <Image withPlaceholder src={project.image} height={160} />
        <Group spacing="xs" className={classes.badges}>
          <Badge size="sm" variant="filled" radius="xs" color={project.verified_kg > 0 ? "indigo" : "red"}>
            {project.verified_kg > 0 ? "IN STOCK" : "NO STOCK"}
          </Badge>
          <Badge size="sm" variant="filled" radius="xs">25 % APY</Badge>
        </Group>
      </Card.Section>

      <Card.Section p="md">
        <Text weight={500}>{project.name}</Text>
      </Card.Section>
    
      <Card.Section px="md">
        <SimpleGrid spacing="md" cols={2}>
          <Group spacing="xs">
            <ThemeIcon size="lg" variant="light">
              <Coin size={18} />
            </ThemeIcon>
            <div>
              <Text size="xs" color="dimmed" weight={500}>Price</Text>
              <Text size="xs" color="gray" weight={600}>${project.price_kg}</Text>
            </div>
          </Group>

          <Group spacing="xs">
            <ThemeIcon size="lg" variant="light">
              <Leaf size={18} />
            </ThemeIcon>
            <div>
              <Text size="xs" color="dimmed" weight={500}>Supply</Text>
              <Text size="xs" color="gray" weight={600}>{project.verified_kg.toLocaleString()} kg</Text>
            </div>
          </Group>

          <Group spacing="xs">
            <ThemeIcon size="lg" variant="light">
              <Stack2 size={18} />
            </ThemeIcon>
            <div>
              <Text size="xs" color="dimmed" weight={500}>TVL</Text>
              <Text size="xs" color="gray" weight={600}>{project.staked_tokens.toLocaleString()}</Text>
            </div>
          </Group>

          <Group spacing="xs">
            <ThemeIcon size="lg" variant="light">
              <Receipt size={18} />
            </ThemeIcon>
            <div>
              <Text size="xs" color="dimmed" weight={500}>Insurance</Text>
              <Text size="xs" color="gray" weight={600}>{project.collateral_risk} %</Text>
            </div>
          </Group>
        </SimpleGrid>
      </Card.Section>

      <Card.Section p="md">
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

/*

<Group spacing="xs">
  <Badge size="sm" variant="outline" radius="xs">${project.price_kg}/kg</Badge>
  <Badge size="sm" variant="outline" radius="xs">25% apy</Badge>
  <Badge size="sm" variant="outline" radius="xs">{project.verified_kg.toLocaleString()} kg supply</Badge>
  <Badge size="sm" variant="outline" radius="xs">{project.staked_tokens.toLocaleString()} {TOKEN_NAME} tvl</Badge>
</Group>

*/