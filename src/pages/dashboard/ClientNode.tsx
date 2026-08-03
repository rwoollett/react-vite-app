import React, { useEffect, useState } from "react";
import { IconClock } from "@tabler/icons-react";
import { Paper, Text, Group, Stack, Badge } from "@mantine/core";
import { parseISO, format } from "date-fns";
import { useColorMap } from "../../theme/colorMap";
import { useWebSocket } from "../../hooks/use-websocket-context";
import { selectNewActionsForClient, useAppSelector } from "../../store/reducers/store";
import type { ClientCS, ConnectedClient, DisconnectedClient } from "../../types";

type ClientNodeProps = {
  client: ClientCS;
};

const ClientNode: React.FC<ClientNodeProps> = ({ client }) => {
  const [connected, setConnected] = useState<boolean>(client.connected);
  const [connectedAt, setConnectedAt] = useState<string>(client.connectedAt);
  const [disconnectedAt, setDisconnectedAt] = useState<string>(
    client.disconnectedAt || new Date().toISOString()
  );

  const { lastProcessedCSSeq, setLastProcessedCSSeq } = useWebSocket();
  const newActions = useAppSelector((state) =>
    selectNewActionsForClient(state, client.ip, lastProcessedCSSeq)
  );

  const { surfaceBg, surfaceText } = useColorMap();

  useEffect(() => {
    if (newActions.length === 0) return;

    let updatedSeq = lastProcessedCSSeq;

    for (const action of newActions) {
      if (action.subject === "cstoken_client_Connected") {
        const payload = action.payload as ConnectedClient;
        setConnectedAt(payload.connectedAt);
        setConnected(true);
      }

      if (action.subject === "cstoken_client_Disconnected") {
        const payload = action.payload as DisconnectedClient;
        setDisconnectedAt(payload.disconnectedAt);
        setConnected(false);
      }

      updatedSeq = action.seqNo;
    }

    setLastProcessedCSSeq(updatedSeq);
  }, [newActions, lastProcessedCSSeq, setLastProcessedCSSeq]);

  return (
    <Paper shadow="sm" radius="md" p="md" bg={surfaceBg} c={surfaceText}>
      {/* Header */}
      <Group justify="space-between" mb="xs">
        <Text fw={600}>{client.name}</Text>

        <Badge
          color={connected ? "green" : "red"}
          variant="filled"
          radius="sm"
        >
          {connected ? "Connected" : "Disconnected"}
        </Badge>
      </Group>


      <Stack gap={6}>
        <Text size="sm">
          <Text span fw={300}>Node IP:</Text> {client.ip}
        </Text>

        <Group gap={8}>
          <Badge
            leftSection={<IconClock size={12} />}
            variant="light"
            color={connected ? "green" : "red"}
            radius="sm"
          >
            {connected ? "Connected at" : "Disconnected at"}
          </Badge>

          <Text size="sm">
            {connected
              ? format(parseISO(connectedAt), "P p")
              : format(parseISO(disconnectedAt), "P p")}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
};

export default ClientNode;
