import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CodeBlockProps {
  code: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('relative group', className)}>
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 p-2 rounded-md bg-ait-neutral-800 hover:bg-ait-neutral-700 transition-colors opacity-0 group-hover:opacity-100 z-10"
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <Check className="w-4 h-4 text-ait-success-400" />
        ) : (
          <Copy className="w-4 h-4 text-ait-neutral-300" />
        )}
      </button>
      <pre className="bg-ait-neutral-900 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-ait-neutral-100 font-mono leading-relaxed">{code}</code>
      </pre>
    </div>
  );
}
