import React from "react";
import {
  Paper,
  Table,
  Text,
  Badge,
  Group,
  Stack 
} from "@mantine/core";
import { format, parseISO } from "date-fns";
import { useColorMap } from "../../theme/colorMap";
import { selectAllTokenActions, useAppSelector } from "../../store/reducers/store";
import type { RequestCS, AcquireCS, ProcSvc, ActionByIp, ConnectedClient, DisconnectedClient } from "../../types";
import type { CSTokenAction } from "../../store/api/cstokenSlice";

type ClientTokenProps = {
  range: { from: number; to: number };
  clientsByIp: ActionByIp;
};

const ClientToken: React.FC<ClientTokenProps> = ({ clientsByIp }) => {
  const { surfaceBg, surfaceText } = useColorMap();
  const allActions = useAppSelector(selectAllTokenActions);

  const visibleIps = React.useMemo(
    () => new Set(Object.keys(clientsByIp)),
    [clientsByIp]
  );

  const latestVisibleAction = React.useMemo(
    () => allActions.find((a) => visibleIps.has(a.clientIp)) ?? null,
    [allActions, visibleIps]
  );

  const actionsByClient = React.useMemo(() => {
    const map = new Map<string, CSTokenAction[]>();
    for (const action of allActions) {
      if (!map.has(action.clientIp)) map.set(action.clientIp, []);
      map.get(action.clientIp)!.push(action);
    }
    for (const list of map.values()) {
      list.sort((a, b) => b.seqNo - a.seqNo);
    }
    return map;
  }, [allActions]);

  const latestSeq = latestVisibleAction?.seqNo;
  const latestIp = latestVisibleAction?.clientIp;

  const rows = Object.entries(clientsByIp).map(([ip, _clientForActions]) => {
    const actions = actionsByClient.get(ip) ?? [];

    return (
      <Table.Tr key={ip}>
        <Table.Td>
          <Text fw={600}>{ip}</Text>
        </Table.Td>

        <Table.Td>
          <Stack gap="xs">
            {actions.map((activity) => {
              const isHighlighted =
                latestIp === ip && latestSeq === activity.seqNo;

              let label = "";
              let description = "";
              let color: string = "gray";
              let timestamp = "";

              if ("requestedAt" in activity.payload) {
                const p = activity.payload as RequestCS;
                label = p.sourceIp !== ip ? "Relay" : "Request";
                description =
                  p.sourceIp !== ip
                    ? `${p.sourceIp} → P:${p.parentIp}`
                    : `${ip} → P:${p.parentIp}`;
                color = "yellow";
                timestamp = p.requestedAt;
              } else if ("acquiredAt" in activity.payload) {
                const p = activity.payload as AcquireCS;
                label = p.sourceIp === ip ? "Held" : "Acquire";
                description = `${p.ip} ← P:${p.sourceIp}`;
                color = "blue";
                timestamp = p.acquiredAt;
              } else if ("processedAt" in activity.payload) {
                const p = activity.payload as ProcSvc;
                label = "Processed";
                description = p.serviceMessage;
                color = "purple";
                timestamp = p.processedAt;
              } else if ("connectedAt" in activity.payload) {
                const p = activity.payload as ConnectedClient;
                label = "Connected";
                description = `${p.sourceIp} connected`;
                color = "green";
                timestamp = p.connectedAt;
              } else if ("disconnectedAt" in activity.payload) {
                const p = activity.payload as DisconnectedClient;
                label = "Disconnected";
                description = `${p.sourceIp} disconnected`;
                color = "red";
                timestamp = p.disconnectedAt;
              }

              return (
                <Paper
                  key={activity.seqNo}
                  p="xs"
                  radius="md"
                  shadow={isHighlighted ? "md" : "xs"}
                  withBorder
                  bg={surfaceBg}
                >
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Badge color={color} variant="filled">
                        {label}
                      </Badge>
                      <Text size="sm">{description}</Text>
                    </Group>

                    <Group gap={6}>
                      <Badge variant="light" color={color}>
                        {format(parseISO(timestamp), "HH:mm:ss.SSS")}
                      </Badge>
                    </Group>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Paper shadow="sm" radius="md" p="lg" bg={surfaceBg} c={surfaceText}>
      <Text size="lg" fw={600} mb="md">
        Client Token Activity
      </Text>

      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Client IP</Table.Th>
            <Table.Th>Token Activity</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Paper>
  );
};

export default ClientToken;
