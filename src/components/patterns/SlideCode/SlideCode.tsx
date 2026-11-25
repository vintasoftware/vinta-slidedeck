import type { ReactNode } from 'react'
import { SlideShell } from '../SlideShell'
import { SlideHeader } from '../../elements/SlideHeader'
import { CodeWindow } from '../../elements/CodeWindow'
import { resolveTone, titleLines, type SlideTone } from '../../shared/slideTone'
import styles from './SlideCode.module.css'

export interface SlideCodeProps {
  /** Background: light wash, blue mesh or navy (default). */
  tone?: SlideTone
  /** Mono label above the title. */
  eyebrow?: string
  /** Title, line 1 (ink). */
  title: ReactNode | ReactNode[]
  /** Title, line 2 in the accent color: the site's two-tone title. */
  accent?: ReactNode
  /** One or two sentences under the title (≤ ~140 characters in split). */
  lede?: ReactNode
  /** The snippet. split: ≤ ~22 lines of ≤ ~60 characters (compact: ~30 × 80) · stacked: ≤ ~13 lines of ≤ ~110 characters. */
  code: string
  /** Prism language id (`tsx` default, `ts`, `js`, `python`, `json`, `sql`, `go`…). */
  language?: string
  /** Mono label in the window bar, e.g. "src/intake.ts". Defaults to the language. */
  filename?: string
  /** compact = smaller mono (18/26) for longer snippets. */
  density?: 'regular' | 'compact'
  /** split = header at the left, code at the right (default) · stacked = header on top, code full width below. */
  layout?: 'split' | 'stacked'
}

/** A code snippet on a slide, in the site look: two-tone header and a navy code window with syntax colors.
 *  New pattern added with the migration from vinta-slidedeck-deprecated (it has no code slide); syntax colors pending design review. */
export function SlideCode({
  tone = 'invert-navy',
  eyebrow,
  title,
  accent,
  lede,
  code,
  language,
  filename,
  density = 'regular',
  layout = 'split',
}: SlideCodeProps) {
  const t = resolveTone(tone, 'night')
  return (
    <SlideShell mode={t.shellMode} safeArea={144} background={t.background}>
      <div className={styles.body} data-layout={layout}>
        <div className={styles.header}>
          <SlideHeader
            eyebrow={eyebrow}
            title={titleLines(title)}
            accent={accent}
            lede={lede}
            mode={t.textMode}
            width={layout === 'split' ? 560 : 1200}
          />
        </div>
        <div className={styles.code}>
          <CodeWindow code={code} language={language} filename={filename} density={density} surface={t.dark ? 'dark' : 'light'} />
        </div>
      </div>
    </SlideShell>
  )
}
