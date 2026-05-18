/**
 * Data backup — run in the **browser DevTools console** on https://…/recipes/ (or localhost)
 * while the app is open, to download `myRecipesData` as JSON.
 */
export const BACKUP_CONSOLE_SNIPPET = String.raw`
const data = localStorage.getItem('myRecipesData');
if (data) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'recipe-backup-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  URL.revokeObjectURL(url);
  console.log('Backup downloaded.');
} else {
  console.log('No data found in localStorage.');
}
`
