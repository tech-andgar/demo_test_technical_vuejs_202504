import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '@/App.vue';
vi.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    template: '<div class="router-link"><slot /></div>',
  },
  RouterView: {
    name: 'RouterView',
    template: '<div class="router-view"></div>',
  },
}));

describe('App', () => {
  it('renders properly with header and router view', () => {
    const wrapper = mount(App);

    expect(wrapper.find('header').exists()).toBe(true);

    expect(wrapper.find('header div.wrapper').exists()).toBe(true);

    expect(wrapper.find('.router-view').exists()).toBe(true);
  });

  it('has the correct structure for header', () => {
    const wrapper = mount(App);

    const header = wrapper.find('header');
    expect(header.find('.wrapper').exists()).toBe(true);

    expect(wrapper.find('header').exists()).toBe(true);
    expect(wrapper.find('header > div').exists()).toBe(true);
  });
});
