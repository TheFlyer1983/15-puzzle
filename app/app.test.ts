import { useState } from '#app';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';

import App from './app.vue';
import type { TileValue } from './composables/usePuzzleBoard';

const oneMoveFromSolvedTiles: TileValue[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  null,
  15
];

describe('App', () => {
  it('renders the puzzle board and moves an adjacent tile', async () => {
    const wrapper = await mountSuspended(App);

    expect(wrapper.text()).toContain('15 Puzzle');
    expect(wrapper.text()).not.toContain('Nuxt Welcome');
    expect(wrapper.text()).toContain('Moves');
    expect(wrapper.text()).toContain('Reset');
    expect(wrapper.text()).toContain('New game');
    expect(wrapper.text()).not.toContain('Puzzle complete!');
    expect(wrapper.get('[aria-label="Move count"]').text()).toBe('0');
    expect(wrapper.findAll('button')).toHaveLength(17);

    const movableTile = wrapper
      .findAll('button')
      .find((button) => /^\d+$/.test(button.text()) && button.attributes('disabled') === undefined);

    expect(movableTile).toBeTruthy();
    await movableTile!.trigger('click');

    expect(wrapper.get('[aria-label="Move count"]').text()).toBe('1');
    expect(wrapper.find('div[aria-hidden="true"].border-dashed').exists()).toBe(true);
  });

  it('shows completion UI and disables tile buttons after solving', async () => {
    useState<TileValue[]>('puzzle-starting-tiles').value = [...oneMoveFromSolvedTiles];
    useState<TileValue[]>('puzzle-tiles').value = [...oneMoveFromSolvedTiles];
    useState('puzzle-moves').value = 0;

    const wrapper = await mountSuspended(App);
    const finalTile = wrapper.findAll('button').find((button) => button.text() === '15');

    expect(finalTile).toBeTruthy();
    await finalTile!.trigger('click');

    const tileButtons = wrapper.findAll('button').filter((button) => /^\d+$/.test(button.text()));

    expect(wrapper.text()).toContain('Puzzle complete!');
    expect(wrapper.get('[aria-label="Move count"]').text()).toBe('1');
    expect(tileButtons).toHaveLength(15);
    expect(tileButtons.every((button) => button.attributes('disabled') !== undefined)).toBe(true);
  });
});
