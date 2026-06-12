import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';

import App from './app.vue';

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
});
