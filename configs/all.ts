import mod from '../index.js'

export default {
  plugins: {
    ninja: mod,
  },
  rules: mod.configs.all.rules,
}