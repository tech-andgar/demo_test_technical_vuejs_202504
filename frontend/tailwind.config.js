const kvConfig = require('@kiva/kv-tokens/configs/tailwind.config.cjs');

module.exports = {
  presets: [kvConfig],
  content: [
    './node_modules/@kiva/kv-components/**/*.vue',
    './node_modules/@kiva/kv-components/utils/**/*.js',
    './src/**/*.vue',
    './tailwind.purge.safelist.txt',
  ],
};
