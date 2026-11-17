import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  theme: {
    colors: {
      primary: '#409eff',
      canvas: '#f5f7f9',
      border: '#ebeef5',
      ink: '#303133',
      muted: '#909399',
    },
  },
})
