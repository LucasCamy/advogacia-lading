import { Fragment } from 'react'

/**
 * Divide um texto em palavras mascaradas para revelação escalonada.
 * O texto completo fica disponível ao leitor de tela via aria-label no elemento pai.
 */
export function SplitWords({ text, wordClass = 'word' }: { text: string; wordClass?: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="mask-line" aria-hidden>
            <span className={wordClass}>{w}</span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
      <span className="sr-only">{text}</span>
    </>
  )
}
