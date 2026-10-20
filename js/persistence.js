/**
 * Persistence layer using localStorage.
 * Saves workspace files + chat history so the session survives reloads.
 */
const Persistence = (() => {
  const KEYS = {
    files: "codespace_files",
    activeFile: "codespace_active",
    chat: "codespace_chat",
    language: "codespace_lang"
  };

  function saveFiles(files, activeId) {
    try {
      localStorage.setItem(KEYS.files, JSON.stringify(files));
      localStorage.setItem(KEYS.activeFile, activeId);
    } catch (e) {
      console.warn("Failed to persist files", e);
    }
  }

  function loadFiles() {
    try {
      const raw = localStorage.getItem(KEYS.files);
      const active = localStorage.getItem(KEYS.activeFile);
      if (!raw) return null;
      return { files: JSON.parse(raw), activeId: active };
    } catch {
      return null;
    }
  }

  function saveChat(messages) {
    try {
      localStorage.setItem(KEYS.chat, JSON.stringify(messages));
    } catch (e) {
      console.warn("Failed to persist chat", e);
    }
  }

  function loadChat() {
    try {
      const raw = localStorage.getItem(KEYS.chat);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveLanguage(lang) {
    localStorage.setItem(KEYS.language, lang);
  }

  function loadLanguage() {
    return localStorage.getItem(KEYS.language) || "javascript";
  }

  return { saveFiles, loadFiles, saveChat, loadChat, saveLanguage, loadLanguage };
})();

window.Persistence = Persistence;