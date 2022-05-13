import { createStyles, Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { TrendingDown, TrendingUp } from "tabler-icons-react";

const useStyles = createStyles(theme => ({
  root: {
    padding: theme.spacing.md,
    background: theme.colorScheme === "dark" && theme.colors.dark[6],
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.xs,
    transformStyle: "preserve-3d",
    transition: "all .1s ease-in-out",
    ":hover": { transform: "scale(1.005)" }
  }
}));


export default function Stat({ title, stat, icon, trendingUp }) {
  const { classes } = useStyles();

  return (
    <Paper className={classes.root}>
      <Group position="apart">
        <Group spacing="md">
          <ThemeIcon color="indigo">
            {icon}
          </ThemeIcon>

          <div>
            <Text size="xs" transform="uppercase" weight={700}>{title}</Text>
            <Text size="sm" weight={400}>{stat}</Text>
          </div>
        </Group>

        <ThemeIcon variant="light" color={trendingUp ? "green" : "red"}>
          {trendingUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}