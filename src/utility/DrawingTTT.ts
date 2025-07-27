export type BoardBounds = {
  rowSize: number;
  colSize: number;
  blockSize: number;
};

export const drawWinResult = (
  ctx: CanvasRenderingContext2D,
  win: number[],
  lineColour: string,
  rowSize: number,
  colSize: number,
  blockSize: number
) => {
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = lineColour;

  let isHorizontal = false;
  let isVertical = false;
  let isTopLeftDiag = false;
  let isTopRightDiag = false;

  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      const y = i * blockSize;
      const x = j * blockSize;
      const k = (i * rowSize) + j;

      // Determine when a win is a diagonal, left or down line
      if (k < 9 && win[k] === 1 && win[k + 1] === 1) {
        // always a horizontal win
        isHorizontal = true;
        ctx.moveTo(x, y + blockSize / 2);
        ctx.lineTo(x + blockSize, y + blockSize / 2);
      }

      if ((k === 2 || k === 4) && win[k] === 1 && win[k + 2] === 1) {
        // a top to bottom left diagonal
        isTopRightDiag = true;
        ctx.moveTo(x + blockSize, y);
        ctx.lineTo(x, y + blockSize);
      }

      if (k < 7 && win[k] === 1 && win[k + 3] === 1) {
        // always a vertical win
        isVertical = true;
        ctx.moveTo(x + blockSize / 2, y);
        ctx.lineTo(x + blockSize / 2, y + blockSize);
      }

      if ((k === 0 || k === 4) && win[k] === 1 && win[k + 4] === 1) {
        // a top to bottom right diagonal
        isTopLeftDiag = true;
        ctx.moveTo(x, y);
        ctx.lineTo(x + blockSize, y + blockSize);
      }

      // Complete the line at the right and bottom cells
      // depending on what is being drawn.
      if ((k === 2 || k === 5 || k === 8) && isHorizontal) {
        // finish a horizontal win
        if (win[k - 1] === 1 && win[k] === 1) {
          ctx.moveTo(x, y + blockSize / 2);
          ctx.lineTo(x + blockSize, y + blockSize / 2);
        }
      }

      if ((k === 6 || k === 7 || k === 8) && isVertical) {
        // finish a vertical win
        if (win[k - 3] === 1 && (win[k])) {
          ctx.moveTo(x + blockSize / 2, y);
          ctx.lineTo(x + blockSize / 2, y + blockSize);
        }
      }

      if (k === 6 && isTopRightDiag) {
        // finish top to bottom left diagonal
        if (win[k - 2] === 1) {
          ctx.moveTo(x + blockSize, y);
          ctx.lineTo(x, y + blockSize);
        }
      }

      if (k === 8 && isTopLeftDiag) {
        // finish top to bottom right diagonal
        if (win[k - 4] === 1) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + blockSize, y + blockSize);
        }
      }

    }
  }
  ctx.stroke();

};

export const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number, blockSize: number, player: number, colour: string) => {
  const centred = blockSize / 2;
  const radius = centred - 8;
  switch (player) {
    case 1:
      // Cross
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = colour;
      ctx.moveTo(x + 18, y + 10);
      ctx.lineTo(x + blockSize - 18, y + blockSize - 10);
      ctx.moveTo(x - 18 + blockSize, y + 10);
      ctx.lineTo(x + 18, y + blockSize - 10);
      ctx.stroke();
      break;

    case 2:
      // Only can be Nought as two options
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = colour;
      ctx.ellipse(x + centred, y + centred, radius - 3, radius, Math.PI, 0, 2 * Math.PI);
      ctx.stroke();
      break;

    default:
      // should not get here
      break;
  }
};

export const boardTraverse = (
  x: number, y: number,
  { rowSize, colSize, blockSize }: BoardBounds
) => {
  let kPos = -1;
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      const cy = i * blockSize;
      const cx = j * blockSize;
      const k = (i * rowSize) + j;
      if (x > cx && x < (cx + blockSize) &&
        y > cy && y < (cy + blockSize)) {
        kPos = k;
      }
    }
  }
  return kPos;
};



