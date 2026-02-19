"use client";

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);

interface CodeBlockProps {
    code: string;
    language?: string;
}

export default function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
    return (
        <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: '0.75rem',
                lineHeight: '1.5',
            }}
            wrapLines={true}
            wrapLongLines={true}
        >
            {code}
        </SyntaxHighlighter>
    );
}
