import React, { useEffect, useRef, useState } from 'react';
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';
import { useWebSocket } from '../hooks/use-websocket-context';
import Banner from '../components/Banner';
import { selectAllTokenActions, useAppSelector } from "../store/reducers/store";
import { Box, Flex, Group, Paper, Text, Badge, Stack } from '@mantine/core';
import { useColorMap } from '../theme/colorMap';
import homepage from '../homepage.json';
import CardItem from '../components/Card';

const HomePage: React.FC = () => {
  const { isLoggedIn, email } = useSignedInAuthorize();
  const { wsRefGateway: wsRef } = useWebSocket();
  const [connected, setConnected] = useState(wsRef.current?.client !== undefined);
  const [received, setReceived] = useState<string[]>([]);
  const lastProcessedSeq = useRef(0);

  const allActions = useAppSelector(state => selectAllTokenActions(state));
  const { surfaceBg, surfaceText } = useColorMap();
  const { title, description, navCards } = homepage.homepage;

  useEffect(() => {
    if (allActions.length === 0) return;

    for (const action of allActions) {
      if (action.seqNo > lastProcessedSeq.current) {
        setConnected(true);
        setReceived(prev => [...prev, String(action.seqNo)]);
        lastProcessedSeq.current = action.seqNo;
      }
    }
  }, [allActions]);

  return (
    <>
      <Banner
        title={title}
        desc={description}
      />

      <Box bg={surfaceBg} c={surfaceText} p="md">
        {isLoggedIn && (
          <Paper
            shadow="sm"
            radius="md"
            p="md"
            bg={surfaceBg}
            c={surfaceText}
          >
            <Group justify="space-between" align="center">
              <Text size="sm">
                Welcome, <b>{email}</b>!
              </Text>

              <Badge
                color={connected ? 'green' : 'red'}
                variant="filled"
              >
                {connected ? 'Connected' : 'Disconnected'}
              </Badge>

              <Badge
                color={received.length > 0 ? 'yellow' : 'blue'}
                variant="filled"
              >
                {received.length > 0
                  ? `Received ${received.length} notifications`
                  : 'No new notifications'}
              </Badge>
            </Group>
          </Paper>
        )}

        <Stack mt="lg">
          <Flex wrap="wrap" justify="space-between" gap="lg">
            {navCards.map((card, i) => (
              <CardItem key={i} {...card} />
            ))}
          </Flex>
        </Stack>

      </Box>
    </>
  );
};

export default HomePage;
