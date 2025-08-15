/**
 * vue-scroll-behavior v0.2.0
 * (c) 2017 jeneser
 * @license MIT
 */

import {cleanHistoryList, getScrollPosition, isIgnoreRoute, setOption, setScrollPosition,} from './utils/helpers';

const vueScrollBehavior = {
    _el: null,
    _maxLength: 50,
    _ignore: [],
    _delay: 0,
    _leaveIgnored: false,
};

/**
 * Plugin API
 * vsbHistoryList [property]
 * vueScrollBehavior [function]
 */
vueScrollBehavior.install = function (Vue, options) {
    // Init options
    setOption(options);

    // Global property
    Vue.vsbHistoryList = [];

    // Global method
    Vue.vueScrollBehavior = function (router) {
        if (typeof router === 'object' && typeof router.beforeEach === 'function') {

            window.popStateDetected = false

            window.addEventListener('popstate', () => {
                window.popStateDetected = true
            })

            // Router beforeEach
            router.beforeEach((to, from, next) => {

                setTimeout(() => {


                    // Ignore route
                    if (isIgnoreRoute(from)) {
                        next();
                    } else {
                        let _historyList = this.vsbHistoryList;
                        let position = getScrollPosition();
                        let currentPathIndex = _historyList.findIndex((e) => {
                            return e.path === from.fullPath;
                        });

                        // Cleaning historyList
                        if (_historyList.length >= vueScrollBehavior._maxLength) {
                            cleanHistoryList(_historyList);
                        }

                        if (currentPathIndex !== -1) {
                            _historyList[currentPathIndex].position = position;
                        } else {
                            _historyList.push({
                                path: from.fullPath,
                                position: position,
                            });
                        }

                        next();
                    }
                }, 10)


            });

            // Router afterEach
            router.afterEach((route, from) => {

                const isPopStateNav = window.popStateDetected
                window.popStateDetected = false

                if (isIgnoreRoute(route) || !isPopStateNav) {

                    if (!vueScrollBehavior._leaveIgnored) {
                        setScrollPosition(Vue);
                    }

                } else {

                    let savedPosition = this.vsbHistoryList.find((e) => {
                        return e.path === route.fullPath;
                    });


                    if (typeof savedPosition !== 'undefined') {

                        /*
                        if (route.meta.pageLoadTrigger === 'bus') {
                            Vue.bus.once('pageLoaded', () => {
                                setScrollPosition(Vue, savedPosition.position, true);
                            });
                        } else {
                            options.bus.$emit('loadingStart', {delay: 10})

                            setScrollPosition(Vue, savedPosition.position, false, () => {
                                options.bus.$emit('loadingStop')
                            });
                        }

                         */

                    } else {
                        setScrollPosition(Vue);
                    }
                }
            });
        } else {
            console.warn(
                'Vue-scroll-behavior dependent on vue-router! ' +
                'Please create the router instance.'
            );
        }
    };

    Vue.vueScrollBehavior(options.router);
};

export default vueScrollBehavior;
