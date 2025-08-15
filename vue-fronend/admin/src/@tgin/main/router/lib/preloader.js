export default function ({Vue}) {

    if (process.env.SERVER || (typeof hidePreloader === 'undefined')) {
        return
    }

    const defaultOnError = window.onerror;

    window.addEventListener("unhandledrejection", function (promiseRejectionEvent) {

        console.error(promiseRejectionEvent)

        hidePreloader()

    });

    window.onerror = function (errorMsg, url, lineNumber) {

        hidePreloader()

        if (defaultOnError)
            return defaultOnError(errorMsg, url, lineNumber);

        return false;
    }

    Vue.config.errorHandler = function (err, vm, info) {

        hidePreloader()

        console.error(err, vm && vm.name, info);
    }

    Vue.config.warnHandler = function (err, vm, info) {

        hidePreloader()

        console.warn(err, vm && vm.name, info);
    }
}

