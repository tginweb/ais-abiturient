<template>

  <div class="com">


    <vue-plyr
      ref="plyr"
    >
      <div
        :data-plyr-embed-id="providerId"
        data-plyr-provider="youtube"
        v-if="provider=='youtube'"
      ></div>
      <video
        :poster="source.poster"
        :src="source.file"
        v-else-if="source.provider=='video'"
      >
      </video>
      <audio
        v-else-if="source.provider=='audio'"
      >
        <source :src="source.file" type="audio/mp3"/>
      </audio>
    </vue-plyr>

  </div>

</template>

<script>

  export default {
    props: {
      type: {},
      source: {}
    },
    data() {
      return {}
    },
    methods: {

      getAudioUrlProvider(url) {
        return 'soundcloud';
      },

      getVideoUrlProvider(url) {
        return 'youtube';
      },

      getYoutubeUrlId(url) {
        var ID = '';
        url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if (url[2] !== undefined) {
          ID = url[2].split(/[^0-9a-z_\-]/i);
          ID = ID[0];
        } else {
          ID = url;
        }
        return ID;
      },

      getVimeoUrlId(url) {
        var ID = '';
        url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if (url[2] !== undefined) {
          ID = url[2].split(/[^0-9a-z_\-]/i);
          ID = ID[0];
        } else {
          ID = url;
        }
        return ID;
      },

    },

    computed: {

      provider() {

        if (this.source.provider) return this.source.provider;

        switch (this.type) {
          case 'video':
            return this.getVideoUrlProvider(this.source.url)
          case 'audio':
            return this.getAudioUrlProvider(this.source.url)
        }
      },

      providerId() {

        if (this.source.id) return this.source.id;

        switch (this.provider) {
          case 'youtube':
            return this.getYoutubeUrlId(this.source.url);
          case 'vimeo':
            return this.getVimeoUrlId(this.source.url);
        }

      }
    }
  }

</script>

<style lang="scss" scoped>


</style>
