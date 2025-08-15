export default {

    created() {
        this.$options.contentHandlers = [];
    },
    methods: {

        addContentHandler(data) {
            this.$options.contentHandlers.push(data)
        },

        detachContentHandlers(context = null) {
            this.$options.contentHandlers.forEach((relation) => {

                if (!context || relation.context === context) {
                    if (relation.element) {
                        relation.element.removeEventListener(relation.element.event, relation.element.callback);
                    }
                    if (relation.object && relation.object.destroy) {
                        relation.object.destroy();
                    }
                }
            })
            this.$options.contentHandlers = [];
        },

        attachContentHandlers(context, handlers) {

            handlers.forEach((handler) => {

                const elements = context.querySelectorAll(handler.selector)

                for (var i = 0; i < elements.length; i++) {

                    const element = elements[i];

                    if (handler.event) {

                        const callback = (event) => {

                            event.preventDefault()

                            var target = event.target

                            while (target) {

                                if (element === target) {

                                    handler.callback(target, context, this);

                                    break
                                }

                                target = target.parentNode

                            }

                        }

                        element.addEventListener(handler.event, callback)

                        this.addRelation({
                            event: handler.event,
                            callback,
                            context,
                            element,
                        })

                    } else {

                        handler.callback(element, context, this)
                    }
                }

            })

        },

    },
}

