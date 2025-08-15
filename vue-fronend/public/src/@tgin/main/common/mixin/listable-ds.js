export default {
    apollo: {
        dataFilters: {
            query() {
                return this.filtersQuery()
            },
            deep: true,
            skip: true,
            fetchPolicy: 'no-cache',
            variables() {
                return {}
            },
            update(data) {
                return data.res
            },
            notifyOnNetworkStatusChange: true
        },
        data: {
            query() {
                return this.query()
            },
            deep: true,
            skip: true,
            fetchPolicy: 'no-cache',
            variables() {
                return {
                    mode: this.mode,
                    filter: {
                        ...this.cfilter,
                        ...this.filtersRequired
                    },
                    where: this.where,
                    nav: this.nav,
                }
            },
            update(data) {
                this.total = data.res && data.res.info.total
                return data.res
            },
            notifyOnNetworkStatusChange: true,
        }
    },
    props: {
        query: {},
        where: {},
        filtersQuery: {},
        filtersNames: {default: () => ([])},
        filtersExpanded: {},
        path: {},
        mode: {},
        idField: {default: 'id'},
        nidField: {default: 'id'},
        focusedRow: {},

        sortField: {},
        sortAsc: {default: true},
        navLimit: {default: 50},
    },
    data() {
        return {
            filter: {},
            cfilter: {},
            filterTimeout: null,
            total: 0,

            drawerFilters: true,
            splitterFilter: 18,
            nav: {
                sortField: this.sortField || this.idField,
                sortAscending: this.sortAsc,
                page: 1,
                limit: this.navLimit,
            },
            selectedRows: [],
            selectedSubrows: [],
            focusedRowState: this.focusedRow,
            rowsActions: []
        }
    },
    computed: {

        splitterFilterComp() {
            return this.dataFilters ? this.splitterFilter : 0
        },

        selectedRowsIds() {
            return this.selectedRows.map(row => row[this.idField])
        },

        selectedRowsNids() {
            return this.selectedRows.map(row => row[this.nidField])
        },

        selectedRowId() {
            return this.selectedRow ? this.selectedRow[this.idField] : null
        },

        selectedRow() {
            return this.selectedRows.length ? this.selectedRows[0] : null;
        },

        filterExist() {
            return Object.keys(this.$util.base.filterDeep(this.filter, (value, prop, subject) => {
                return value && (!Array.isArray(value) || value.length > 0);
            })).length > 0
        },

        pagination: {
            get: function () {
                return {
                    ...this.tableNavToPagination(this.nav),
                    rowsNumber: this.total
                }
            },
            set: function (val) {
                Object.assign(this.nav, {
                    ...this.tablePaginationToNav(val),
                })
            }
        },

        itemsById() {
            return this.data.nodes.reduce((map, o) => (map[o._id] = o, map), {});
        }
    },

    watch: {
        drawerFilters(val) {
            this.splitterFilter = val ? 17 : 0;
        },

        selectedRows() {
            this.$emit('selectedRows', this.selectedRows)
        },

        focusedRowState(val) {
            this.$emit('update:focusedRow', val)

            if (val)
                this.$emit('focusedRow', this.focusedRowState, this.focusedRowState[this.idField])
            else
                this.$emit('focusedRow', null)
        },

        filter: {
            handler: async function (filter) {


                if (this.filterTimeout) clearTimeout(this.filterTimeout)

                this.filterTimeout = setTimeout(() => {

                    this.nav.page = 1

                    this.cfilter = this.$util.base.filterDeep(filter, (value, prop, subject) => {

                        if (value && (typeof value === 'object') && (Object.keys(value).length === 0)) {
                            return false
                        }
                        return typeof value === 'boolean' || (value && (!Array.isArray(value) || value.length > 0));
                    })

                }, 500)

            },
            deep: true
        }
    },

    methods: {
        async onSubrowsAction(data) {
            try {

                const action = {
                    ...data
                }

                const args = {
                    targets: this.selectedSubrows,
                }

                action.params = Object.assign(action.params || {}, args)

                action.onResolve = (res) => {

                    if (res && res.result) {
                        this.$bus.emit('processMessages', res.result.messages);
                    }

                    this.reload(true)
                }

                await this.$store.dispatch('router/nav', action)
            } catch (e) {
                console.log(e)
            }
        },

        async onRowsAction(data) {
            try {

                const action = {
                    ...data
                }

                const args = {
                    ids: this.selectedRowsIds,
                }

                if (action.paramsAddRows) {
                    args.models = this.selectedRows
                }

                action.params = Object.assign(action.params || {}, args)

                action.onResolve = (res) => {

                    if (res && res.result) {
                        this.$bus.emit('processMessages', res.result.messages);
                    }

                    this.reload(true)
                }

                await this.$store.dispatch('router/nav', action)
            } catch (e) {
                console.log(e)
            }
        },

        async onRowAction(data) {

            const action = {
                ...data
            }

            const args = {
                id: this.focusedRowState[this.idField],
                ids: [this.focusedRowState[this.idField]],
            }

            action.params = Object.assign(action.params || {}, args)

            action.onResolve = (res) => {

                if (res && res.result) {
                    this.$bus.emit('processMessages', res.result.messages);
                }

                this.reload()
            }

            try {
                await this.$store.dispatch('router/nav', action)
            } catch (e) {
                console.log(e)
            }
        },

        async onAction(data) {

            const action = {
                ...data
            }

            action.onResolve = (res) => {

                if (res && res.result) {
                    this.$bus.emit('processMessages', res.result.messages);
                }

                this.reload()
            }

            try {
                await this.$store.dispatch('router/nav', action)
            } catch (e) {
                console.log(e)
            }
        },

        onRowOpen(row) {

            this.$nextTick(() => {

                setTimeout(() => {
                    const action = this.rowMenuComp.find(item => item.listEvent === 'open')

                    if (action) {
                        this.onRowAction(action)
                    }

                    this.$emit('rowOpen', row, row[this.idField])
                }, 50)

            })
        },

        onRowClick(props) {
            this.focusedRowState = props.row
        },

        tableNavToPagination(val) {
            return {
                sortBy: val.sortField,
                descending: !val.sortAscending,
                page: val.page,
                rowsPerPage: val.limit,
            }
        },

        tablePaginationToNav(val) {

            return {
                sortField: val.sortBy,
                sortAscending: !val.descending,
                page: val.page,
                limit: val.rowsPerPage,
            }
        }
    },
}

