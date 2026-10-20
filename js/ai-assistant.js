/**
 * Floating, draggable AI pair-programming assistant.
 * - Shows live diagnostics with Apply Fix buttons
 * - Chat interface that can write code into the editor
 * - Designed for easy swap-in of Meta Muse / LLM backends
 */
const AIAssistant = (() => {
  let messages = [];
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const el = () => document.getElementById("ai-assistant");
  const chatEl = () => document.getElementById("chat-history");
  const diagEl = () => document.getElementById("diagnostics");

  function init() {
    messages = Persistence.loadChat();
    renderChat();

    // Drag support
    const handle = document.getElementById("ai-drag-handle");
    handle.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", endDrag);

    // Toggle minimize
    document.getElementById("ai-toggle").addEventListener("click", () => {
      el().classList.toggle("minimized");
    });

    // Chat send
    document.getElementById("chat-send").addEventListener("click", sendMessage);
    document.getElementById("chat-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

  function startDrag(e) {
    isDragging = true;
    const rect = el().getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  }

  function onDrag(e) {
    if (!isDragging) return;
    el().style.left = (e.clientX - offsetX) + "px";
    el().style.top = (e.clientY - offsetY) + "px";
    el().style.bottom = "auto";
    el().style.right = "auto";
  }

  function endDrag() {
    isDragging = false;
  }

  function renderDiagnostics(diags) {
    diagEl().innerHTML = "";
    if (!diags.length) return;

    diags.forEach(d => {
      const div = document.createElement("div");
      div.className = "diagnostic " + d.severity;
      div.innerHTML = `<div class="msg">${d.message}</div>`;
      if (d.fix) {
        const btn = document.createElement("button");
        btn.className = "apply-fix";
        btn.textContent = "Apply fix";
        btn.onclick = () => d.fix.apply();
        div.appendChild(btn);
      }
      diagEl().appendChild(div);
    });
  }

  function renderChat() {
    chatEl().innerHTML = "";
    messages.forEach(m => {
      const div = document.createElement("div");
      div.className = "chat-msg " + m.role;
      div.textContent = m.content;
      chatEl().appendChild(div);
    });
    chatEl().scrollTop = chatEl().scrollHeight;
  }

  function addMessage(role, content) {
    messages.push({ role, content, ts: Date.now() });
    Persistence.saveChat(messages);
    renderChat();
  }

  async function sendMessage() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";

    addMessage("user", text);

    // Placeholder response — ready for Meta Muse / LLM integration
    addMessage("assistant", "(AI backend placeholder)\n\nFor the Meta Global AI Hackathon this will be powered by Muse Spark / Muse Code.\n\nI can help you:\n• Generate code in the current language\n• Explain or fix the code in the editor\n• Walk through LeetCode-style problems step by step\n\nConnect a Meta model endpoint to enable real responses.");
  }

  /**
   * Public API used by the linter to push diagnostics.
   */
  function updateDiagnostics(diags) {
    renderDiagnostics(diags);
  }

  return { init, updateDiagnostics, addMessage };
})();

window.AIAssistant = AIAssistant;