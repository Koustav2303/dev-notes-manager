import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ code, language }) => {
  return (
    <div className="relative h-full overflow-y-auto custom-scrollbar">
      <SyntaxHighlighter
        language={language === 'html' ? 'markup' : language} // Prism uses 'markup' for HTML
        style={vscDarkPlus}
        customStyle={{
          background: 'transparent', // This keeps your glassmorphism intact!
          padding: '0',
          margin: '0',
          fontSize: '0.85rem',
          lineHeight: '1.5',
        }}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;