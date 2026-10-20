/**
 * Application bootstrap.
 * Wires editor, terminal, interpreter, linter and AI assistant together.
 */
(function () {
  // Initialize modules
  Editor.init(document.getElementById("editor-container"), (files, activeId) => {
    // Called on every editor change — trigger debounced lint
    const file = files.find(f => f.id === activeId);
    if (file) {
      Linter.schedule(file.content, file.language, (diags) => {
        AIAssistant.updateDiagnostics(diags);
      });
    }
  });

  Terminal.setupInput();
  AIAssistant.init();

  // Language selector
  document.getElementById("language-select").addEventListener("change", (e) => {
    Editor.setLanguage(e.target.value);
  });

  // New file
  document.getElementById("new-file-btn").addEventListener("click", () => {
    Editor.newFile();
  });

  // Run button
  document.getElementById("run-btn").addEventListener("click", async () => {
    const file = Editor.getActive();
    if (!file) return;
    await Interpreter.run(file.content, file.language);
  });

  // Initial lint
  const active = Editor.getActive();
  if (active) {
    Linter.schedule(active.content, active.language, (diags) => {
      AIAssistant.updateDiagnostics(diags);
    });
  }

  console.log("Codespace ready — Meta Global AI Developer Hackathon 2026");
})();