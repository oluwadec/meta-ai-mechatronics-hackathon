/**
 * Interactive terminal panel.
 * Supports writing stdout/stderr and collecting live input (cin-style).
 */
const Terminal = (() => {
  const el = () => document.getElementById("terminal");
  const inputEl = () => document.getElementById("terminal-input");

  let inputResolver = null;

  function clear() {
    el().innerHTML = "";
  }

  function write(text, className = "stdout") {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    el().appendChild(span);
    el().scrollTop = el().scrollHeight;
  }

  function writeln(text, className = "stdout") {
    write(text + "\n", className);
  }

  function info(text) {
    writeln(text, "info");
  }

  function error(text) {
    writeln(text, "stderr");
  }

  /**
   * Wait for the next line of input from the user.
   * Used by interpreters that need cin >> x style input.
   */
  function readLine() {
    return new Promise((resolve) => {
      inputResolver = resolve;
      inputEl().focus();
    });
  }

  function setupInput() {
    inputEl().addEventListener("keydown", (e) => {
      if (e.key === "Enter" && inputResolver) {
        const value = inputEl().value;
        inputEl().value = "";
        writeln("> " + value, "info");
        const resolve = inputResolver;
        inputResolver = null;
        resolve(value);
      }
    });
  }

  return { clear, write, writeln, info, error, readLine, setupInput };
})();

window.Terminal = Terminal;