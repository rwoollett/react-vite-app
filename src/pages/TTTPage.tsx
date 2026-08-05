import React, { useRef, useState, useEffect, type FormEvent, type ChangeEvent, type MouseEvent, useMemo } from 'react';
import { type Option } from '../components/Dropdown';
import { type BoardBounds, boardTraverse, drawPlayer, drawWinResult } from '../utility/DrawingTTT';
import { useWebSocket } from "../hooks/use-websocket-context";
import { type Game, isGame, isMove, type PlayerMove } from '../types';
import { useAppDispatch, useAppSelector } from '../store/reducers/store';
import { setCurrentGame, clearCurrentGame } from '../store/actions/ttt';
import { useColorMap } from '../theme/colorMap';
import { Container, Checkbox, Select, Paper, Text, Grid, Button, Stack } from "@mantine/core";

const CanvasComponent: React.FC = () => {
  const { gatewayUserId: gameUser, tttMessageQueue, lastProcessedTTTSeq, setLastProcessedTTTSeq } = useWebSocket();
  const dispatch = useAppDispatch();

  const [startGameData, setStartGameData] = useState<Game | null>(null);
  const startGame = async (gameId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_TTT_SERVER_URL}/api/v1/ttt/game/start`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, userId: gameUser })
      });
      const data = await response.json();
      console.log('start game', data);
      if (!data || !isGame(data.startGame)) {
        throw new Error("Invalid response format");
      } else {
        setStartGameData(data.startGame);
      }
    } catch (error) {
      console.error("Failed to create game:", error);
      setStartGameData(null);
    }
  };

  const [boardMoveData, setBoardMoveData] = useState<PlayerMove | null>(null);
  const boardMove = async (gameId: string, player: number, moveCell: number, isOpponentStart: boolean) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_TTT_SERVER_URL}/api/v1/ttt/game/move`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, userId: gameUser, player, moveCell, isOpponentStart })
      });
      const data = await response.json();
      if (!data || !isMove(data.boardMove)) {
        throw new Error("Invalid response format");
      } else {
        setBoardMoveData(data.boardMove);
      }
    } catch (error) {
      console.error("Failed to create game:", error);
      setBoardMoveData(null);
    }
  };

  const boardBounds: BoardBounds = useMemo(() => {
    return {
      rowSize: 3,
      colSize: 3,
      blockSize: 80
    }
  }, []);

  const { rowSize, colSize, blockSize } = boardBounds;
  const { surfaceBg, surfaceText, GAME_COLORS } = useColorMap();

  const [board, setBoard] = useState<number[]>(() => {
    return Array(9).fill(0);
  });
  const [boardUpdated, setBoardUpdated] = useState(false);
  const [result, setResult] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const playerCharactors = [
    { label: 'X (Cross)', value: '1' },
    { label: 'O (Nought)', value: '2' },
  ];

  // GameID is required before any ui activity on the page
  const [gameId, setGameId] = useState<string>("EMPTY");
  const [gameActive, setGameActive] = useState(false);

  const [player, setPlayer] = useState<Option>(playerCharactors[0]);
  const [isOpponentStart, setIsOpponentStart] = useState(true);
  const [playerMove, setPlayerMove] = useState<number>(-1);
  const [playerHover, setPlayerHover] = useState<number>(-1);
  const [playMessage, setPlayMessage] = useState<string>(isOpponentStart ? "Opponent started. Good luck!" : "You make first move.");
  const [startButtonText, setStartButtonText] = useState('Start Game');
  const [hasMovedBoard, setHasMovedBoard] = useState(false);

  const game = useAppSelector(state => state.ttt.currentGame);

  useEffect(() => {
    let updatedSeq = lastProcessedTTTSeq;
    console.log('\n**client lastProcessedTTTSeq', updatedSeq);

    for (const { seq, msg } of tttMessageQueue) {
      if (seq > updatedSeq) {
        console.log('client', updatedSeq, seq, msg);
        if (msg.subject === "ttt_game_Update" && msg.payload.gameId === gameId) {
          const newBoard = msg.payload.board.split(",");
          setBoard(newBoard.map((cell) => parseInt(cell)));
          setPlayMessage("Your turn.");
          if (msg.payload.result.indexOf(':') > 0) {
            const msgResult = msg.payload.result.split(":");
            // A result is found when sum of result string > 0 (or equal 3)
            if (msgResult.length === 2 && msgResult[1].indexOf(',') > 0) {
              //console.log('sum of result ', msgResult[1].split(",").reduce((prev, curr) => prev + parseInt(curr), 0));
              if (msgResult[1].split(",").reduce((prev, curr) => prev + parseInt(curr), 0) > 0) {
                setPlayMessage(msgResult[0]);
                setResult(msgResult[1].split(",").map((cell) => parseInt(cell)));
              } else {
                setPlayMessage(msgResult[0]);  // draw
              }
            }
          }

          setPlayerMove(-1);
          setBoardUpdated(true);
          setHasMovedBoard(false);
        }
        updatedSeq = seq;
      }
    }
    console.log('client looped ttt updatesSeq', updatedSeq, lastProcessedTTTSeq);
    if (updatedSeq !== lastProcessedTTTSeq) {
      console.log('lastProcessedTTTSeq', updatedSeq);
      setLastProcessedTTTSeq(updatedSeq);
    }
  }, [tttMessageQueue, gameId, dispatch, lastProcessedTTTSeq, setLastProcessedTTTSeq]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const createGame = async (userId: string) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_TTT_SERVER_URL}/api/v1/ttt/game/create`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });
        const data = await response.json();
        if (!data || !isGame(data.createGame)) {
          throw new Error("Invalid response format");
        } else {
          dispatch(setCurrentGame(data.createGame));
        }
      } catch (error) {
        console.error("Failed to create game:", error);
        dispatch(clearCurrentGame());
      }
    };

    if (!game && gameUser) {
      createGame(gameUser);
    }
  }, [player, gameUser, game, dispatch]);

  useEffect(() => {
    if (game) {
      setGameId(game.id);
    }
  }, [game]);

  useEffect(() => {
    if (startGameData) {
      setBoard(() => {
        let newBoard: number[] = startGameData.board.split(",").map((cell) => parseInt(cell));
        return newBoard;
      });
      setGameActive(true);
    }
  }, [startGameData]);

  useEffect(() => {
    if (boardMoveData) {
      setHasMovedBoard(true);
    }
  }, [boardMoveData]);

  const handleCreateGameSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // The start/finish button press does clear all game board and results
    setResult(() => {
      let newResult: number[] = Array(9).fill(0);
      return newResult;
    });
    setPlayerMove(-1);

    if (gameActive) {
      setGameActive(false);

    } else {
      startGame(gameId);
      setStartButtonText('Start Game');
      setPlayMessage(isOpponentStart ? "Opponent started. Good luck!" : "You make first move.")

      // Depending an wanting opponent (AI) to start first would wait for AI move before
      // boardUpdated on Start playing game.
      if (isOpponentStart) {
        const playerNumber = parseInt(player.value);
        boardMove(gameId, playerNumber, -1, isOpponentStart);

      } else {
        setBoardUpdated(true);
      }
    }
  };

  const handleOnMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (gameActive && boardUpdated) {
      const k = boardTraverse(x, y, boardBounds);
      if (k !== -1 && board[k] === 0) {
        const playerNumber = parseInt(player.value);
        boardMove(gameId, playerNumber, k, isOpponentStart);
        setPlayerMove(k); // to draw this move for waiting for subscribed boardUpdate
        setBoardUpdated(false);
        setHasMovedBoard(false);
      }
    }
  };

  const handleOnMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (gameActive && boardUpdated) {
      const k = boardTraverse(x, y, boardBounds);
      setPlayerHover(k);
    }
  };

  const handleOnMouseLeave = (_event: MouseEvent<HTMLCanvasElement>) => {
    //event.preventDefault();
    setPlayerHover(-1);
  };

  // const handlePlayerSelect = (newOption: Option) => {
  //   setPlayer(newOption);
  // };
  const handlePlayerSelect = (value: string | null) => {
    if (!value) return;

    const selected = playerCharactors.find((opt) => opt.value === value);
    if (selected) {
      setPlayer(selected);
    }
  };


  const handleOpponentStart = (_event: ChangeEvent<HTMLInputElement>) => {
    //event.preventDefault();
    setIsOpponentStart(!isOpponentStart);
  };

  useEffect(() => {
    // const GAME_COLORS: string[] = [
    //   'rgb(255, 255, 255)', // White for dead cells
    //   'rgb(0, 0, 0)',       // 1 Black
    //   'rgb(0, 255, 0)',     // 2 Green  
    //   'rgb(255, 255, 0)',   // 3 Lemon
    //   'rgb(255, 82, 4)',    // 3 Orange
    //   'rgb(201, 208, 181)', // 4 Pear
    //   'rgb(0, 255, 0)',     // 5 Lime
    //   'rgb(167, 12, 28)',   // 6 Strawberry
    //   'rgb(175, 195, 102)', // 7 Grape
    //   'rgb(255, 136, 5)',   // 8 Manderine
    //   'rgb(255, 5, 5)'      // 9 Apple
    // ];

    const paint = (ctx: CanvasRenderingContext2D) => {
      const ALIVE = 1;
      const BLANK_COLOR = GAME_COLORS[0]; // White for blank cells
      const LINE_COLOR = GAME_COLORS[1];  // The lines are dark coloured
      const { rowSize, colSize, blockSize } = boardBounds;
      ctx.fillStyle = LINE_COLOR;
      ctx.clearRect(0, 0, colSize * blockSize, rowSize * blockSize);
      ctx.fillRect(1, 1, (colSize * blockSize) - 2, (rowSize * blockSize) - 2);

      for (let i = 0; i < rowSize; i++) {
        for (let j = 0; j < colSize; j++) {
          const y = i * blockSize;
          const x = j * blockSize;
          const k = (i * rowSize) + j;

          ctx.fillStyle = BLANK_COLOR;
          ctx.fillRect(x + 1, y + 1, blockSize - 2, blockSize - 2); // The cell background

          if (gameActive) {
            if (board[k] >= ALIVE) {
              drawPlayer(ctx, x, y, blockSize, board[k], GAME_COLORS[6]);
            } else {
              if (k === playerMove) {
                const playerNumber = parseInt(player.value);
                drawPlayer(ctx, x, y, blockSize, playerNumber, GAME_COLORS[6]);
              }
              if (boardUpdated) {
                if (k === playerHover) {
                  const playerNumber = parseInt(player.value);
                  drawPlayer(ctx, x, y, blockSize, playerNumber, GAME_COLORS[6]);
                }
              }
            }
          }

        }
      }

      // Draw win result line
      drawWinResult(ctx, result, GAME_COLORS[4], rowSize, colSize, blockSize);

    };

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const animationFrameId = requestAnimationFrame(() => paint(ctx));
        return () => cancelAnimationFrame(animationFrameId);
      }
    }
  }, [GAME_COLORS, board, gameActive, boardUpdated, result, boardBounds, playerHover, playerMove, player]);

  const gameOption = (title: string, buttonText: string, change: boolean) => {
    return (
      <Paper
        p="md"
        radius="md"
        shadow="sm"
        bg={surfaceBg}
        c={surfaceText}
        style={{ marginLeft: "12px" }}
      >
        <Text fw={600} size="sm" mb="md">
          {title}
        </Text>

        <form onSubmit={handleCreateGameSubmit}>
          <Stack gap="md">

            {/* Player Character */}
            <Stack gap={4}>
              <Text fw={500}>Play Character</Text>

              {change ? (
                <Select
                  data={playerCharactors}
                  value={player.value}
                  onChange={handlePlayerSelect}
                  w={200}
                />
              ) : (
                <Text fw={600}>{player.label}</Text>
              )}
            </Stack>

            {/* Opponent Starts */}
            <Stack gap={4}>
              {change ? (
                <Checkbox
                  label="Opponent starts"
                  checked={isOpponentStart}
                  onChange={handleOpponentStart}
                />
              ) : (
                <Text fw={600}>{playMessage}</Text>
              )}
            </Stack>

            {/* Submit Button */}
            <Button type="submit" color="blue">
              {buttonText}
            </Button>
          </Stack>
        </form>
      </Paper>
    );
  };

  return (
    <Container size="md">
      <Paper p="lg" radius="md" shadow="sm" bg={surfaceBg} c={surfaceText}>
        <Text fw={700} size="lg" mb="md">
          Tic Tac Toe {gameId}{" "}
          {gameActive && hasMovedBoard && "Move made"}{" "}
          {gameActive && (hasMovedBoard || "Make a move")}
        </Text>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack>
              {!gameActive &&
                gameOption("Select Game Options", startButtonText, true)}

              {gameActive &&
                gameOption("Playing Tic Tac Toe!", "Finish Game", false)}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <canvas
              className="is-clickable"
              onMouseMove={handleOnMouseMove}
              onMouseDown={handleOnMouseDown}
              onMouseLeave={handleOnMouseLeave}
              ref={canvasRef}
              width={colSize * blockSize}
              height={rowSize * blockSize}
              style={{
                border: "1px solid #EEEEEE",
                display: "block",
                margin: "0 auto",
              }}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CanvasComponent;
