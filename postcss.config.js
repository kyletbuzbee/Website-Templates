module.exports = {
  plugins: {
    // Autoprefixer for browser compatibility
    autoprefixer: {
      grid: true,
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ]
    },

    // PostCSS Preset Env for modern CSS features
    'postcss-preset-env': {
      stage: 2,
      autoprefixer: false,
      features: {
        'custom-properties': {
          preserve: true
        },
        'nesting-rules': true
      }
    },

    // CSSNano for production minification
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  }
};
