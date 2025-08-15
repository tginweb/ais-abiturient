import {dialogExtractPath} from './util'

export function dialogStateSet(context, [dialogPath, data]) {

    let [module, dialogId] = dialogExtractPath(dialogPath);

    context.commit(module + '/dialogStateSet', [dialogId, data]);
}

export function dialogStateAssign(context, [dialogPath, data]) {

    let [module, dialogId] = dialogExtractPath(dialogPath);

    context.commit(module + '/dialogStateAssign', [dialogId, data]);
}

export function dialogPropsSet(context, [dialogPath, data]) {

    let [module, dialogId] = dialogExtractPath(dialogPath);

    context.commit(module + '/dialogPropsSet', [dialogId, data]);
}

export function dialogPropsAssign(context, [dialogPath, data]) {

    let [module, dialogId] = dialogExtractPath(dialogPath);

    context.commit(module + '/dialogPropsAssign', [dialogId, data]);
}


export function dialogToggle(context, [dialogPath, data]) {

    if (context.getters.dialogVisible(dialogPath)) {

        context.dispatch('dialogHide', [dialogPath, data])

    } else {

        context.dispatch('dialogShow', [dialogPath, data])
    }
}

export function dialogShow(context, [dialogPath, data]) {

    let [module, dialogId] = dialogExtractPath(dialogPath);

    data = data || {};

    let dialogData = context.state[module].dialog[dialogId]

    if (dialogData.guards) {

        if (!context.getters['user/authorized']) {

            this.$bus.emit('processMessages', [
                {
                    type: 'error',
                    message: 'Авторизуйтесь на сайте чтобы оставить отзыв',
                    notify: true,
                }
            ]);

            return
        }
    }

    this.$bus.emit('dialog.show.' + dialogPath);

    context.commit(module + '/dialogPropsSet', [dialogId, data]);

    context.commit(module + '/dialogShow', dialogId);

    this.$bus.emit('dialog.shown.' + dialogPath);
}


export function dialogHide(context, [dialogPath, data]) {

    let [module, dialogId] = dialogExtractPath(dialogPath);



    data = data || {};

    this.$bus.emit('dialog.hide.' + dialogPath);

    if (data)
        context.commit(module + '/dialogPropsSet', [dialogId, data]);

    context.commit(module + '/dialogHide', dialogId);

    this.$bus.emit('dialog.hidden.' + dialogPath);
}

export function dialogSetVisible(context, [dialogPath, val]) {

    let [module, dialogId] = dialogExtractPath(dialogPath);

    if (val)
        context.commit(module + '/dialogShow', dialogId);
    else
        context.commit(module + '/dialogHide', dialogId);

}




