import React, { useRef, useState, useEffect, type FormEvent, type ChangeEvent, type MouseEvent, useMemo } from 'react';
import Dropdown, { type Option } from '../components/Dropdown';
import { type BoardBounds, boardTraverse, drawPlayer, drawWinResult } from '../utility/DrawingTTT';
import { useWebSocket } from "../hooks/use-websocket-context";
import { type Game, isGame, isMove, type PlayerMove } from '../types';
import Button from '../components/Button';

const CanvasComponent: React.FC = () => {
  const { tttMessageQueue } = useWebSocket();

  const [createGameData, setCreateGameData] = useState<Game | null>(null);
  const createGame = async (userId: string) => {
    try {
      const response = await fetch("http://localhost:3009/api/v1/game/create", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (!data || !isGame(data.createGame)) {
        throw new Error("Invalid response format");
      } else {
        setCreateGameData(data.createGame);
      }
    } catch (error) {
      console.error("Failed to create game:", error);
      setCreateGameData(null);
    }
  };

  const [startGameData, setStartGameData] = useState<Game | null>(null);
  const startGame = async (gameId: string) => {
    try {
      const response = await fetch("http://localhost:3009/api/v1/game/start", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId })
      });
      const data = await response.json();
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
      const response = await fetch("http://localhost:3009/api/v1/game/move", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, player, moveCell, isOpponentStart })
      });
      const data = await response.json();
      if (!data || !isMove(data.boardMove)) {
        throw new Error("Invalid response format");
      } else {
        setBoardMoveData(data.startGame);
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

  const [lastProcessedSeq, setLastProcessedSeq] = useState(0);

  useEffect(() => {
    let updatedSeq = lastProcessedSeq;
    for (const { seq, msg } of tttMessageQueue) {
      if (seq > updatedSeq) {
        if (msg.subject === "game_Update" && msg.payload.gameId === gameId) {
          console.log('client', updatedSeq, seq, msg);
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
    if (updatedSeq !== lastProcessedSeq) {
      setLastProcessedSeq(updatedSeq);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tttMessageQueue, gameId]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    createGame("99999999");
  }, [player]);

  useEffect(() => {
    if (createGameData) {
      setGameId(createGameData.id);
    }
  }, [createGameData]);

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

  // useSubscription(
  //   UPDATE_GAME, {
  //   variables: { gameId: Number(gameId) },
  //   context: { service: 'ttt' },
  //   skip: gameId === "EMPTY",
  //   onData({ data }) {
  //     if (data.data?.game_Update) {
  //       //console.log('subscribe got board', data.data.game_Update.board, data.data.game_Update.result, data.data.game_Update.gameId);
  //       const newBoard = data.data.game_Update?.board.split(",");
  //       setBoard(newBoard.map((cell) => parseInt(cell)));
  //       setPlayMessage("Your turn.");
  //       if (data.data.game_Update?.result.indexOf(':') > 0) {
  //         const msgResult = data.data.game_Update?.result.split(":");
  //         // A result is found when sum of result string > 0 (or equal 3)
  //         if (msgResult.length === 2 && msgResult[1].indexOf(',') > 0) {
  //           //console.log('sum of result ', msgResult[1].split(",").reduce((prev, curr) => prev + parseInt(curr), 0));
  //           if (msgResult[1].split(",").reduce((prev, curr) => prev + parseInt(curr), 0) > 0) {
  //             setPlayMessage(msgResult[0]);
  //             setResult(msgResult[1].split(",").map((cell) => parseInt(cell)));
  //           } else {
  //             setPlayMessage(msgResult[0]);  // draw
  //           }
  //         }
  //       }

  //       setPlayerMove(-1);
  //       setBoardUpdated(true);
  //       setHasMovedBoard(false);
  //     }
  //   }
  // });

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
      //setGameActive(true);

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

  const handlePlayerSelect = (newOption: Option) => {
    setPlayer(newOption);
  };

  const handleOpponentStart = (_event: ChangeEvent<HTMLInputElement>) => {
    //event.preventDefault();
    setIsOpponentStart(!isOpponentStart);
  };

  useEffect(() => {
    const GAME_COLORS: string[] = [
      'rgb(255, 255, 255)', // White for dead cells
      'rgb(0, 0, 0)',       // 1 Black
      'rgb(0, 255, 0)',     // 2 Green  
      'rgb(255, 255, 0)',   // 3 Lemon
      'rgb(255, 82, 4)',    // 3 Orange
      'rgb(201, 208, 181)', // 4 Pear
      'rgb(0, 255, 0)',     // 5 Lime
      'rgb(167, 12, 28)',   // 6 Strawberry
      'rgb(175, 195, 102)', // 7 Grape
      'rgb(255, 136, 5)',   // 8 Manderine
      'rgb(255, 5, 5)'      // 9 Apple
    ];

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
  }, [board, gameActive, boardUpdated, result, boardBounds, playerHover, playerMove, player]);

  const gameOption = (title: string, buttonText: string, change: boolean) => (
    <div className='panel ml-3'>
      <p className="panel-heading mb-4 is-size-7">{title}</p>
      <div className='panel-block'>
        <form onSubmit={handleCreateGameSubmit}>
          <div className="field ">
            <label className="label">Play Charactor</label>
            {change && (<Dropdown style={{ width: "200px" }} options={playerCharactors} value={player} onChange={handlePlayerSelect} />)}
            {change || (<div className="has-text-weight-semibold ml-4 pt-1 pb-2 is-size-6">{player.label}</div>)}
          </div>
          <div className="field">
            <div className="control">
              {change && (<label className="checkbox is-size-6">Opponent starts <input checked={isOpponentStart} onChange={handleOpponentStart} type="checkbox" className='is-size-6' /></label>)}
              {change || playMessage}
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <Button primary type="submit">{buttonText}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const { rowSize, colSize, blockSize } = boardBounds;
  return (
    <div className="panel">
      <p className="panel-heading mb-4">Tic Tac Toe {gameId} {gameActive && hasMovedBoard && "Move made"} {gameActive && (hasMovedBoard || "Make a move")}</p>
      <div className="columns">
        <div className="column is-one-third">
          {gameActive || gameOption('Select Game Options', startButtonText, true)}
          {gameActive && gameOption('Playing Tic Tac Toe!', 'Finish Game', false)}
        </div>
        <div className="column">
          <canvas className='is-clickable'
            onMouseMove={handleOnMouseMove}
            onMouseDown={handleOnMouseDown}
            onMouseLeave={handleOnMouseLeave}
            ref={canvasRef}
            width={colSize * blockSize}
            height={rowSize * blockSize}
            style={{ border: '1px solid #EEEEEE' }}>
          </canvas>
        </div>
      </div>
    </div>
  );
};

export default CanvasComponent;
