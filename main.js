(function(){
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function injectStyles(){
    if (document.getElementById('virima-inline-styles')) return;
    const css = `
      /* Global typography */
      :root { --virima-font: 'AvenirLTStd', 'Avenir', 'Helvetica Neue', Arial, sans-serif; }
      body, html, .mintlify, .mintlify * { font-family: var(--virima-font) !important; font-size: 16px; }
      h1 { font-family: var(--virima-font) !important; font-weight: 700 !important; font-size: 28px !important; }
      h2 { font-family: var(--virima-font) !important; font-weight: 700 !important; font-size: 24px !important; }
      h3 { font-family: var(--virima-font) !important; font-weight: 800 !important; font-size: 32px !important; }
      h4 { font-family: var(--virima-font) !important; font-weight: 700 !important; font-size: 22px !important; }
      h5 { font-family: var(--virima-font) !important; font-weight: 700 !important; font-size: 20px !important; }
      h6 { font-family: var(--virima-font) !important; font-weight: 700 !important; font-size: 18px !important; }
      .ask-virima-container{position:fixed;right:24px;bottom:24px;z-index:2147483645}
      .ask-virima-button{background:#00A651;color:#fff;padding:12px 16px;border-radius:10px;font-weight:700;border:0;cursor:pointer;box-shadow:0 6px 16px rgba(0,166,81,.3)}
      .ask-virima-button:hover{background:#008A44}
      .ask-virima-dropdown{position:absolute;right:0;bottom:60px;background:#fff;border-radius:16px;box-shadow:0 12px 28px rgba(0,0,0,.18);width:420px;display:none;overflow:hidden}
      .ask-virima-dropdown .dropdown-header{padding:20px 24px;border-bottom:1px solid #e2e8f0;text-align:center}
      .ask-virima-dropdown .dropdown-header h3{font-size:28px;font-weight:800;margin:0 0 6px}
      .ask-virima-dropdown .dropdown-header p{margin:0;color:#475569}
      .ask-virima-dropdown .ask-search-row{margin-top:14px}
      .ask-virima-dropdown .ask-search-row input{flex:1;border:1px solid #e2e8f0;border-radius:10px}
      .ask-virima-dropdown .ask-search-row button{background:#00A651;color:#fff;border-radius:10px}
      .ask-virima-dropdown .dropdown-options{padding:12px 16px}
      .ask-virima-dropdown .ai-option{display:block;padding:12px;border-radius:10px;color:#0f172a;text-decoration:none}
      .ask-virima-dropdown .ai-option div{display:block}
      .ask-virima-dropdown .ai-option strong{display:block;margin:0 0 4px;font-weight:700}
      .ask-virima-dropdown .ai-option span{display:block;color:#64748b;font-size:14px;line-height:1.5}
      .ask-virima-dropdown .ai-option:hover{background:#f8fafc}
      .ask-list{padding:16px 24px;display:flex;flex-direction:column;gap:16px}
      .ask-item{display:flex;gap:12px;align-items:flex-start}
      .ask-item .icon{width:28px;height:28px;border-radius:50%;background:#ecfeff;color:#0f172a;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
      .ask-item .text .title{font-weight:700;margin:0 0 4px}
      .ask-item .text .desc{margin:0;color:#64748b}
      .ask-powered{border-top:1px solid #e2e8f0;padding:14px 24px;font-size:12px;color:#64748b;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap}
      .chat-panel{position:fixed;right:24px;bottom:96px;width:400px;height:600px;background:#fff;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.15);display:none;flex-direction:column;overflow:hidden;z-index:2147483646}
      .chat-panel .chat-header{background:#00A651;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between}
      .chat-panel .chat-messages{flex:1;overflow:auto;padding:16px;background:#f8fafc;display:flex;flex-direction:column;gap:12px}
      .chat-panel .chat-input{display:flex;gap:8px;padding:12px;border-top:1px solid #e2e8f0}
      .chat-panel .chat-input input{flex:1;border:2px solid #e2e8f0;border-radius:10px;padding:10px}
      .chat-panel .chat-input button{background:#00A651;color:#fff;border-radius:10px;width:44px}
      .chat-message{display:flex;gap:10px}
      .chat-message .message-avatar{width:32px;height:32px;border-radius:50%;background:#00A651;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
      .chat-message .message-content{background:#fff;padding:10px 12px;border-radius:10px;box-shadow:0 1px 2px rgba(0,0,0,.08)}
      .virima-search-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:2147483644;display:none;align-items:flex-start;justify-content:center;padding-top:80px}
      .virima-search-overlay.active{display:flex}
      .virima-search-container{background:#fff;border-radius:12px;box-shadow:0 20px 40px rgba(0,0,0,.25);width:90%;max-width:720px;max-height:80vh;display:flex;flex-direction:column;overflow:hidden}
      .virima-search-header{display:flex;align-items:center;gap:12px;padding:16px;border-bottom:1px solid #e2e8f0}
      .virima-search-input{flex:1;border:none;outline:none;font-size:16px}
      .virima-search-close{font-size:28px;background:transparent;color:#64748b;border-radius:8px;width:36px;height:36px}
      .virima-search-scope{display:flex;gap:16px;padding:12px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0}
      .virima-search-results{flex:1;overflow:auto;padding:16px}
      /* Version menu */
      .virima-version-menu{position:fixed;top:12px;right:24px;z-index:2147483643}
      .virima-version-toggle{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border:1.5px solid #94a3b8;border-radius:10px;background:#fff;font-weight:700;box-shadow:0 1px 3px rgba(0,0,0,.08);cursor:pointer;font-family:var(--virima-font);font-size:16px}
      .virima-version-panel{position:absolute;top:44px;right:0;background:#fff;border:1.5px solid #cbd5e1;border-radius:12px;box-shadow:0 6px 16px rgba(0,0,0,.14);width:260px;padding:8px;display:none}
      .virima-version-item{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px;border-radius:10px;cursor:pointer;font-family:var(--virima-font);font-size:16px}
      .virima-version-item:hover{background:#f8fafc}
    `;
    const style = document.createElement('style');
    style.id = 'virima-inline-styles';
    style.textContent = css;
    document.head.appendChild(style);
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
      '  <div class="ask-list">',
      '    <div class="ask-item"><div class="icon">⏱</div><div class="text"><div class="title">Ask questions</div><div class="desc">About using our products and solutions</div></div></div>',
      '    <div class="ask-item"><div class="icon">☑</div><div class="text"><div class="title">Find troubleshooting guidance</div><div class="desc">Get help with common issues</div></div></div>',
      '    <div class="ask-item"><div class="icon">⬤</div><div class="text"><div class="title">Learn about new features</div><div class="desc">Discover enhancements and fixes</div></div></div>',
      '  </div>',
      '  <div class="ask-powered">',
      '    <span>POWERED BY</span>',
      '    <label><input type="radio" name="virimaAgentSel" value="chatgpt"> ChatGPT</label>',
      '    <span>|</span>',
      '    <label><input type="radio" name="virimaAgentSel" value="claude"> Claude</label>',
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

    // Styles injected globally, keep JS clean

    // Initialize agent selection (persisted)
    const persisted = localStorage.getItem('virima-agent');
    const defaultAgent = getMcpEndpoint() ? 'mcp' : (getChatGptEndpoint() ? 'chatgpt' : (getClaudeEndpoint() ? 'claude' : 'mcp'));
    agentSelect.value = persisted || defaultAgent;
    agentSelect.addEventListener('change', ()=>{
      localStorage.setItem('virima-agent', agentSelect.value);
    });

    // Sync with radio buttons in dropdown footer
    const radios = container.querySelectorAll('input[name="virimaAgentSel"]');
    radios.forEach(r=>{
      r.checked = (r.value === (persisted || defaultAgent));
      r.addEventListener('change', ()=>{
        if(r.checked){ agentSelect.value = r.value; localStorage.setItem('virima-agent', r.value); }
      });
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
    overlay.className = 'virima-search-overlay';
    overlay.id = 'virimaSearchOverlay';
    overlay.innerHTML = [
      '<div class="virima-search-container">',
      '  <div class="virima-search-header">',
      '    <input type="search" id="virimaMainSearch" placeholder="Search within documentation" class="virima-search-input" />',
      '    <button class="virima-search-close" id="virimaSearchClose" aria-label="Close">&times;</button>',
      '  </div>',
      '  <div class="virima-search-scope">',
      '    <label class="scope-option"><input type="radio" name="virimaScope" value="page" checked> <span>Search this page</span></label>',
      '    <label class="scope-option"><input type="radio" name="virimaScope" value="all"> <span>Search all docs</span></label>',
      '  </div>',
      '  <div class="virima-search-results" id="virimaSearchResults"></div>',
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

  function buildVersionMenu(){
    const container = document.createElement('div');
    container.className = 'virima-version-menu';
    container.innerHTML = [
      '<button class="virima-version-toggle" id="virimaVerToggle">',
      '  <span>Select version</span>',
      '  <span style="font-size:12px">▾</span>',
      '</button>',
      '<div class="virima-version-panel" id="virimaVerPanel">',
      '  <div class="virima-version-item" data-href="/v6.1/">',
      '    <span>6.1 (Latest)</span>',
      '    <span>›</span>',
      '  </div>',
      '</div>'
    ].join('');
    document.body.appendChild(container);
    const toggle = container.querySelector('#virimaVerToggle');
    const panel = container.querySelector('#virimaVerPanel');
    toggle.addEventListener('click', ()=>{ panel.style.display = (panel.style.display==='block')?'none':'block'; });
    document.addEventListener('click', (e)=>{ if(!container.contains(e.target)) panel.style.display='none'; });
    container.querySelectorAll('.virima-version-item').forEach(item=>{
      item.addEventListener('click', ()=>{
        const href = item.getAttribute('data-href');
        if(href){ window.location.href = href; }
      });
    });
  }

  onReady(function(){ injectStyles(); buildWidget(); buildSearchOverlay(); buildVersionMenu(); });
  console.log('Virima custom JS loaded');
})();


