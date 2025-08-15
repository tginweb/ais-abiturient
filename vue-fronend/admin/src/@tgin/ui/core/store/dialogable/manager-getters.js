import {dialogExtractPath} from './util'

export function dialogProps(state) {

  return (dialogPath) => {

    let [module, dialogId] = dialogExtractPath(dialogPath);

    let dialogData = state[module].dialog[dialogId].props;

    return dialogData;
  }
}

export function dialogData(state) {

  return (dialogPath) => {

    let [module, dialogId] = dialogExtractPath(dialogPath);

    let dialogData = state[module].dialog[dialogId].data;

    return dialogData;
  }
}

export function dialogVisible(state) {

  return (dialogPath) => {

    let [module, dialogId] = dialogExtractPath(dialogPath);

    return state[module].dialog[dialogId] ? state[module].dialog[dialogId].value : false;
  }
}

