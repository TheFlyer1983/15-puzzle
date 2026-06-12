import { computed, readonly, ref } from 'vue';

export type TileValue = number | null;

/**
 * Custom random sources must match Math.random(): a finite number in [0, 1).
 */
type RandomSource = () => number;

interface UsePuzzleBoardOptions {
  initialTiles?: TileValue[];
  random?: RandomSource;
}

export const boardSize = 4;
export const solvedTiles: TileValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
const minimumScrambleMoves = 10;
const scrambleMoveRange = 11;
const maximumScrambleAttempts = 100;

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
  return (
    tileValues.length === solvedTiles.length &&
    tileValues.every((tile, index) => tile === solvedTiles[index])
  );
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

function getRandomValue(random: RandomSource) {
  const randomValue = random();

  if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
    throw new RangeError('RandomSource must return a finite number in the range [0, 1).');
  }

  return randomValue;
}

function getRandomItem<T>(items: T[], random: RandomSource) {
  const randomValue = getRandomValue(random);

  const item = items[Math.floor(randomValue * items.length)];

  if (item === undefined) {
    throw new Error('Unable to select a random item from an empty list.');
  }

  return item;
}

export function createRandomSolvableTiles(random: RandomSource = Math.random): TileValue[] {
  for (let attempt = 0; attempt < maximumScrambleAttempts; attempt += 1) {
    const scrambledTiles = [...solvedTiles];
    const scrambleMoves =
      minimumScrambleMoves + Math.floor(getRandomValue(random) * scrambleMoveRange);
    let emptyTileIndex = scrambledTiles.findIndex((tile) => tile === null);
    let previousEmptyTileIndex: number | null = null;

    for (let move = 0; move < scrambleMoves; move += 1) {
      const adjacentIndexes = getAdjacentIndexes(emptyTileIndex).filter(
        (index) => index !== previousEmptyTileIndex
      );
      const nextTileIndex = getRandomItem(adjacentIndexes, random);
      const nextTile = scrambledTiles[nextTileIndex];

      if (nextTile === undefined || nextTile === null) {
        throw new Error(
          'Unable to create puzzle board because a random move could not be selected.'
        );
      }

      scrambledTiles[emptyTileIndex] = nextTile;
      scrambledTiles[nextTileIndex] = null;
      previousEmptyTileIndex = emptyTileIndex;
      emptyTileIndex = nextTileIndex;
    }

    if (!isSolved(scrambledTiles)) {
      return scrambledTiles;
    }
  }

  throw new Error('Unable to create a randomized puzzle board after repeated attempts.');
}

export function usePuzzleBoard(options: UsePuzzleBoardOptions = {}) {
  const random = options.random ?? Math.random;
  const getStartingTiles = () => options.initialTiles ?? createRandomSolvableTiles(random);
  const shouldHydrateState = options.initialTiles === undefined && options.random === undefined;
  const createState = <T>(key: string, initialValue: () => T) => {
    if (!shouldHydrateState) {
      return ref<T>(initialValue());
    }

    const state = useState<T>(key, initialValue);

    if (state.value === undefined) {
      state.value = initialValue();
    }

    return state;
  };
  const startingTiles = createState('puzzle-starting-tiles', () => [...getStartingTiles()]);

  const tiles = createState('puzzle-tiles', () => [...startingTiles.value]);
  const moves = createState('puzzle-moves', () => 0);

  const emptyTileIndex = computed(() => tiles.value.findIndex((tile) => tile === null));
  const isComplete = computed(() => isSolved(tiles.value));

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
    if (isComplete.value || !isAdjacentToEmpty(index)) {
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
    isComplete,
    isAdjacentToEmpty,
    moveTile,
    resetBoard,
    startNewGame
  };
}
