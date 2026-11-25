import type { Preview } from '@storybook/react-vite'

// Brand fonts, bundled offline (same set as src/main.tsx).
import '@fontsource/dm-sans/100.css'
import '@fontsource/dm-sans/300.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/dm-sans/400-italic.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import './preview.css'

// The design-system tokens are scoped to `.vds` (so they never meet the deck chrome's Tailwind theme in the app).
// Storybook has no Tailwind: put the scope on <html> so stories, element stories and the MDX foundations pages all
// see the tokens, exactly as in vinta-slidedeck-deprecated where they lived on :root.
document.documentElement.classList.add('vds')

const preview: Preview = {
  // props documented automatically from each component's types + JSDoc
  tags: ['autodocs'],
  parameters: {
    options: { storySort: { order: ['00 Start here', '01 Foundations', 'Elements', 'Patterns', 'Samples'] } },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
