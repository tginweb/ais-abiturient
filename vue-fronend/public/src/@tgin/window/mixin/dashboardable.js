export default {
    data() {
        return {
            widgetWidth: 4,
            widgetHeight: 4,
            gridColumns: 3
        }
    },
    computed: {

        widgets() {
            return []
        },

        layout() {

            let index = 0, x = 0, y = 0

            return this.widgets.map(widget => {

                const row = Math.floor(index / this.gridColumns)

                const width = widget.WIDTH || this.widgetWidth
                const height = widget.HEIGHT || this.widgetHeight

                const res = {x: x, y: row, w: width, h: height, i: index}

                x = x + width

                if (x > 9) {
                    x = 0
                    y = y + 5
                }

                index++
                return res
            })
        }
    }
}
