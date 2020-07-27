module.exports = (api) => {
  const presets = ['@babel/preset-react', '@babel/preset-typescript'];
  const plugins = ['styled-jsx/babel'];

  if (api.env('production')) {
    presets.push([
      '@babel/preset-env',
      {
        targets: '>2%',
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
