import { Fragment } from 'react';
import { Link } from '@/i18n/navigation';

/** Başlıqdan stabil anchor id (Azərbaycan/kiril/alman hərfləri saxlanılır). */
export const anchorId = (s: string) =>
  s.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 80);

/** **qalın** və [mətn](url) — HTML qəbul edilmir, yalnız React elementləri. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const b = p.match(/^\*\*([^*]+)\*\*$/);
        if (b) return <strong key={i}>{b[1]}</strong>;
        const l = p.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (l) {
          const href = l[2];
          if (href.startsWith('/')) return <Link key={i} href={href}>{l[1]}</Link>;
          if (/^https?:\/\//.test(href)) return <a key={i} href={href} target="_blank" rel="noopener noreferrer">{l[1]}</a>;
          return <Fragment key={i}>{l[1]}</Fragment>;
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

export function headingsOf(text: string) {
  return text.replace(/\r/g, '').split(/\n{2,}/).map((b) => b.trim()).filter((b) => b.startsWith('## ')).map((b) => ({ id: anchorId(b.slice(3)), text: b.slice(3) }));
}

/** Məqalə mətni: ## / ### başlıq, "- " və "1. " siyahılar, "> " qeyd, abzaslar. */
export default function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose-site">
      {blocks.map((b, i) => {
        if (b.startsWith('## ')) return <h2 key={i} id={anchorId(b.slice(3))}>{b.slice(3)}</h2>;
        if (b.startsWith('### ')) return <h3 key={i}>{b.slice(4)}</h3>;
        if (b.startsWith('> ')) return <blockquote key={i}><Inline text={b.replace(/^> ?/gm, '')} /></blockquote>;
        const lines = b.split('\n');
        if (lines.every((l) => /^- /.test(l))) return <ul key={i}>{lines.map((l, j) => <li key={j}><Inline text={l.slice(2)} /></li>)}</ul>;
        if (lines.every((l) => /^\d+\. /.test(l))) return <ol key={i}>{lines.map((l, j) => <li key={j}><Inline text={l.replace(/^\d+\. /, '')} /></li>)}</ol>;
        return <p key={i}>{lines.map((l, j) => <Fragment key={j}><Inline text={l} />{j < lines.length - 1 && <br />}</Fragment>)}</p>;
      })}
    </div>
  );
}
