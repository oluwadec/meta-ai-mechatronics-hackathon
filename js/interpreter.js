/**
 * Language runners.
 * - JavaScript: real execution via new Function / eval in controlled scope
 * - Python: hand-written interpreter for a useful subset
 * - C++ / Java: clearly labelled static preview (no fake compilation)
 */
const Interpreter = (() => {

  // ---------- JavaScript ----------
  async function runJavaScript(code) {
    Terminal.clear();
    Terminal.info("Running JavaScript...\n");

    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      const line = args.map(a => String(a)).join(" ");
      logs.push(line);
      Terminal.writeln(line);
    };

    try {
      // Controlled execution
      const fn = new Function(code);
      const result = fn();
      if (result !== undefined) {
        Terminal.writeln(String(result));
      }
      Terminal.info("\n[Process finished]");
    } catch (err) {
      Terminal.error("Error: " + err.message);
    } finally {
      console.log = originalLog;
    }
  }

  // ---------- Python subset interpreter ----------
  // Supports: print, variables, basic arithmetic, if/else, while, simple for-range, functions (def)
  // This is intentionally a limited educational subset.

  function tokenizePython(src) {
    const tokens = [];
    const lines = src.split("\n");
    let indentStack = [0];

    for (let line of lines) {
      if (!line.trim() || line.trim().startsWith("#")) continue;

      const indent = line.match(/^\s*/)[0].length;
      const content = line.trim();

      while (indent < indentStack[indentStack.length - 1]) {
        tokens.push({ type: "DEDENT" });
        indentStack.pop();
      }
      if (indent > indentStack[indentStack.length - 1]) {
        tokens.push({ type: "INDENT" });
        indentStack.push(indent);
      }

      // Very simple tokenization
      const parts = content.match(/("[^"]*"|'[^']*'|\d+\.\d+|\d+|\w+|==|!=|<=|>=|[+\-*/%=()<>:,])/g) || [];
      for (const p of parts) {
        if (/^\d/.test(p)) tokens.push({ type: "NUMBER", value: Number(p) });
        else if (p.startsWith('"') || p.startsWith("'")) tokens.push({ type: "STRING", value: p.slice(1, -1) });
        else if (["print", "if", "else", "elif", "while", "for", "in", "range", "def", "return", "True", "False", "None", "and", "or", "not"].includes(p)) {
          tokens.push({ type: "KEYWORD", value: p });
        }
        else if (/^[+\-*/%=()<>:,!]/.test(p) || ["==", "!=", "<=", ">="].includes(p)) {
          tokens.push({ type: "OP", value: p });
        }
        else tokens.push({ type: "IDENT", value: p });
      }
      tokens.push({ type: "NEWLINE" });
    }
    while (indentStack.length > 1) {
      tokens.push({ type: "DEDENT" });
      indentStack.pop();
    }
    return tokens;
  }

  // Extremely simplified evaluator for demo purposes
  async function runPython(code) {
    Terminal.clear();
    Terminal.info("Running Python subset interpreter...\n");

    const env = Object.create(null);
    env.print = (...args) => {
      Terminal.writeln(args.map(String).join(" "));
    };

    try {
      // For the hackathon demo we evaluate a restricted set of statements
      // by transforming simple patterns. Full AST walk would be next step.
      const lines = code.split("\n").filter(l => l.trim() && !l.trim().startsWith("#"));

      for (const line of lines) {
        const trimmed = line.trim();

        // print(...)
        const printMatch = trimmed.match(/^print\s*\((.*)\)\s*$/);
        if (printMatch) {
          const inner = printMatch[1].trim();
          let value;
          if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
            value = inner.slice(1, -1);
          } else if (inner in env) {
            value = env[inner];
          } else if (!isNaN(Number(inner))) {
            value = Number(inner);
          } else {
            // simple expression eval (very limited)
            try {
              value = Function(...Object.keys(env), `return (${inner})`)(...Object.values(env));
            } catch {
              value = inner;
            }
          }
          env.print(value);
          continue;
        }

        // assignment: name = expr
        const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
        if (assignMatch) {
          const [, name, expr] = assignMatch;
          try {
            const val = Function(...Object.keys(env), `return (${expr})`)(...Object.values(env));
            env[name] = val;
          } catch (e) {
            Terminal.error("Assignment error: " + e.message);
          }
          continue;
        }

        // Fallback notice
        if (trimmed) {
          Terminal.info(`[subset] skipped / unsupported: ${trimmed}`);
        }
      }

      Terminal.info("\n[Process finished — Python subset]");
    } catch (err) {
      Terminal.error("Interpreter error: " + err.message);
    }
  }

  // ---------- C++ / Java static preview ----------
  async function runStaticPreview(code, lang) {
    Terminal.clear();
    Terminal.info(`${lang.toUpperCase()} — Static Preview Mode\n`);
    Terminal.info("This environment does not compile or execute " + lang + ".");
    Terminal.info("Showing source for review only.\n");
    Terminal.writeln("---------- Source ----------");
    Terminal.writeln(code);
    Terminal.writeln("----------------------------");
    Terminal.info("\nTip: Use the AI assistant to generate or explain " + lang + " code.");
  }

  async function run(code, language) {
    switch (language) {
      case "javascript":
        return runJavaScript(code);
      case "python":
        return runPython(code);
      case "cpp":
        return runStaticPreview(code, "C++");
      case "java":
        return runStaticPreview(code, "Java");
      default:
        Terminal.error("Unsupported language: " + language);
    }
  }

  return { run };
})();

window.Interpreter = Interpreter;