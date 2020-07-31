module.exports = (api) => {
  const presets = ['@babel/preset-react', '@babel/preset-typescript'];
  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    'styled-jsx/babel',
  ];

  if (api.env('production')) {
    presets.push([
      '@babel/preset-env',
      {
        targets: '> 2% in JP, not IE 11',
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ]);
  } else {
    plugins.push('react-refresh/babel');
  }
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets,
    plugins,
  };
};
