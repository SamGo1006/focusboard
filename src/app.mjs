import {columns,addTask,moveTask,removeTask,importBoard,exportBoard} from './board.mjs';
const key='focusboard.v1', $=id=>document.getElementById(id);
let tasks=[
  {id:'sample-1',title:'Sketch the next feature before writing code',status:'backlog',priority:'medium'},
  {id:'sample-2',title:'Write a test for an interesting edge case',status:'active',priority:'high'},
  {id:'sample-3',title:'Set up a space for focused work',status:'done',priority:'low'}
];
try { const stored=localStorage.getItem(key); if(stored) tasks=importBoard(stored); }
catch { tasks=[]; $('message').textContent='Saved data could not be loaded. Your stored copy has not been changed; export or recover it before adding tasks.'; }
function commit(next){
  localStorage.setItem(key,exportBoard(next));
  tasks=next; render(); $('message').textContent='Saved in this browser.';
}
function attempt(action){try{action();}catch(e){$('message').textContent=e.message;}}
function render(){
  const q=$('search').value.toLowerCase();
  $('complete').textContent=`${tasks.length?Math.round(tasks.filter(t=>t.status==='done').length/tasks.length*100):0}%`;
  for(const status of columns){
    const container=$(status);container.replaceChildren();
    const all=tasks.filter(t=>t.status===status);
    $(status+'-count').textContent=all.length;
    for(const task of all.filter(t=>t.title.toLowerCase().includes(q))){
      const card=document.createElement('article');card.className='card';
      const tag=document.createElement('span');tag.className=`tag ${task.priority}`;tag.textContent=task.priority+' priority';
      const title=document.createElement('h3');title.textContent=task.title;
      const actions=document.createElement('div');actions.className='card-actions';
      const select=document.createElement('select');select.setAttribute('aria-label',`Move ${task.title}`);
      for(const col of columns){const option=document.createElement('option');option.value=col;option.textContent={backlog:'Backlog',active:'In focus',done:'Finished'}[col];select.append(option);}
      select.value=status;select.addEventListener('change',()=>attempt(()=>{try{commit(moveTask(tasks,task.id,select.value));}catch(error){select.value=status;throw error;}}));
      const remove=document.createElement('button');remove.textContent='Delete';remove.setAttribute('aria-label',`Delete ${task.title}`);
      remove.onclick=()=>attempt(()=>commit(removeTask(tasks,task.id)));
      actions.append(select,remove);card.append(tag,title,actions);container.append(card);
    }
    if(!container.children.length){const empty=document.createElement('p');empty.className='empty';empty.textContent=q?'No matching tasks':'Space for what comes next';container.append(empty);}
  }
}
$('new-task').onsubmit=e=>{e.preventDefault();attempt(()=>{commit(addTask(tasks,$('title').value,$('priority').value));$('title').value='';$('title').focus();});};
$('search').oninput=render;
$('export').onclick=()=>attempt(()=>{const url=URL.createObjectURL(new Blob([exportBoard(tasks)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='focusboard-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('import').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>1024*1024)throw new Error('Backup must be smaller than 1 MB');const next=importBoard(await file.text());if(confirm(`Replace this board with ${next.length} imported tasks?`))commit(next);}catch(err){$('message').textContent=err.message;}finally{e.target.value='';}};
render();
