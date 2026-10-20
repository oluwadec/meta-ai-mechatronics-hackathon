/**
 * Debounced static analysis / linting.
 * Produces clickable diagnostics with an "Apply fix" action.
 * Kept intentionally lightweight so it stays responsive while typing.
 */
const Linter = (() => {
  let timer = null;
  const DEBOUNCE_MS = 400;

  function analyze(code, language) {
    const diagnostics = [];

    if (!code.trim()) return diagnostics;

    // --- Shared simple checks ---
    if (code.includes("TODO")) {
      const line = code.split("\n").findIndex(l => l.includes("TODO")) + 1;
      diagnostics.push({
        severity: "warning",
        message: `TODO found on line ${line}`,
        line,
        fix: null
      });
    }

    // --- JavaScript specific ---
    if (language === "javascript") {
      // Missing semicolons (very naive)
      const lines = code.split("\n");
      lines.forEach((line, i) => {
        const t = line.trim();
        if (t && !t.startsWith("//") && !t.endsWith(";") && !t.endsWith("{") && !t.endsWith("}") && !t.endsWith(",") && !t.startsWith("if") && !t.startsWith("for") && !t.startsWith("while") && !t.startsWith("function") && !t.startsWith("const") && !t.startsWith("let") && !t.startsWith("var") && !t.includes("=")) {
          // skip
        }
        // Undeclared common mistake
        if (/\bconsole\.log\s*\(/.test(t) === false && /\blog\s*\(/.test(t)) {
          diagnostics.push({
            severity: "error",
            message: `Possible missing console. on line ${i + 1}`,
            line: i + 1,
            fix: {
              description: "Change log( to console.log(",
              apply: () => {
                const newCode = code.replace(/\blog\s*\(/g, "console.log(");
                Editor.setContent(newCode);
              }
            }
          });
        }
      });

      // Unmatched braces (simple count)
      const open = (code.match(/{/g) || []).length;
      const close = (code.match(/}/g) || []).length;
      if (open !== close) {
        diagnostics.push({
          severity: "error",
          message: `Unmatched braces: ${open} opening, ${close} closing`,
          line: 1,
          fix: null
        });
      }
    }

    // --- Python specific ---
    if (language === "python") {
      const lines = code.split("\n");
      lines.forEach((line, i) => {
        if (/^\s*print\s+[^(]/.test(line)) {
          diagnostics.push({
            severity: "error",
            message: `Python 3 requires parentheses: print(...) on line ${i + 1}`,
            line: i + 1,
            fix: {
              description: "Add parentheses to print",
              apply: () => {
                const newLines = code.split("\n");
                newLines[i] = newLines[i].replace(/print\s+(.+)/, "print($1)");
                Editor.setContent(newLines.join("\n"));
              }
            }
          });
        }
      });
    }

    return diagnostics;
  }

  function schedule(code, language, renderCb) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const diags = analyze(code, language);
      renderCb(diags);
    }, DEBOUNCE_MS);
  }

  return { schedule, analyze };
})();

window.Linter = Linter;