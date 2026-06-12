import { describe, expect, it } from 'vitest';

import { initialTiles, usePuzzleBoard } from './usePuzzleBoard';

describe('usePuzzleBoard', () => {
  it('starts with a 4x4 board containing tiles 1 through 15 and one empty space', () => {
    const board = usePuzzleBoard();

    expect(board.tiles.value).toEqual(initialTiles);
    expect(board.tiles.value).toHaveLength(16);
    expect(board.emptyTileIndex.value).toBe(13);
    expect(board.moves.value).toBe(0);
  });

  it('moves a tile adjacent to the empty space', () => {
    const board = usePuzzleBoard();

    board.moveTile(14);

    expect(board.tiles.value).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, null, 15]);
    expect(board.emptyTileIndex.value).toBe(14);
    expect(board.moves.value).toBe(1);
  });

  it('ignores tile clicks that are not adjacent to the empty space', () => {
    const board = usePuzzleBoard();

    board.moveTile(0);

    expect(board.tiles.value).toEqual(initialTiles);
    expect(board.emptyTileIndex.value).toBe(13);
    expect(board.moves.value).toBe(0);
  });

  it('resets the board and move counter', () => {
    const board = usePuzzleBoard();

    board.moveTile(14);
    board.resetBoard();

    expect(board.tiles.value).toEqual(initialTiles);
    expect(board.emptyTileIndex.value).toBe(13);
    expect(board.moves.value).toBe(0);
  });
});
