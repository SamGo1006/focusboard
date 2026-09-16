export const columns = ['backlog', 'active', 'done'];
export function validate(tasks) {
  if (!Array.isArray(tasks) || tasks.length > 1000) throw new Error('Expected at most 1,000 tasks');
  const ids = new Set();
  return tasks.map(t => {
    if (!t || typeof t.id !== 'string' || !t.id || ids.has(t.id)) throw new Error('Invalid or duplicate task ID');
    ids.add(t.id);
    if (typeof t.title !== 'string' || !t.title.trim() || t.title.length > 160) throw new Error('Titles must contain 1–160 characters');
    if (!columns.includes(t.status) || !['low','medium','high'].includes(t.priority)) throw new Error('Invalid task status or priority');
    return {id:t.id,title:t.title.trim(),status:t.status,priority:t.priority};
  });
}
export function addTask(tasks,title,priority='medium',id=crypto.randomUUID()) {
  return validate([...tasks,{id,title,status:'backlog',priority}]);
}
export function moveTask(tasks,id,status,limit=3) {
  validate(tasks);
  if (!columns.includes(status) || !Number.isInteger(limit) || limit < 1) throw new Error('Invalid move settings');
  const task=tasks.find(t=>t.id===id);
  if (!task) throw new Error('Task not found');
  if (status==='active' && task.status!=='active' && tasks.filter(t=>t.status==='active').length>=limit)
    throw new Error(`Active work is limited to ${limit} tasks. Finish something first.`);
  return tasks.map(t=>t.id===id?{...t,status}:t);
}
export function removeTask(tasks,id) { return validate(tasks).filter(t=>t.id!==id); }
export function importBoard(text) {
  const data=JSON.parse(text);
  if (data.version!==1) throw new Error('Unsupported backup version');
  const tasks=validate(data.tasks);
  if(tasks.filter(t=>t.status==='active').length>3) throw new Error('Backup exceeds the active work limit of 3');
  return tasks;
}
export function exportBoard(tasks) { return JSON.stringify({version:1,tasks:validate(tasks)},null,2); }
