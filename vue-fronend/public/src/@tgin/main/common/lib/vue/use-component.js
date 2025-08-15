function useComponent(vue, name, component, options, optionsName = null)
{
    optionsName = optionsName ? optionsName : (typeof component === 'object' && component.name ? component.name : optionsName || name)

    if (!vue.prototype.$coptions) {
        vue.prototype.$coptions = {}
    }

    vue.prototype.$coptions[optionsName] = options;
}

export default useComponent

export {useComponent}

