import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('vue-router', () => ({
  createRouter: vi.fn(() => ({
    routes: [],
  })),
  createWebHistory: vi.fn(() => ({})),
}));

vi.mock('../../views/HomeView.vue', () => ({
  default: { name: 'MockedHomeView' },
}));

vi.stubGlobal('import.meta', {
  env: {},
});

describe('Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates router with correct configuration', async () => {
    const { createRouter, createWebHistory } = await import('vue-router');
    const HomeView = (await import('../../views/HomeView.vue')).default;

    const router = (await import('../index')).default;

    expect(createRouter).toHaveBeenCalled();

    expect(createWebHistory).toHaveBeenCalled();

    const routerConfig = vi.mocked(createRouter).mock.calls[0][0];

    expect(routerConfig.routes.length).toBeGreaterThan(0);

    const homeRoute = routerConfig.routes.find((route) => route.name === 'home');
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.path).toBe('/');
    expect(homeRoute?.component).toBe(HomeView);
  });
});
