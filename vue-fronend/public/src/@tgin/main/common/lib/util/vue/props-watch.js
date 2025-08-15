export default function (props) {
    return Object.keys(props).reduce((map, prop) => {
        map[prop] = {
            handler: function (val) {
                this.bind = this.$util.vue.propsPass(props, this)
            }
        }
        return map
    }, {})
}
