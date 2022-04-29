import { Badge, Button, Card, createStyles, Group, Image, Stack, Text } from "@mantine/core";
import { openStakeDialog, openPurchaseDialog } from "../../store/projects";

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

export default function Project({ data }) {
  const { classes } = useStyles();
  
  return (
    <Card p={0} className={classes.root}>
      <Card.Section>
        <Image src={data.coverImg} height={160} />
      </Card.Section>

      <Card.Section p="md">
        <Stack>
          <Text weight={500}>{data.name}</Text>
          <Group spacing="xs">
            <Badge
              size="sm"
              radius="xs"
              variant="filled"
              color={data.supplyRemaining === 0 ? "red" : "green"}
              >
                {data.supplyRemaining === 0 ? "No Stock" : "In Stock"}
              </Badge>
            <Badge size="sm" variant="filled" radius="xs">Price ${data.price}</Badge>
            <Badge size="sm" variant="filled" radius="xs">APY {data.maxApy}%</Badge>
          </Group>
          <Group spacing="xs">
            <Badge size="sm" variant="filled" radius="xs">{data.stakers} Stakers</Badge>
            <Badge size="sm" variant="filled" radius="xs">Collateral {data.collateral}%</Badge>
          </Group>
        </Stack>
      </Card.Section>

      <Card.Section className={classes.buttons}>
        <Group position="right" spacing="xs">
          <Button
            size="xs"
            color="green"
            variant="light"
            disabled={data.supplyRemaining === 0}
            onClick={() => openPurchaseDialog(data.id)}
          >
            Purchase
          </Button>
          <Button
            size="xs"
            color="blue"
            variant="light"
            disabled={data.supplyRemaining === 0}
            onClick={() => openStakeDialog(data.id)}
          >
            Stake
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}