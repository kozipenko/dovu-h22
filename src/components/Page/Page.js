import { Box, Container, createStyles } from "@mantine/core";
import { Outlet } from "react-router-dom";
import PageHeader from "./PageHeader";

const useStyles = createStyles(theme => ({
  root: {
    minHeight: "100vh",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]
  }
}));

export default function Page() {
  const { classes } = useStyles();

  return (
    <Box className={classes.root}>
      <PageHeader />
      <Container size="xl" p="xl">
        <Outlet />
      </Container>
    </Box>
  );
}