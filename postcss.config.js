export default {
  plugins: {
    'postcss-preset-env': {
      stage: 1,
      autoprefixer: {
        grid: true,
      },
      features: {
        'custom-properties': true,
        'nesting-rules': true,
      },
    },
  },
};
