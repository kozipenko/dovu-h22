import { Container, createStyles } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const useStyles = createStyles(theme => ({
  root: {
    minHeight: "100vh",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]
  }
}));

export default function Layout() {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <main>
        <Container size="xl" p="lg">
          <Outlet />
        </Container>
      </main>
    </div>
  )
}