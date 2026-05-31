import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders authored Markdown prose with The Stead's type treatments.
 * Subheads (## in the source) become Inter-caps letter-spaced labels per the
 * design system; body is Lora at the gym-readable base size.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-4 text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          h2: ({ children }) => (
            <h2 className="pt-2 font-[family-name:var(--font-label)] text-sm font-semibold uppercase tracking-[0.12em] text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="pt-1 font-[family-name:var(--font-label)] text-sm font-semibold uppercase tracking-[0.12em] text-muted">
              {children}
            </h3>
          ),
          ul: ({ children }) => <ul className="list-disc space-y-1 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-6">{children}</ol>,
          em: ({ children }) => <em className="italic">{children}</em>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          a: ({ children, href }) => (
            <a href={href} className="text-brand underline underline-offset-2">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-callout-border bg-callout px-4 py-3 text-callout-foreground">
              {children}
            </blockquote>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
