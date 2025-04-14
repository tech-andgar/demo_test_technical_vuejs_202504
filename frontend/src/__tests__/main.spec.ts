import { describe, it, expect, vi, beforeEach } from 'vitest';

// Ahora incluimos defineComponent en el mock de Vue
vi.mock('vue', async () => {
  const mockApp = {
    use: vi.fn().mockReturnThis(),
    mount: vi.fn(),
  };
  return {
    createApp: vi.fn(() => mockApp),
    defineComponent: (component: Record<string, any>) => component,
  };
});

vi.mock('../router', () => ({
  default: {},
}));

vi.mock('../assets/main.css', () => ({}));

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';
});

describe('main', () => {
  it('initializes the Vue app', async () => {
    const { createApp } = await import('vue');

    const App = (await import('../App.vue')).default;

    const router = (await import('../router')).default;

    await import('../main');

    expect(createApp).toHaveBeenCalledWith(App);

    const mockApp = vi.mocked(createApp).mock.results[0].value;
    expect(mockApp.use).toHaveBeenCalledWith(router);
    expect(mockApp.mount).toHaveBeenCalledWith('#app');
  });
});
