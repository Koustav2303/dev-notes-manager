const CodeSandbox = ({ code, language }) => {
  // Generate the HTML document to inject into the iframe based on the language
  const generateSrcDoc = () => {
    if (language === 'html') {
      return code; // Raw HTML works natively
    }

    if (language === 'javascript') {
      // For JS, we build a custom mini-terminal that intercepts console.log!
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                background: transparent; 
                color: #34d399; /* Emerald 400 */
                font-family: 'Courier New', Courier, monospace; 
                font-size: 14px;
                padding: 1rem; 
                margin: 0; 
                overflow-wrap: break-word;
              }
              .error { color: #f87171; /* Red 400 */ }
              .prefix { color: #64748b; /* Slate 500 */ }
            </style>
          </head>
          <body>
            <div id="output"></div>
            <script>
              const output = document.getElementById('output');
              
              // Hijack console.log to print to the DOM
              const originalLog = console.log;
              console.log = (...args) => {
                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : a).join(' ');
                output.innerHTML += '<span class="prefix">&gt;</span> ' + msg + '<br/>';
                originalLog.apply(console, args);
              };

              // Hijack console.error
              const originalError = console.error;
              console.error = (...args) => {
                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
                output.innerHTML += '<span class="prefix">&gt;</span> <span class="error">' + msg + '</span><br/>';
                originalError.apply(console, args);
              };

              // Execute the user's code safely
              try {
                ${code}
              } catch (err) {
                console.error(err.toString());
              }
            </script>
          </body>
        </html>
      `;
    }

    return `<div style="color:white; font-family:sans-serif; padding:1rem;">Preview not supported for ${language}.</div>`;
  };

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner">
      <iframe
        srcDoc={generateSrcDoc()}
        title="Code Sandbox"
        sandbox="allow-scripts" // Security: allows JS but prevents it from breaking out of the iframe
        className="w-full h-full border-none"
      />
    </div>
  );
};

export default CodeSandbox;