/**
 * Multi-file editor built on CodeMirror 5.
 * Supports per-file language selection and tab management.
 */
const Editor = (() => {
  let cm = null;
  let files = [];
  let activeId = null;
  let onChangeCallback = null;

  const MODE_MAP = {
    javascript: "javascript",
    python: "python",
    cpp: "text/x-c++src",
    java: "text/x-java"
  };

  function init(container, changeCb) {
    onChangeCallback = changeCb;

    cm = CodeMirror(container, {
      value: "",
      mode: "javascript",
      theme: "dracula",
      lineNumbers: true,
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: false,
      autofocus: true
    });

    cm.on("change", () => {
      if (activeId && onChangeCallback) {
        const content = cm.getValue();
        const file = files.find(f => f.id === activeId);
        if (file) {
          file.content = content;
          onChangeCallback(files, activeId);
        }
      }
    });

    // Restore or create default
    const saved = Persistence.loadFiles();
    if (saved && saved.files.length) {
      files = saved.files;
      activeId = saved.activeId || files[0].id;
    } else {
      files = [{
        id: crypto.randomUUID(),
        name: "main.js",
        language: "javascript",
        content: `// Welcome to Codespace
// Write JavaScript here and press Run

function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Meta AI Hackathon"));
`
      }];
      activeId = files[0].id;
    }

    renderTabs();
    switchTo(activeId);
  }

  function renderTabs() {
    const tabsEl = document.getElementById("file-tabs");
    tabsEl.innerHTML = "";
    files.forEach(f => {
      const tab = document.createElement("div");
      tab.className = "file-tab" + (f.id === activeId ? " active" : "");
      tab.innerHTML = `${f.name}<span class="close" data-id="${f.id}">×</span>`;
      tab.addEventListener("click", (e) => {
        if (e.target.classList.contains("close")) {
          closeFile(f.id);
        } else {
          switchTo(f.id);
        }
      });
      tabsEl.appendChild(tab);
    });
  }

  function switchTo(id) {
    const file = files.find(f => f.id === id);
    if (!file) return;
    activeId = id;
    cm.setValue(file.content);
    cm.setOption("mode", MODE_MAP[file.language] || "javascript");
    document.getElementById("language-select").value = file.language;
    renderTabs();
    Persistence.saveFiles(files, activeId);
  }

  function setLanguage(lang) {
    const file = files.find(f => f.id === activeId);
    if (!file) return;
    file.language = lang;
    // Update extension in name if simple
    const base = file.name.replace(/\.[^.]+$/, "");
    const ext = { javascript: "js", python: "py", cpp: "cpp", java: "java" }[lang] || "txt";
    file.name = `${base}.${ext}`;
    cm.setOption("mode", MODE_MAP[lang] || "javascript");
    renderTabs();
    Persistence.saveFiles(files, activeId);
    Persistence.saveLanguage(lang);
  }

  function newFile() {
    const id = crypto.randomUUID();
    const lang = document.getElementById("language-select").value;
    const ext = { javascript: "js", python: "py", cpp: "cpp", java: "java" }[lang] || "txt";
    files.push({
      id,
      name: `untitled-${files.length + 1}.${ext}`,
      language: lang,
      content: ""
    });
    switchTo(id);
  }

  function closeFile(id) {
    if (files.length <= 1) return;
    files = files.filter(f => f.id !== id);
    if (activeId === id) {
      switchTo(files[0].id);
    } else {
      renderTabs();
      Persistence.saveFiles(files, activeId);
    }
  }

  function getActive() {
    return files.find(f => f.id === activeId);
  }

  function getContent() {
    return cm.getValue();
  }

  function setContent(text) {
    cm.setValue(text);
    const file = files.find(f => f.id === activeId);
    if (file) file.content = text;
    Persistence.saveFiles(files, activeId);
  }

  function applyFix(from, to, replacement) {
    // from/to are {line, ch}
    cm.replaceRange(replacement, from, to);
  }

  return {
    init,
    newFile,
    setLanguage,
    getActive,
    getContent,
    setContent,
    applyFix,
    get cm() { return cm; }
  };
})();

window.Editor = Editor;