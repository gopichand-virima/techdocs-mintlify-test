(function(){
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  // Read optional MCP endpoint from a meta tag
  function getMcpEndpoint() {
    const meta = document.querySelector('meta[name="virima:mcp-endpoint"]');
    return meta && meta.content ? meta.content : '';
  }

  async function sendToMcp(query) {
    const endpoint = getMcpEndpoint();
    if (!endpoint) return null;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (!res.ok) throw new Error('Bad response');
      const data = await res.json().catch(() => null);
      if (data && (data.answer || data.message)) return data.answer || data.message;
      const text = await res.text();
      return text || null;
    } catch (e) {
      return null;
    }
  }

  function getFallbackResponse(message) {
    const m = message.toLowerCase();
    if (m.includes('itam') || m.includes('asset')) {
      return "ITAM & CMDB provides comprehensive IT Asset Management. You can track hardware, software, and licenses across your infrastructure. Check out the ITAM section in the sidebar for details.";
    }
    if (m.includes('discovery') || m.includes('scan')) {
      return "The Discovery Dashboard offers real-time insights into your IT infrastructure. It automatically detects new assets and monitors changes.";
    }
    if (m.includes('ipam') || m.includes('network')) {
      return "IPAM Networks helps you manage IP addresses and subnets with intelligent automation. Prevent conflicts and track utilization.";
    }
    if (m.includes('blueprint')) {
      return "Blueprints define CI properties, relationships, and governance. See Blueprints for property configuration and SLA setup.";
    }
    if (m.includes('api')) {
      return "Refer to API documentation in your navigation for authentication, endpoints, and examples.";
    }
    return "Thanks for your question! Try searching with the box at the top, or explore the sections in the left sidebar. If you provide more specifics, I can help further.";
  }

  function buildWidget() {
    // Container
    const host = document.createElement('div');
    host.className = 'ask-virima-container';
    host.innerHTML = [
      '<button class="ask-virima-button" id="askVirimaButton" aria-label="Ask Virima">',
      '  <span>Ask Virima</span>',
      '</button>',
      '<div class="ask-virima-dropdown" id="askVirimaDropdown">',
      '  <div class="dropdown-header">',
      '    <h3>Ask Virima</h3>',
      '    <p>Your AI assistant for Virima products and solutions</p>',
      '    <div class="ask-search-row" style="margin-top:12px; display:flex; gap:8px; align-items:center; justify-content:center;">',
      '      <input id="askVirimaSearch" type="text" placeholder="Ask a question..." style="width:70%; padding:10px 12px; border:1px solid #E2E8F0; border-radius:8px; font-size:14px;">',
      '      <button id="askVirimaGo" class="ask-virima-button" style="padding:10px 12px; border-radius:8px;">Ask</button>',
      '    </div>',
      '  </div>',
      '  <div class="dropdown-options">',
      '    <a href="#" class="ai-option" data-ai="virima"><div><strong>Ask questions</strong><span>About using our products and solutions</span></div></a>',
      '    <a href="#" class="ai-option" data-ai="troubleshoot"><div><strong>Find troubleshooting guidance</strong><span>Get help with common issues</span></div></a>',
      '    <a href="#" class="ai-option" data-ai="features"><div><strong>Learn about new features</strong><span>Discover enhancements and fixes</span></div></a>',
      '  </div>',
      '</div>',
      '<div class="chat-panel" id="chatPanel">',
      '  <div class="chat-header">',
      '    <h3>Ask Virima</h3>',
      '    <button class="chat-close" id="chatClose" aria-label="Close">&times;</button>',
      '  </div>',
      '  <div class="chat-messages" id="chatMessages">',
      '    <div class="chat-message assistant">',
      '      <div class="message-avatar">V</div>',
      '      <div class="message-content"><p>Hello! I\'m your Virima documentation assistant. Ask me anything about Virima products, features, or how to accomplish specific tasks.</p></div>',
      '    </div>',
      '  </div>',
      '  <div class="chat-input">',
      '    <input type="text" id="chatInput" placeholder="Ask about Virima..." autocomplete="off">',
      '    <button id="chatSend" aria-label="Send">',
      '      <span style="font-weight:700;">➤</span>',
      '    </button>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(host);

    const container = host;
    const askBtn = container.querySelector('#askVirimaButton');
    const dropdown = container.querySelector('#askVirimaDropdown');
    const goBtn = container.querySelector('#askVirimaGo');
    const searchInput = container.querySelector('#askVirimaSearch');
    const chatPanel = container.querySelector('#chatPanel');
    const chatClose = container.querySelector('#chatClose');
    const chatInput = container.querySelector('#chatInput');
    const chatSend = container.querySelector('#chatSend');
    const chatMessages = container.querySelector('#chatMessages');

    function openDropdown() {
      container.classList.toggle('active');
    }
    function openChatWith(text) {
      container.classList.remove('active');
      chatPanel.classList.add('active');
      if (text) {
        chatInput.value = text;
        sendMessage();
      } else {
        chatInput.focus();
      }
    }
    function closeChat() {
      chatPanel.classList.remove('active');
    }

    function addMessage(text, role) {
      const messageEl = document.createElement('div');
      messageEl.className = 'chat-message ' + role;
      if (role === 'assistant') {
        messageEl.innerHTML = '<div class="message-avatar">V</div><div class="message-content"><p>' + escapeHtml(text) + '</p></div>';
      } else {
        messageEl.innerHTML = '<div class="message-content" style="background:#0066CC;color:#fff;margin-left:auto;max-width:80%"><p style="color:#fff;margin:0;">' + escapeHtml(text) + '</p></div>';
      }
      chatMessages.appendChild(messageEl);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(str){
      const div=document.createElement('div');
      div.textContent=str; return div.innerHTML;
    }

    async function sendMessage(){
      const text = chatInput.value.trim();
      if(!text) return;
      addMessage(text, 'user');
      chatInput.value='';
      // Try MCP first if configured
      let answer = await sendToMcp(text);
      if(!answer) answer = getFallbackResponse(text);
      addMessage(answer, 'assistant');
    }

    // Wire events
    askBtn.addEventListener('click', (e)=>{ e.stopPropagation(); openDropdown(); });
    document.addEventListener('click', (e)=>{ if(!container.contains(e.target)){ container.classList.remove('active'); }});
    goBtn.addEventListener('click', (e)=>{ e.preventDefault(); openChatWith(searchInput.value.trim()); });
    searchInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); openChatWith(searchInput.value.trim()); }});
    chatClose.addEventListener('click', closeChat);
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); }});
  }

  onReady(buildWidget);
  console.log('Virima custom JS loaded');
})();


