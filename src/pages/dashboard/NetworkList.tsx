import React from "react";
import { Paper, Text, Group, Button, SimpleGrid } from "@mantine/core";
import { useColorMap } from "../../theme/colorMap";
import type { ClientCS } from "../../types";
import ClientNode from "./ClientNode";

type NetworkListProps = {
  clientList: ClientCS[];
  range: {
    from: number;
    to: number;
  };
};

const NetworkList: React.FC<NetworkListProps> = ({ clientList, range }) => {
  const { surfaceBg, surfaceText } = useColorMap();

  const doPostStartRequest = async () => {
    console.log("Only connected");
  };

  const doPostStopRequest = async () => {
    console.log("Show all");
  };

  return (
    <Paper shadow="sm" radius="md" p="lg" bg={surfaceBg} c={surfaceText}>
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          Network Nodes
        </Text>
        <Text size="sm">
          Range: <strong>{range.from}</strong> → <strong>{range.to}</strong>
        </Text>
      </Group>

      {/* Buttons */}
      <Group mb="lg">
        <Button variant="outline" color="gray" onClick={doPostStartRequest}>
          Only Connected
        </Button>
        <Button variant="outline" color="gray" onClick={doPostStopRequest}>
          Show All
        </Button>
      </Group>

      {/* Client List */}
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing="md"
      >
        {clientList.map((client) => (
          <ClientNode key={`${client.host}_${client.ip}`} client={client} />
        ))}
      </SimpleGrid>
    </Paper>
  );
};

export default NetworkList;
