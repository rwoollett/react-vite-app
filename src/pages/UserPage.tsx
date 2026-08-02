import React, { useEffect, useRef, useState, type FormEvent } from 'react';
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';
import { useRefreshTokenMutation } from '../store/api/authenticatedUsersApi';
import { selectAllTokenActions, useAppSelector } from '../store/reducers/store';
import Greeting from '../components/Greeting';
import { sayFarewell } from '../utility/functions';
import Button from '../components/Button';
import { useWebSocket } from '../hooks/use-websocket-context';
import Dashboard from './dashboard/Dashboard';

import { Box, Paper, Group, Text, Badge, Stack } from '@mantine/core';
import { useColorMap } from '../theme/colorMap';

const UserPage: React.FC = () => {
  const { isLoggedIn, email, expiry } = useSignedInAuthorize();
  const { wsRefGateway: wsRef } = useWebSocket();
  const [farewell, setFarewell] = useState("");
  const [connected, setConnected] = useState(wsRef.current?.client !== undefined);
  const [received, setReceived] = useState<string[]>([]);
  const [refreshToken] = useRefreshTokenMutation();
  const lastProcessedSeq = useRef(0);

  const allActions = useAppSelector(state => selectAllTokenActions(state));
  const contents = useAppSelector(state => state.data.contents);

  const { surfaceBg, surfaceText } = useColorMap();

  const handleSendMessage = () => {
    if (wsRef.current && connected) {
      wsRef.current.send({ farewell });
    } else {
      console.log('WebSocket is not connected');
    }
  };

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

  const onHandleGreet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFarewell(sayFarewell(contents[0]));
    await refreshToken().unwrap();
  };

  return (
    <Box bg={surfaceBg} c={surfaceText} p="lg">

      {/* Header Section */}
      {isLoggedIn && (
        <Paper
          shadow="sm"
          radius="md"
          p="md"
          mb="lg"
          bg={surfaceBg}
          c={surfaceText}
        >
          <Group justify="space-between" align="center">

            <Text size="sm">
              Welcome, <b>{email}</b>!{" "}
              {expiry && new Date(expiry * 1000).toLocaleString()}
            </Text>

            <Badge color={connected ? "green" : "red"} variant="filled">
              {connected ? "Connected" : "Disconnected"}
            </Badge>

            <Button primary type="button" onClick={handleSendMessage}>
              Send
            </Button>

            <Badge color={received.length > 0 ? "yellow" : "blue"} variant="filled">
              {received.length > 0
                ? `Received ${received.length} notifications`
                : "No new notifications"}
            </Badge>

          </Group>
        </Paper>
      )}

      {/* Body Section */}
      <Paper
        shadow="sm"
        radius="md"
        p="lg"
        bg={surfaceBg}
        c={surfaceText}
      >
        <form onSubmit={onHandleGreet}>
          <Stack gap="md">

            <Button primary type="submit">Greet</Button>

            {isLoggedIn && <Greeting name={`${contents}`} />}
            <Text>{farewell}</Text>

          </Stack>
        </form>

        <Box mt="lg">
          <Dashboard />
        </Box>
      </Paper>

    </Box>
  );
};

export default UserPage;
