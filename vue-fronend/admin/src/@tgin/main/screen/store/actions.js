export async function init(context, ssrContext) {
    if (typeof window === 'undefined' || process.env.SERVER) {
        const serverScreenName = context.getters['serverScreenNameEval'](ssrContext)
        context.commit('SET_SERVER_SCREEN_NAME', serverScreenName)
    }
}
