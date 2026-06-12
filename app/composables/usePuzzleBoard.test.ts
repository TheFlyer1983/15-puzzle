import { describe, expect, it } from 'vitest';

import {
  createRandomSolvableTiles,
  isSolvable,
  isSolved,
  solvedTiles,
  usePuzzleBoard,
  type TileValue
} from './usePuzzleBoard';

const moveableTiles: TileValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, null, 14, 15];
const alwaysFirstRandom = () => 0;
const alwaysLastRandom = () => 0.999_999;

function createSequenceRandom(values: number[]) {
  let index = 0;

  return () => values[index++] ?? 0;
}

function createRepeatingSequenceRandom(values: number[]) {
  let index = 0;

  return () => values[index++ % values.length] ?? 0;
}

describe('usePuzzleBoard', () => {
  it('creates an easy randomized solvable board from valid moves', () => {
    const tiles = createRandomSolvableTiles(alwaysFirstRandom);

    expect(tiles).toHaveLength(16);
    expect(tiles).not.toEqual(solvedTiles);
    expect(isSolved(tiles)).toBe(false);
    expect(isSolvable(tiles)).toBe(true);
    expect(tiles.toSorted((a: TileValue, b: TileValue) => (a ?? 16) - (b ?? 16))).toEqual(
      solvedTiles
    );
  });

  it('creates scrambles between 10 and 20 legal moves from solved', () => {
    const tenMoveTiles = createRandomSolvableTiles(alwaysFirstRandom);
    const twentyMoveTiles = createRandomSolvableTiles(alwaysLastRandom);

    expect(tenMoveTiles).toEqual([1, 2, 7, 3, 5, null, 11, 4, 9, 6, 15, 8, 13, 10, 14, 12]);
    expect(twentyMoveTiles).toEqual([1, 2, 3, 4, 5, 6, 7, 8, null, 12, 15, 14, 11, 10, 9, 13]);
  });

  it('throws when the random source returns out-of-range values', () => {
    expect(() => createRandomSolvableTiles(() => Number.NaN)).toThrow(
      'RandomSource must return a finite number in the range [0, 1).'
    );
    expect(() => createRandomSolvableTiles(createSequenceRandom([0, 1]))).toThrow(
      'RandomSource must return a finite number in the range [0, 1).'
    );
  });

  it('retries with valid random choices when a scramble leaves the board solved', () => {
    const solvedCycleChoices = [
      2 / 11,
      0.999_999,
      0,
      0.999_999,
      0.999_999,
      0,
      0,
      0.999_999,
      0.999_999,
      0,
      0,
      0.999_999,
      0.999_999
    ];
    const random = createSequenceRandom([...solvedCycleChoices, 0]);

    const tiles = createRandomSolvableTiles(random);

    expect(tiles).not.toEqual(solvedTiles);
    expect(isSolvable(tiles)).toBe(true);
  });

  it('fails fast when valid random choices repeatedly leave the board solved', () => {
    const solvedCycleChoices = [
      2 / 11,
      0.999_999,
      0,
      0.999_999,
      0.999_999,
      0,
      0,
      0.999_999,
      0.999_999,
      0,
      0,
      0.999_999,
      0.999_999
    ];
    const random = createRepeatingSequenceRandom(solvedCycleChoices);

    expect(() => createRandomSolvableTiles(random)).toThrow(
      'Unable to create a randomized puzzle board after repeated attempts.'
    );
  });

  it('detects unsolvable layouts', () => {
    const unsolvableTiles: TileValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, null];

    expect(isSolvable(solvedTiles)).toBe(true);
    expect(isSolvable(unsolvableTiles)).toBe(false);
  });

  it('only treats complete solved layouts as solved', () => {
    expect(isSolved(solvedTiles)).toBe(true);
    expect(isSolved([])).toBe(false);
    expect(isSolved([1, 2, 3, 4])).toBe(false);
  });

  it('starts with a randomized board by default', () => {
    const board = usePuzzleBoard({ random: alwaysFirstRandom });

    expect(board.tiles.value).toHaveLength(16);
    expect(board.tiles.value).toEqual(board.startingTiles.value);
    expect(board.tiles.value).not.toEqual(solvedTiles);
    expect(isSolvable([...board.tiles.value])).toBe(true);
    expect(board.moves.value).toBe(0);
  });

  it('moves a tile adjacent to the empty space', () => {
    const board = usePuzzleBoard({ initialTiles: moveableTiles });

    board.moveTile(14);

    expect(board.tiles.value).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null, 15]);
    expect(board.emptyTileIndex.value).toBe(14);
    expect(board.moves.value).toBe(1);
  });

  it('ignores tile clicks that are not adjacent to the empty space', () => {
    const board = usePuzzleBoard({ initialTiles: moveableTiles });

    board.moveTile(0);

    expect(board.tiles.value).toEqual(moveableTiles);
    expect(board.emptyTileIndex.value).toBe(13);
    expect(board.moves.value).toBe(0);
  });

  it('ignores adjacent positions without a tile value', () => {
    const malformedTiles: TileValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, null];
    const board = usePuzzleBoard({ initialTiles: malformedTiles });

    board.moveTile(14);

    expect(board.tiles.value).toEqual(malformedTiles);
    expect(board.moves.value).toBe(0);
  });

  it('only marks tiles directly next to the empty space as adjacent', () => {
    const board = usePuzzleBoard({
      initialTiles: [13, 7, 14, 1, 8, 11, 3, 15, 4, 12, 2, 10, null, 5, 6, 9]
    });

    const adjacentTiles = board.tiles.value.filter(
      (tile, index) => tile !== null && board.isAdjacentToEmpty(index)
    );

    expect(adjacentTiles).toEqual([4, 5]);
  });

  it('resets the current game back to its starting board', () => {
    const board = usePuzzleBoard({ initialTiles: moveableTiles });

    board.moveTile(14);
    board.resetBoard();

    expect(board.tiles.value).toEqual(moveableTiles);
    expect(board.startingTiles.value).toEqual(moveableTiles);
    expect(board.moves.value).toBe(0);
  });

  it('starts a new randomized game and resets the move counter', () => {
    const board = usePuzzleBoard({ initialTiles: moveableTiles, random: alwaysFirstRandom });

    board.moveTile(14);
    board.startNewGame();

    expect(board.tiles.value).not.toEqual(moveableTiles);
    expect(board.tiles.value).toEqual(board.startingTiles.value);
    expect(isSolved([...board.tiles.value])).toBe(false);
    expect(isSolvable([...board.tiles.value])).toBe(true);
    expect(board.moves.value).toBe(0);
  });
});
