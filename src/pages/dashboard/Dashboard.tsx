import React, { useEffect, useState } from "react";
import { Container, Stack, Paper, Text } from "@mantine/core";
import { useColorMap } from "../../theme/colorMap";

import type { ClientCS, ActionByIp } from "../../types";
import ClientToken from "./ClientToken";
import NetworkList from "./NetworkList";

const Dashboard: React.FC = () => {
  const range = { from: 5000, to: 7080 };
  const { surfaceBg, surfaceText } = useColorMap();

  const [data, setData] = useState<{ getClients: ClientCS[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(
      `${import.meta.env.VITE_CSTOKEN_SERVER_URL}/api/v1/cstoken/clients/range/${range.from}/${range.to}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((json) => {
        if (!json || !Array.isArray(json.getClients)) {
          throw new Error("Invalid response format");
        }

        const sortedClients = [...json.getClients].sort((a, b) =>
          a.ip.localeCompare(b.ip)
        );

        setData({ getClients: sortedClients });
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [range.from, range.to]);

  let networkContent = null;
  let clientContent = null;

  if (loading) {
    networkContent = (
      <Paper p="md" bg={surfaceBg} c={surfaceText}>
        <Text>Loading network nodes…</Text>
      </Paper>
    );

    clientContent = (
      <Paper p="md" bg={surfaceBg} c={surfaceText}>
        <Text>Loading client tokens…</Text>
      </Paper>
    );
  } else if (data) {
    networkContent = (
      <NetworkList clientList={data.getClients} range={range} />
    );

    clientContent = (
      <ClientToken
        range={range}
        clientsByIp={data.getClients.reduce((prev: ActionByIp, client) => {
          prev[client.ip] = { client, actions: [] };
          return prev;
        }, {})}
      />
    );
  } else {
    networkContent = (
      <Paper p="md" bg={surfaceBg} c={surfaceText}>
        <Text>No network clients found.</Text>
      </Paper>
    );

    clientContent = (
      <Paper p="md" bg={surfaceBg} c={surfaceText}>
        <Text>No network clients found.</Text>
      </Paper>
    );
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        {networkContent}
        {clientContent}
      </Stack>
    </Container>
  );
};

export default Dashboard;
