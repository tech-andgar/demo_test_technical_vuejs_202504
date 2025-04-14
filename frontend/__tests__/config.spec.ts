import { describe, it, expect } from 'vitest';
import tailwindConfig from '../tailwind.config.js';
import postcssConfig from '../postcss.config.js';

describe('Configuración de Tailwind', () => {
  it('tiene la configuración básica correcta', () => {
    expect(tailwindConfig).toBeDefined();
    expect(typeof tailwindConfig).toBe('object');

    expect(tailwindConfig.content).toBeDefined();

    expect(Array.isArray(tailwindConfig.content)).toBe(true);

    expect(
      tailwindConfig.content.some((path) => path.includes('src') && path.includes('vue'))
    ).toBe(true);
    expect(
      tailwindConfig.content.some((path) => path.includes('tailwind.purge.safelist.txt'))
    ).toBe(true);

    expect(tailwindConfig.presets).toBeDefined();
    expect(Array.isArray(tailwindConfig.presets)).toBe(true);
  });
});

describe('Configuración de PostCSS', () => {
  it('tiene los plugins correctos', () => {
    expect(postcssConfig).toBeDefined();
    expect(typeof postcssConfig).toBe('object');

    expect(postcssConfig.plugins).toBeDefined();

    expect(Object.keys(postcssConfig.plugins)).toContain('tailwindcss');
    expect(Object.keys(postcssConfig.plugins)).toContain('autoprefixer');
  });
});
