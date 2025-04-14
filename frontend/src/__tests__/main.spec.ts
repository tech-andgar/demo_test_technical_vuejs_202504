import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal();
  const mockApp = {
    use: vi.fn().mockReturnThis(),
    mount: vi.fn(),
  };
  return {
    ...actual,
    createApp: vi.fn(() => mockApp),
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
