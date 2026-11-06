/**
 * Cestou — protótipo de avaliação (JavaScript temporário escrito com IA).
 * Quando o MVP for aprovado, este módulo será removido para o aluno
 * implementar a lógica. Não confundir com autoria da versão educacional final.
 */
const KEY = "cestou.mvp.v1";
const $ = (s, root=document) => root.querySelector(s);
const money = value => Number(value).toLocaleString("pt-BR", {style:"currency", currency:"BRL"});
const id = () => globalThis.crypto?.randomUUID?.() || \`id-\${Date.now()}-\${Math.random().toString(36).slice(2)}\`;
const escapeHtml = text => String(text??"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dateText = iso => new Date(iso).toLocaleDateString("pt-BR", {day:"2-digit", month:"short", year:"numeric"});
function demo(){
  const a=id(), b=id(), c=id(), p=id();
  const items=[
    ["Arroz branco 5kg",1,"un",[24.9,26.5,25.7]],
    ["Feijão carioca 1kg",2,"un",[7.99,7.5,8.35]],
    ["Leite integral 1L",6,"un",[4.89,4.69,5.09]],
    ["Café 500g",2,"un",[21.9,22.5,20.99]],
    ["Óleo de soja 900ml",2,"un",[7.49,7.89,7.29]],
    ["Açúcar 1kg",3,"un",[4.39,4.19,4.59]],
    ["Banana prata",1.5,"kg",[5.99,6.49,5.79]],
  ].map(([name,qty,unit,prices])=>({id:id(),name,qty,unit,done:false,prices:Object.fromEntries([a,b,c].map((key,i)=>[key,prices[i]]))}));
  return {markets:[{id:a,name:"Supermercado Central"},{id:b,name:"Mercado Economia"},{id:c,name:"Bom Preço"}],
    purchases:[{id:p,name:"Compras da semana",createdAt:new Date().toISOString(),status:"draft",markets:[a,b,c],items}],active:p};
}
function load(){
  try{const data=JSON.parse(localStorage.getItem(KEY));if(data&&Array.isArray(data.markets)&&Array.isArray(data.purchases))return data;}catch{}
  return demo();
}
let state=load();
let route=location.hash.slice(1)||"inicio";
const app=$("#app");
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{toast("Não foi possível salvar. Verifique o armazenamento do navegador.");}}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),3200);}
function marketName(key){return state.markets.find(m=>m.id===key)?.name||"Mercado removido";}
function purchase(key){return state.purchases.find(p=>p.id===key);}
function status(p){return p.status==="finished"?"Finalizada":"Rascunho";}
function countDone(p){return p.items.filter(i=>i.done).length;}
function minChoice(item,p){
  const offers=p.markets.map(mid=>({mid,price:item.prices?.[mid]})).filter(x=>typeof x.price==="number"&&Number.isFinite(x.price)&&x.price>=0);
  if(!offers.length)return null;
  offers.sort((a,b)=>a.price-b.price||p.markets.indexOf(a.mid)-p.markets.indexOf(b.mid));
  return offers[0];
}
function stats(p){
 const assigned=p.items.map(item=>({item,choice:minChoice(item,p)}));
 const covered=assigned.filter(x=>x.choice).length;
 const total=assigned.reduce((sum,x)=>sum+(x.choice?x.choice.price*x.item.qty:0),0);
 const savings=assigned.reduce((sum,{item,choice})=>{
  if(!choice)return sum;
  const prices=p.markets.map(mid=>item.prices?.[mid]).filter(x=>typeof x==="number"&&Number.isFinite(x)&&x>=0);
  return sum+(Math.max(...prices)-choice.price)*item.qty;
 },0);
 return {assigned,covered,total,savings};
}
function pageHead(label,title,description,action=""){return \`<div class="page-head"><div><span class="eyebrow">\${escapeHtml(label)}</span><h1>\${escapeHtml(title)}</h1><p>\${escapeHtml(description)}</p></div>\${action}</div>\`;}
function purchaseCard(p){
 const info=stats(p),percent=p.items.length?Math.round(info.covered/p.items.length*100):0;
 return \`<article class="card list-card"><div class="icon-box">▤</div><div class="details"><div class="card-head"><strong class="card-title">\${escapeHtml(p.name)}</strong><span class="pill \${p.status==="finished"?"pill-green":"pill-yellow"}">\${status(p)}</span></div><p class="meta">\${p.items.length} produtos · \${p.markets.length} mercados · \${dateText(p.createdAt)}</p><div class="progress" title="\${percent}% com preço"><span style="width:\${percent}%"></span></div><p class="meta">\${info.covered} de \${p.items.length} produtos com preço</p></div><div class="actions"><a class="btn btn-primary btn-sm" href="#compra/\${p.id}">Abrir compra →</a><button class="btn btn-sm" data-action="rename-purchase" data-id="\${p.id}">Renomear</button><button class="btn btn-danger btn-sm" data-action="delete-purchase" data-id="\${p.id}">Excluir</button></div></article>\`;
}
function home(){
 const done=state.purchases.filter(p=>p.status==="finished");
 const allSavings=done.reduce((sum,p)=>sum+stats(p).savings,0);
 const latest=state.purchases.slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,3);
 app.innerHTML=\`<section class="hero"><div class="hero-content"><span class="eyebrow">Organize melhor. Gaste menos.</span><h1>Seu mercado, do seu jeito.</h1><p>Monte sua lista, compare os preços de até quatro mercados e descubra onde vale mais a pena comprar cada produto.</p><button class="btn btn-light" data-action="new-purchase">+ Nova lista de compras</button></div><div class="hero-art" aria-hidden="true">🛍️</div></section>
 <section class="section grid grid-3"><div class="card stat"><div><span class="meta">Compras criadas</span><strong class="num">\${state.purchases.length}</strong><small>Organize tudo por lista</small></div><div class="stat-icon">▤</div></div><div class="card stat"><div><span class="meta">Mercados cadastrados</span><strong class="num">\${state.markets.length}</strong><small>Compare até quatro por lista</small></div><div class="stat-icon">▣</div></div><div class="card stat"><div><span class="meta">Economia potencial</span><strong class="num money">\${money(allSavings)}</strong><small>Nas compras finalizadas*</small></div><div class="stat-icon">↘</div></div></section>
 <section class="section"><div class="section-head"><h2>Suas compras recentes</h2><a href="#compras" class="btn btn-sm">Ver todas →</a></div><div class="cards-list">\${latest.length?latest.map(purchaseCard).join(""):empty("Nenhuma compra ainda","Crie sua primeira lista para começar.")}</div></section>
 <section class="section grid grid-2"><article class="card"><h2>Como o Cestou funciona?</h2><p class="meta">1. Cadastre seus mercados favoritos.<br>2. Crie uma lista e escolha até quatro mercados.<br>3. Insira os produtos, quantidades e preços.<br>4. Compare e finalize para gerar listas por mercado.</p><a href="#mercados" class="btn btn-sm">Gerenciar mercados →</a></article><article class="card"><h2>Experimente sem compromisso</h2><p class="meta">O aplicativo já vem com exemplos fictícios, salvos localmente. Você pode reiniciar os dados para reavaliar a experiência.</p><button class="btn btn-sm" data-action="reset-demo">Restaurar demonstração</button><p class="hint" style="margin-top:12px">*Economia estimada: diferença para o maior preço informado de cada item, não garantia de economia real.</p></article></section>\`;
}
function empty(title,subtitle){return \`<div class="empty"><div class="emoji">🧺</div><h3>\${escapeHtml(title)}</h3><p>\${escapeHtml(subtitle)}</p></div>\`;}
function purchases(){
 app.innerHTML=pageHead("Organização","Minhas compras","Crie listas, compare mercados e acompanhe o que já foi finalizado.",'<button class="btn btn-primary" data-action="new-purchase">+ Nova compra</button>')+
 \`<div class="cards-list">\${state.purchases.length?state.purchases.slice().reverse().map(purchaseCard).join(""):empty("Sua lista está vazia","Clique em Nova compra para começar.")}</div>\`;
}
function markets(){
 const usage=id=>state.purchases.filter(p=>p.markets.includes(id)).length;
 app.innerHTML=pageHead("Seus favoritos","Meus mercados","Cadastre os locais que você costuma visitar. Não há limite de mercados cadastrados.")+
 \`<div class="grid grid-2"><section class="card"><h2>Adicionar mercado</h2><form class="form" id="market-form"><div class="field"><label for="market-name">Nome do mercado</label><input id="market-name" name="name" maxlength="60" autocomplete="off" placeholder="Ex.: Mercado do Bairro" required></div><button class="btn btn-primary" type="submit">+ Adicionar mercado</button></form></section>
 <section class="card"><div class="section-head"><h2>Mercados cadastrados</h2><span class="pill pill-green">\${state.markets.length} mercados</span></div><div class="cards-list">\${state.markets.length?state.markets.map(m=>\`<div class="market-row"><div><span class="icon-box">▣</span><div><strong class="card-title">\${escapeHtml(m.name)}</strong><div class="usage">Em \${usage(m.id)} compras</div></div></div><div class="actions"><button class="btn btn-sm" data-action="rename-market" data-id="\${m.id}">Editar</button><button class="btn btn-danger btn-sm" data-action="delete-market" data-id="\${m.id}">Excluir</button></div></div>\`).join(""):empty("Nenhum mercado","Cadastre um mercado ao lado.")}</div></section></div>\`;
}
function itemTable(p){
 const bests=p.items.map(item=>minChoice(item,p));
 return \`<div class="table-scroller"><table class="price-table"><thead><tr><th>Produto</th>\${p.markets.map(mid=>\`<th>\${escapeHtml(marketName(mid))}</th>\`).join("")}<th>Ações</th></tr></thead><tbody>\${p.items.map((item,idx)=>\`<tr><td><div class="product-name">\${escapeHtml(item.name)}</div><span class="qty">\${item.qty.toLocaleString("pt-BR")} \${escapeHtml(item.unit)}</span></td>\${p.markets.map(mid=>{let value=item.prices?.[mid];let isBest=bests[idx]?.mid===mid;return \`<td class="\${isBest?"best-cell":""}"><input class="price-input \${isBest?"best":""}" type="number" min="0" step="0.01" inputmode="decimal" aria-label="Preço de \${escapeHtml(item.name)} no \${escapeHtml(marketName(mid))}" value="\${typeof value==="number"?value:""}" placeholder="R$ —" data-price-item="\${item.id}" data-price-market="\${mid}" \${p.status==="finished"?"disabled":""}></td>\`}).join("")}<td><div class="actions"><button class="btn btn-sm" data-action="edit-item" data-id="\${item.id}" \${p.status==="finished"?"disabled":""}>Editar</button><button class="btn btn-danger btn-sm" data-action="delete-item" data-id="\${item.id}" \${p.status==="finished"?"disabled":""}>×</button></div></td></tr>\`).join("")}</tbody></table></div>\`;
}
function purchaseView(p){
 const summary=stats(p),finished=p.status==="finished",ready=p.items.length>0&&summary.covered===p.items.length&&p.markets.length>0;
 const grouped=new Map(p.markets.map(mid=>[mid,[]]));
 for(const {item,choice} of summary.assigned)if(choice)grouped.get(choice.mid).push(item);
 const marketsSelected=state.markets.map(m=>\`<label class="market-option"><input type="checkbox" data-market-toggle="\${m.id}" \${p.markets.includes(m.id)?"checked":""} \${finished||(!p.markets.includes(m.id)&&p.markets.length>=4)?"disabled":""}>\${escapeHtml(m.name)}</label>\`).join("");
 app.innerHTML=\`<a href="#compras" class="backlink">← Voltar para compras</a>\`+
 pageHead("Sua lista",p.name, \`Criada em \${dateText(p.createdAt)} · \${p.items.length} produtos\`, \`<span class="pill \${finished?"pill-green":"pill-yellow"}">\${status(p)}</span>\`)+
 \`<section class="grid grid-3"><div class="card stat"><div><span class="meta">Melhor total conhecido</span><strong class="num money">\${money(summary.total)}</strong><small>\${summary.covered}/\${p.items.length} itens cotados</small></div><div class="stat-icon">▤</div></div><div class="card stat"><div><span class="meta">Economia potencial</span><strong class="num money">\${money(summary.savings)}</strong><small>Comparado aos maiores preços</small></div><div class="stat-icon">↘</div></div><div class="card stat"><div><span class="meta">Mercados selecionados</span><strong class="num">\${p.markets.length}/4</strong><small>Você escolhe os participantes</small></div><div class="stat-icon">▣</div></div></section>
 <section class="section card"><div class="section-head"><div><h2>1. Mercados desta compra</h2><p class="subhead">Selecione até quatro. Os dados são de demonstração e os preços são informados manualmente.</p></div></div><div class="market-selector">\${marketsSelected||'<p class="meta">Nenhum mercado cadastrado.</p>'}</div>\${!state.markets.length?'<p><a class="btn btn-sm" href="#mercados">Cadastrar mercado</a></p>':""}</section>
 <section class="section card"><div class="section-head"><div><h2>2. Produtos e preços</h2><p class="subhead">Preencha o valor unitário em cada mercado. O menor preço de cada item aparece em verde.</p></div>\${finished?"":'<button class="btn btn-primary btn-sm" data-action="add-item">+ Adicionar produto</button>'}</div>\${p.items.length&&p.markets.length?itemTable(p):empty("Falta um passo","Selecione um mercado e adicione um produto para comparar.")}\${p.items.length&&!p.markets.length?'<p class="hint">Selecione um mercado acima para informar os preços.</p>':""}</section>
 <section class="section card"><div class="section-head"><div><h2>3. Resultado por mercado</h2><p class="subhead">Cada produto vai para o mercado com menor valor informado. Em caso de empate, vale a ordem dos mercados selecionados.</p></div></div><div class="comparison">\${[...grouped].map(([mid,items])=>\`<div class="card" style="box-shadow:none"><div class="card-head"><strong class="card-title">\${escapeHtml(marketName(mid))}</strong><span class="pill pill-green">\${items.length} itens</span></div>\${items.length?\`<ul>\${items.map(i=>\`<li>\${escapeHtml(i.name)} <span class="meta">(\${i.qty.toLocaleString("pt-BR")} \${escapeHtml(i.unit)})</span> <strong class="money">\${money(i.prices[mid]*i.qty)}</strong></li>\`).join("")}</ul><strong>Total: \${money(items.reduce((s,i)=>s+i.prices[mid]*i.qty,0))}</strong>\`:'<p class="meta">Nenhum produto com menor preço aqui.</p>'}</div>\`).join("")}</div>\${!summary.covered?'<p class="hint">Informe pelo menos um preço por produto para obter uma distribuição.</p>':""}</section>
 <section class="section card"><div class="compare-summary"><div><h2 style="margin-bottom:6px">4. Finalizar e conferir</h2><p class="meta">A finalização mantém esta compra no histórico. Você pode voltar para rascunho e ajustar os preços, sem duplicá-la.</p></div><div class="actions"><button class="btn" data-action="copy-list" \${!summary.covered?"disabled":""}>Copiar listas</button>\${finished?\`<button class="btn btn-primary" data-action="reopen">Voltar para rascunho</button>\`:\`<button class="btn btn-primary" data-action="finish" \${!ready?"disabled":""}>✓ Finalizar compra</button>\`}</div></div>\${!finished&&!ready?'<p class="hint">Para finalizar: adicione itens e preencha pelo menos um preço de cada item.</p>':""}\${finished?'<div class="notice" style="margin-top:15px">✓ Compra finalizada! Marque os itens comprados abaixo ou retorne ao rascunho para editar.</div>':""}</section>
 \${finished?\`<section class="section card"><h2>Checklist de compras</h2><div class="item-rows">\${summary.assigned.filter(x=>x.choice).map(({item,choice})=>\`<label class="item-row checkline"><input type="checkbox" data-done-item="\${item.id}" \${item.done?"checked":""}><div class="details \${item.done?"completed":""}"><strong>\${escapeHtml(item.name)}</strong><div class="meta">\${item.qty.toLocaleString("pt-BR")} \${escapeHtml(item.unit)} · \${escapeHtml(marketName(choice.mid))}</div></div><strong class="money">\${money(choice.price*item.qty)}</strong></label>\`).join("")}</div><p class="meta" style="margin-top:12px">\${countDone(p)} de \${p.items.length} itens comprados</p></section>\`:""}\`;
}
function render(){
 route=decodeURIComponent(location.hash.slice(1)||"inicio");
 const [page,key]=route.split("/");
 document.querySelectorAll("[data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav===(page==="compra"?"compras":page)));
 if(page==="inicio")home();else if(page==="compras")purchases();else if(page==="mercados")markets();else if(page==="compra"&&purchase(key))purchaseView(purchase(key));else{location.hash="inicio";home();}
}
function modal(title,body,submit,confirmLabel="Salvar"){
 $("#modal-root").innerHTML=\`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div class="modal-head"><h2 id="dialog-title">\${escapeHtml(title)}</h2><button class="btn btn-sm" data-action="close-modal" aria-label="Fechar">✕</button></div><form class="form" id="modal-form">\${body}<div class="actions"><button type="button" class="btn" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit">\${escapeHtml(confirmLabel)}</button></div></form></section></div>\`;
 modal.submit=submit;$("#modal-root input")?.focus();
}
function closeModal(){$("#modal-root").innerHTML="";}
function newPurchase(){modal("Nova lista de compras",'<div class="field"><label for="new-name">Nome da lista</label><input id="new-name" name="name" maxlength="70" placeholder="Ex.: Compras do mês" required></div><p class="hint">Depois você poderá selecionar mercados e adicionar produtos.</p>',form=>{
 const name=form.elements.name.value.trim();if(!name)return;
 const p={id:id(),name,createdAt:new Date().toISOString(),status:"draft",markets:state.markets.slice(0,Math.min(3,state.markets.length)).map(m=>m.id),items:[]};
 state.purchases.push(p);persist();closeModal();location.hash="compra/"+p.id;render();toast("Lista criada!");
 },"Criar lista");}
function editItem(itemId){
 const p=purchase(route.split("/")[1]);if(!p||p.status==="finished")return;
 const item=p.items.find(i=>i.id===itemId);
 modal(item?"Editar produto":"Adicionar produto",
 \`<div class="field"><label for="item-name">Produto</label><input id="item-name" name="name" maxlength="90" placeholder="Ex.: Arroz 5kg" value="\${escapeHtml(item?.name||"")}" required></div><div class="grid grid-2"><div class="field"><label for="item-qty">Quantidade</label><input id="item-qty" name="qty" type="number" min="0.01" step="any" value="\${item?.qty||1}" required></div><div class="field"><label for="item-unit">Unidade</label><select id="item-unit" name="unit">\${["un","kg","g","L","ml","pacote"].map(u=>\`<option value="\${u}" \${item?.unit===u?"selected":""}>\${u}</option>\`).join("")}</select></div></div>\`,
 form=>{const name=form.elements.name.value.trim(),qty=Number(form.elements.qty.value),unit=form.elements.unit.value;
 if(!name||!Number.isFinite(qty)||qty<=0){toast("Informe nome e quantidade válida.");return;}
 if(item){item.name=name;item.qty=qty;item.unit=unit;}else p.items.push({id:id(),name,qty,unit,done:false,prices:{}});
 persist();closeModal();render();toast(item?"Produto atualizado.":"Produto adicionado.");},item?"Salvar mudanças":"Adicionar");
}
function confirmAction(title,description,yes){
 modal(title,\`<p class="meta">\${escapeHtml(description)}</p>\`,()=>{yes();closeModal();render();},"Confirmar");
}
function renameEntry(type,entryId){
 const entry=type==="market"?state.markets.find(x=>x.id===entryId):purchase(entryId);
 if(!entry)return;modal("Renomear "+(type==="market"?"mercado":"compra"),\`<div class="field"><label for="entry-name">Nome</label><input name="name" id="entry-name" maxlength="70" value="\${escapeHtml(entry.name)}" required></div>\`,f=>{const name=f.elements.name.value.trim();if(!name)return;
 if(type==="market"&&state.markets.some(m=>m.id!==entryId&&m.name.toLocaleLowerCase("pt-BR")===name.toLocaleLowerCase("pt-BR"))){toast("Já existe mercado com esse nome.");return;}
 entry.name=name;persist();closeModal();render();toast("Nome atualizado.");});
}
async function copyList(p){
 const {assigned,total}=stats(p);
 const lines=[\`CESTOU — \${p.name}\`,...p.markets.flatMap(mid=>{const rows=assigned.filter(x=>x.choice?.mid===mid);return rows.length?["",marketName(mid),...rows.map(({item,choice})=>\`• \${item.qty} \${item.unit} \${item.name}: \${money(choice.price*item.qty)}\`)]:[]}),"",\`Total estimado: \${money(total)}\`].join("\n");
 try{await navigator.clipboard.writeText(lines);toast("Listas copiadas!");}catch{modal("Copiar lista",\`<p class="hint">Selecione e copie o texto abaixo:</p><div class="field"><textarea rows="12" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:10px">\${escapeHtml(lines)}</textarea></div>\`,()=>closeModal(),"Fechar");}
}
document.addEventListener("submit",event=>{
 if(event.target.id==="market-form"){event.preventDefault();const name=event.target.elements.name.value.trim();if(!name)return;
 if(state.markets.some(m=>m.name.toLocaleLowerCase("pt-BR")===name.toLocaleLowerCase("pt-BR"))){toast("Esse mercado já está cadastrado.");return;}
 state.markets.push({id:id(),name});persist();render();toast("Mercado cadastrado.");}
 if(event.target.id==="modal-form"){event.preventDefault();modal.submit?.(event.target);}
});
document.addEventListener("click",event=>{
 if(event.target.classList.contains("modal-backdrop")){closeModal();return;}
 const button=event.target.closest("[data-action]");if(!button)return;
 const action=button.dataset.action,key=button.dataset.id,p=purchase(route.split("/")[1]);
 if(action==="close-modal")closeModal();
 if(action==="new-purchase")newPurchase();
 if(action==="add-item")editItem(null);
 if(action==="edit-item")editItem(key);
 if(action==="rename-market")renameEntry("market",key);
 if(action==="rename-purchase")renameEntry("purchase",key);
 if(action==="delete-market"){
  const entry=state.markets.find(m=>m.id===key);if(!entry)return;
  if(state.purchases.some(p=>p.markets.includes(key))){toast("Este mercado está em uso. Retire-o das compras antes de excluir.");return;}
  confirmAction("Excluir mercado",\`Excluir definitivamente \${entry.name}?\`,()=>{state.markets=state.markets.filter(m=>m.id!==key);persist();toast("Mercado excluído.");});
 }
 if(action==="delete-purchase"){const target=purchase(key);if(!target)return;confirmAction("Excluir compra",\`Excluir a lista “\${target.name}” e seus preços? Essa ação não pode ser desfeita.\`,()=>{state.purchases=state.purchases.filter(p=>p.id!==key);persist();toast("Compra excluída.");});}
 if(action==="delete-item"&&p&&p.status==="draft"){const item=p.items.find(i=>i.id===key);if(!item)return;confirmAction("Excluir produto",\`Excluir “\${item.name}” desta lista?\`,()=>{p.items=p.items.filter(i=>i.id!==key);persist();toast("Produto excluído.");});}
 if(action==="finish"&&p&&p.status==="draft"){const s=stats(p);if(!p.items.length||s.covered!==p.items.length||!p.markets.length)return toast("Preencha um preço de cada produto.");p.status="finished";persist();render();toast("Compra finalizada!");}
 if(action==="reopen"&&p&&p.status==="finished"){p.status="draft";persist();render();toast("Compra retornou ao rascunho.");}
 if(action==="copy-list"&&p)copyList(p);
 if(action==="reset-demo")confirmAction("Restaurar demonstração","Isso substituirá TODOS os mercados e compras deste navegador por dados fictícios. Deseja continuar?",()=>{state=demo();persist();location.hash="inicio";toast("Dados de demonstração restaurados.");});
});
document.addEventListener("change",event=>{
 const field=event.target,p=purchase(route.split("/")[1]);if(!p)return;
 if(field.matches("[data-market-toggle]")&&p.status==="draft"){
  const mid=field.dataset.marketToggle;
  if(field.checked){if(p.markets.length>=4){field.checked=false;toast("Máximo de quatro mercados.");return;}p.markets.push(mid);}
  else p.markets=p.markets.filter(x=>x!==mid);
  persist();render();
 }
 if(field.matches("[data-price-item]")&&p.status==="draft"){
  const item=p.items.find(i=>i.id===field.dataset.priceItem),mid=field.dataset.priceMarket;if(!item)return;
  const raw=field.value.trim();
  if(raw==="")delete item.prices[mid];
  else {const value=Number(raw);if(!Number.isFinite(value)||value<0){toast("Informe um preço válido.");render();return;}item.prices[mid]=Math.round(value*100)/100;}
  persist();render();
 }
 if(field.matches("[data-done-item]")&&p.status==="finished"){
  const item=p.items.find(i=>i.id===field.dataset.doneItem);if(!item)return;item.done=field.checked;persist();render();
 }
});
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeModal();});
window.addEventListener("hashchange",render);
persist();render();
