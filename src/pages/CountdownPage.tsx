import { Container, Paper } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { useColorMap } from "../theme/colorMap";

function CountdownPage() {
  const { surfaceBg, surfaceText } = useColorMap();

  return (
    <Container size="xl">
      <Paper
        p="lg"
        radius="md"
        shadow="sm"
        bg={surfaceBg}
        c={surfaceText}
      >
        <Outlet />
      </Paper>
    </Container>
  );
}

export default CountdownPage;
