import { computed, readonly, ref } from 'vue';

export type TileValue = number | null;
type RandomSource = () => number;

interface UsePuzzleBoardOptions {
  initialTiles?: TileValue[];
  random?: RandomSource;
}

export const boardSize = 4;
export const solvedTiles: TileValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
const minimumScrambleMoves = 10;
const scrambleMoveRange = 11;

function getTilePosition(index: number) {
  return {
    row: Math.floor(index / boardSize),
    column: index % boardSize
  };
}

function getAdjacentIndexes(index: number) {
  const { row, column } = getTilePosition(index);
  const adjacentIndexes: number[] = [];

  if (row > 0) {
    adjacentIndexes.push(index - boardSize);
  }

  if (row < boardSize - 1) {
    adjacentIndexes.push(index + boardSize);
  }

  if (column > 0) {
    adjacentIndexes.push(index - 1);
  }

  if (column < boardSize - 1) {
    adjacentIndexes.push(index + 1);
  }

  return adjacentIndexes;
}

export function isSolved(tileValues: TileValue[]) {
  return tileValues.every((tile, index) => tile === solvedTiles[index]);
}

export function isSolvable(tileValues: TileValue[]) {
  const numberedTiles = tileValues.filter((tile): tile is number => tile !== null);
  const inversions = numberedTiles.reduce((count, tile, index) => {
    const laterInversions = numberedTiles
      .slice(index + 1)
      .filter((otherTile) => tile > otherTile).length;

    return count + laterInversions;
  }, 0);

  const emptyTileIndex = tileValues.findIndex((tile) => tile === null);
  const emptyRowFromBottom = boardSize - Math.floor(emptyTileIndex / boardSize);

  return emptyRowFromBottom % 2 === 0 ? inversions % 2 === 1 : inversions % 2 === 0;
}

function getRandomItem<T>(items: T[], random: RandomSource) {
  return items[Math.floor(random() * items.length)];
}

export function createRandomSolvableTiles(random: RandomSource = Math.random): TileValue[] {
  const scrambledTiles = [...solvedTiles];
  const scrambleMoves = minimumScrambleMoves + Math.floor(random() * scrambleMoveRange);
  let emptyTileIndex = scrambledTiles.findIndex((tile) => tile === null);
  let previousEmptyTileIndex: number | null = null;

  for (let move = 0; move < scrambleMoves; move += 1) {
    const adjacentIndexes = getAdjacentIndexes(emptyTileIndex).filter(
      (index) => index !== previousEmptyTileIndex
    );
    const nextTileIndex = getRandomItem(adjacentIndexes, random);
    const nextTile = nextTileIndex === undefined ? undefined : scrambledTiles[nextTileIndex];

    if (nextTileIndex === undefined || nextTile === undefined) {
      continue;
    }

    scrambledTiles[emptyTileIndex] = nextTile;
    scrambledTiles[nextTileIndex] = null;
    previousEmptyTileIndex = emptyTileIndex;
    emptyTileIndex = nextTileIndex;
  }

  if (isSolved(scrambledTiles)) {
    return createRandomSolvableTiles(random);
  }

  return scrambledTiles;
}

export function usePuzzleBoard(options: UsePuzzleBoardOptions = {}) {
  const random = options.random ?? Math.random;
  const getStartingTiles = () => options.initialTiles ?? createRandomSolvableTiles(random);
  const startingTiles = ref<TileValue[]>([...getStartingTiles()]);

  const tiles = ref<TileValue[]>([...startingTiles.value]);
  const moves = ref(0);

  const emptyTileIndex = computed(() => tiles.value.findIndex((tile) => tile === null));

  function isAdjacentToEmpty(index: number) {
    const tilePosition = getTilePosition(index);
    const emptyPosition = getTilePosition(emptyTileIndex.value);

    return (
      Math.abs(tilePosition.row - emptyPosition.row) +
        Math.abs(tilePosition.column - emptyPosition.column) ===
      1
    );
  }

  function moveTile(index: number) {
    if (!isAdjacentToEmpty(index)) {
      return;
    }

    const nextTiles = [...tiles.value];
    const movedTile = nextTiles[index];

    if (movedTile === undefined || movedTile === null) {
      return;
    }

    nextTiles[emptyTileIndex.value] = movedTile;
    nextTiles[index] = null;
    tiles.value = nextTiles;
    moves.value += 1;
  }

  function startNewGame() {
    startingTiles.value = [...createRandomSolvableTiles(random)];
    tiles.value = [...startingTiles.value];
    moves.value = 0;
  }

  function resetBoard() {
    tiles.value = [...startingTiles.value];
    moves.value = 0;
  }

  return {
    startingTiles: readonly(startingTiles),
    tiles: readonly(tiles),
    moves: readonly(moves),
    emptyTileIndex,
    isAdjacentToEmpty,
    moveTile,
    resetBoard,
    startNewGame
  };
}
