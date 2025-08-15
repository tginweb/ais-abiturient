
export default {
  data() {
    return {
      fillHeightExcludeRefs: ['header', 'footer'],
      fillHeightSize: 10,
      fillHeightSizeDefault: 100,
      fillHeightMinus: 0,
      fillHeightFreeSizeMin: 100,
      fillHeightVersion: 1,
    }
  },
  computed: {

    fillHeightBusySize() {

      let size = 0;

      this.fillHeightVersion;

      this.fillHeightExcludeRefs.forEach((ref)=>{

        let el = this.$refs[ref];

        if (el) {

          el = el.$el || el;

          size = size + el.offsetHeight;
        }
      })

      return size;
    },

    fillHeightFreeSize() {

      let size = this.fillHeightSize;


      size = size - this.fillHeightBusySize

      size = size - this.fillHeightMinus;

      return size < this.fillHeightFreeSizeMin ? this.fillHeightFreeSizeMin : size;
    },

  },
  methods: {

    getFillHeightSize() {

      let container = this.$refs.fillHeight || this.$refs.holder;

      if (container) {

        container = container.$el || container;

        return container ? container.offsetHeight : this.fillHeightSizeDefault;
      }

    },

    onFillHeightResize() {

      setTimeout(()=>{
        this.fillHeightVersion++
        let size = this.getFillHeightSize();
        this.fillHeightSize = size;
      },50)
    },
  },
}

