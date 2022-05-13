import { createStyles, Group, Paper, Text, ThemeIcon } from "@mantine/core";

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


export default function Stat({ title, stat, icon }) {
  const { classes } = useStyles();

  return (
    <Paper className={classes.root}>
      <Group spacing="sm">
        <ThemeIcon color="indigo">
          {icon}
        </ThemeIcon>

        <div>
          <Text size="xs" transform="uppercase" weight={700}>{title}</Text>
          <Text size="sm" weight={400}>{stat}</Text>
        </div>
      </Group>
    </Paper>
  );
}