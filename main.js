(function(){
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  // Read optional endpoints from meta tags so you can wire your own backends
  function getMeta(name){ const m=document.querySelector('meta[name="'+name+'"]'); return m&&m.content?m.content:''; }
  function getMcpEndpoint(){ return getMeta('virima:mcp-endpoint'); }
  function getChatGptEndpoint(){ return getMeta('virima:chatgpt-endpoint'); }
  function getClaudeEndpoint(){ return getMeta('virima:claude-endpoint'); }

  async function sendToEndpoint(endpoint, query) {
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

  async function sendToSelectedAgent(agent, query){
    if(agent === 'mcp') return await sendToEndpoint(getMcpEndpoint(), query);
    if(agent === 'chatgpt') return await sendToEndpoint(getChatGptEndpoint(), query);
    if(agent === 'claude') return await sendToEndpoint(getClaudeEndpoint(), query);
    return null;
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
      '  <div class="chat-header" style="display:flex;align-items:center;justify-content:space-between;gap:12px">',
      '    <h3 style="margin:0">Ask Virima</h3>',
      '    <div style="display:flex;align-items:center;gap:8px">',
      '      <label for="agentSelect" style="font-size:12px;color:#fff;opacity:.9">Agent</label>',
      '      <select id="agentSelect" style="padding:4px 8px;border-radius:6px;border:none;color:#0f172a">',
      '        <option value="mcp">Virima MCP</option>',
      '        <option value="chatgpt">ChatGPT</option>',
      '        <option value="claude">Claude</option>',
      '      </select>',
      '    </div>',
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
    const agentSelect = container.querySelector('#agentSelect');

    // Provide minimal inline styles so layout is correct even if CSS isn't loaded
    Object.assign(container.style, { position:'fixed', right:'32px', bottom:'32px', zIndex:'1000' });
    Object.assign(askBtn.style, { background:'#00A651', color:'#fff', padding:'12px 18px', borderRadius:'8px', fontWeight:'600' });
    Object.assign(dropdown.style, { display:'none', position:'absolute', right:'0', bottom:'60px', background:'#fff', borderRadius:'12px', boxShadow:'0 8px 24px rgba(0,0,0,0.15)', width:'360px' });
    Object.assign(chatPanel.style, { display:'none', position:'fixed', right:'32px', bottom:'100px', width:'380px', height:'560px', background:'#fff', borderRadius:'16px', boxShadow:'0 8px 24px rgba(0,0,0,0.15)' });

    // Initialize agent selection (persisted)
    const persisted = localStorage.getItem('virima-agent');
    const defaultAgent = getMcpEndpoint() ? 'mcp' : (getChatGptEndpoint() ? 'chatgpt' : (getClaudeEndpoint() ? 'claude' : 'mcp'));
    agentSelect.value = persisted || defaultAgent;
    agentSelect.addEventListener('change', ()=>{
      localStorage.setItem('virima-agent', agentSelect.value);
    });

    function openDropdown() { dropdown.style.display = (dropdown.style.display==='none' || dropdown.style.display==='') ? 'block' : 'none'; }
    function openChatWith(text) {
      dropdown.style.display='none';
      chatPanel.style.display='flex';
      chatPanel.style.flexDirection = 'column';
      if (text) {
        chatInput.value = text;
        sendMessage();
      } else {
        chatInput.focus();
      }
    }
    function closeChat() { chatPanel.style.display='none'; }

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
      // Route to selected agent first, then fallback
      let answer = await sendToSelectedAgent(agentSelect.value, text);
      if(!answer) answer = getFallbackResponse(text);
      addMessage(answer, 'assistant');
    }

    // Wire events
    askBtn.addEventListener('click', (e)=>{ e.stopPropagation(); openDropdown(); });
    document.addEventListener('click', (e)=>{ if(!container.contains(e.target)){ dropdown.style.display='none'; }});
    goBtn.addEventListener('click', (e)=>{ e.preventDefault(); openChatWith(searchInput.value.trim()); });
    searchInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); openChatWith(searchInput.value.trim()); }});
    chatClose.addEventListener('click', closeChat);
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); }});
  }

  // Lightweight search overlay with page/all docs toggle
  function buildSearchOverlay(){
    const overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'virimaSearchOverlay';
    overlay.innerHTML = [
      '<div class="search-container">',
      '  <div class="search-header">',
      '    <input type="search" id="virimaMainSearch" placeholder="Search within documentation" class="search-input" />',
      '    <button class="search-close" id="virimaSearchClose" aria-label="Close">&times;</button>',
      '  </div>',
      '  <div class="search-scope">',
      '    <label class="scope-option"><input type="radio" name="virimaScope" value="page" checked> <span>Search this page</span></label>',
      '    <label class="scope-option"><input type="radio" name="virimaScope" value="all"> <span>Search all docs</span></label>',
      '  </div>',
      '  <div class="search-results" id="virimaSearchResults"></div>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#virimaMainSearch');
    const closeBtn = overlay.querySelector('#virimaSearchClose');
    const results = overlay.querySelector('#virimaSearchResults');

    function open(){ overlay.classList.add('active'); setTimeout(()=>input.focus(),0); }
    function close(){ overlay.classList.remove('active'); results.innerHTML=''; input.value=''; }
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && overlay.classList.contains('active')) close(); });
    document.addEventListener('keydown', (e)=>{ if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); open(); }});

    async function buildIndex(){
      if(window.__virimaIndex) return window.__virimaIndex;
      // Try sitemap
      let urls = [];
      try{
        const sm = await fetch('/sitemap.xml');
        const xml = await sm.text();
        const locs = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(m=>m[1]).filter(u=>u.includes(window.location.origin));
        urls = locs;
      }catch(_){ urls = []; }
      // Fallback: derive from docs.json navigation
      if(urls.length===0){
        try{ const dj = await (await fetch('/docs.json')).json();
          const pages = [];
          (dj.navigation?.tabs||[]).forEach(t=> (t.groups||[]).forEach(g=> (g.pages||[]).forEach(p=> pages.push('/'+p))));
          urls = pages.map(p=> new URL(p, location.origin).href);
        }catch(_){ urls = []; }
      }
      const index = [];
      for(const u of urls){
        try{
          const res = await fetch(u);
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html,'text/html');
          const title = (doc.querySelector('h1, title')||{}).textContent||u;
          const bodyText = (doc.querySelector('main')||doc.body).textContent.replace(/\s+/g,' ').trim();
          index.push({ url: u, title, text: bodyText });
        }catch(_){ /* ignore */ }
      }
      window.__virimaIndex = index;
      return index;
    }

    function highlight(snippet, q){
      const esc = q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      return snippet.replace(new RegExp('('+esc+')','ig'), '<mark>$1</mark>');
    }

    async function perform(){
      const q = input.value.trim(); if(!q) { results.innerHTML=''; return; }
      const scope = (document.querySelector('input[name="virimaScope"]:checked')||{}).value||'page';
      if(scope==='page'){
        const text = document.querySelector('main')?.textContent || document.body.textContent;
        const matches = (text.match(new RegExp(q,'ig'))||[]).length;
        results.innerHTML = '<div style="padding:12px;background:#f0fdf4;border-left:4px solid #16a34a;border-radius:4px;margin-bottom:10px;">Found '+matches+' match'+(matches===1?'':'es')+' on this page</div>';
        return;
      }
      results.innerHTML = 'Building index...';
      const idx = await buildIndex();
      const out = [];
      for(const item of idx){
        const pos = item.text.toLowerCase().indexOf(q.toLowerCase());
        if(pos>=0){
          const start = Math.max(0, pos-80); const end = Math.min(item.text.length, pos+80);
          const snippet = highlight(item.text.slice(start, end), q);
          out.push('<div style="margin:10px 0"><a href="'+item.url+'" target="_blank" style="font-weight:700">'+item.title+'</a><div style="font-size:13px;color:#475569">... '+snippet+' ...</div></div>');
        }
      }
      results.innerHTML = out.length? out.join('') : '<div style="padding:12px;color:#6b7280">No results</div>';
    }

    input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); perform(); }});
  }

  onReady(function(){ buildWidget(); buildSearchOverlay(); });
  console.log('Virima custom JS loaded');
})();


