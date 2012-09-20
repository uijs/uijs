exportall(require('uijs-core'));
exportall(require('uijs-controls'));

function exportall(module) {
  Object.keys(module).forEach(function(k) { exports[k] = module[k]; });
}