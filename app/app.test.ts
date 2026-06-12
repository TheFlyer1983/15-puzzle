import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';

import App from './app.vue';

describe('App', () => {
  it('renders the puzzle board and moves an adjacent tile', async () => {
    const wrapper = await mountSuspended(App);

    expect(wrapper.text()).toContain('15 Puzzle');
    expect(wrapper.text()).not.toContain('Nuxt Welcome');
    expect(wrapper.text()).toContain('Moves');
    expect(wrapper.get('[aria-label="Move count"]').text()).toBe('0');
    expect(wrapper.findAll('button')).toHaveLength(16);

    const tileFourteen = wrapper.findAll('button').find((button) => button.text() === '14');
    expect(tileFourteen).toBeTruthy();
    await tileFourteen!.trigger('click');

    expect(wrapper.get('[aria-label="Move count"]').text()).toBe('1');
    expect(wrapper.find('div[aria-hidden="true"].border-dashed').exists()).toBe(true);
  });
});
