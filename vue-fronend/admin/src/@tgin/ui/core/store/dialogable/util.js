export function dialogExtractPath(dialogPath){

    let [module, dialogId] = dialogPath.split('/');

    if (!dialogId) {
      dialogId = module;
      module = 'app';
    } else {
      module = module || 'app';
    }

    return [module, dialogId];
}
