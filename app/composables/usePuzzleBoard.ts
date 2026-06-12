import { computed, readonly, ref } from 'vue';

export type TileValue = number | null;

export const boardSize = 4;
export const initialTiles: TileValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, null, 14, 15];

export function usePuzzleBoard() {
  const tiles = ref<TileValue[]>([...initialTiles]);
  const moves = ref(0);

  const emptyTileIndex = computed(() => tiles.value.findIndex((tile) => tile === null));

  function getTilePosition(index: number) {
    return {
      row: Math.floor(index / boardSize),
      column: index % boardSize
    };
  }

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

  function resetBoard() {
    tiles.value = [...initialTiles];
    moves.value = 0;
  }

  return {
    tiles: readonly(tiles),
    moves: readonly(moves),
    emptyTileIndex,
    isAdjacentToEmpty,
    moveTile,
    resetBoard
  };
}
