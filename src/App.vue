<template>
  <div id="app">
    <router-view :locale="locale" />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    if (localStorage.locale) {
      this.locale = localStorage.getItem('locale')
    }
  },
  watch: {
    locale: {
      handler () {
        this.$emit('locale', this.locale)
        localStorage.setItem('locale', this.locale)
      },
      deep: true
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
$column-gap: 0.15rem;
@import '../node_modules/bulma/bulma.sass';
@import '../node_modules/bulma/sass/utilities/initial-variables.sass';
@font-face {
  font-family: 'altedin';
  src: url('assets/fonts/Alte-DIN-1451-Mittelschrift.ttf.eot');
  src: url('assets/fonts/Alte-DIN-1451-Mittelschrift.ttf.eot#iefix') format("embedded-opentype"),
       url('assets/fonts/Alte-DIN-1451-Mittelschrift.ttf.woff') format('woff'),
       url('assets/fonts/din1451alt.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

#person99, #person100 {
  display: none;
}
.person {
  max-height: 6.5vmax;
  // max-width: 11.42vH;
  padding-right: 0.15vw;
  pointer-events: none;
  cursor: default;
  img {
    max-height: 10vH;
    width: 6.5vmax;
    float: left;
  }
  &.dimmed {
    // opacity: 0.35;
    filter: brightness(35%);
    &.has_video {
      opacity: 1 !important;
      filter: brightness(100%);
      pointer-events: initial;
      cursor: pointer;
      &:hover {
      }
    }
  }
}
.metadata_wrapper {
  height: inherit;
  float: left;
  width: 6vmax;
  background-color: rgba(255,255,255,0.4);

  .metadata {
    color: black;
    font-size: 0.7rem;
  }
}
.fixed_menu {
  position: fixed;
  width: 98%;
  left: 1%;
}
.fixed_person {
  position: fixed;
  max-width: 13vmax;
  width: 13vmax;
}
html {
  background-color: black;
}

#lang {
  float: right;
  font-size: 1rem;
  position: absolute;
  top: 0;
  z-index: 1000;
  right: 10px;
}
.modal-vue-overlay {
  height: 200vH;
}
.modal-vue--content {
  overflow-y: hidden;
}
.modal-vue---close-icon {
  top: 0px;
  color: white;
}

#app {
  background-color: black;
  color: white;
  font-size: 2rem;
  font-family: 'altedin', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  .container {
    padding-top: 60px;
  }

  .topic_index {
    margin-top: 35vH;
  }

  .tiles {
    padding-top: 1.5rem;
    background-color: black;
  }

  .bottom_menu {
    color: white;
    width: 98%;
    left: 1%;
    margin-top: 15px;
    position: fixed;
    font-size: 1.2rem;
    text-transform: uppercase;
    a {
      color: white;
      border: 2px solid white !important;
      padding: 0.25rem;
    }
  }
}
.video-js .vjs-text-track-display > div > div > div{
  font-size: 1.6rem !important;
  line-height: 2rem !important;
  padding:5px !important;
  background:transparent !important;
  text-shadow: 1px 1px 2px #000000;
  display: inline-block !important;
  font-family: 'altedin', sans-serif !important;
  top: 90px !important;
}

p.topic_title {
  line-height: 1.8rem;
  margin-bottom: 2rem;
}

.video-js.vjs-fullscreen .vjs-text-track-display > div > div > div {
  top: initial !important;
}
.person {
  &.has_video {
    z-index: 99;
  }
}
.columns {
  margin-bottom: 0 !important;
}

.VueCarousel-navigation  {
  font-size: 3rem;
  color: white;
  opacity: 1;
  &.leftnav {
      transform: translateY(0%) translateX(130%);
  }
  &.rightnav {
      transform: translateY(0%) translateX(-130%);
  }
}
.VueCarousel-navigation-button {
  color: white !important;
  font-size: 3rem;
  opacity: 1 !important;
}

@media screen and (max-width: 400px)  {
  #app {
    .bottom_menu {
      font-size: 0.6rem;
    }
  }
  p.topic_title {
    font-size: 1.2rem;
    line-height: 1.4rem;
    margin-bottom: 1.6rem;
  }

  .person {
    max-height: 4.5vmax;
    &#person99 {
      display: block;
    }
    img {
      width: 4.5vmax;
      max-height: 4.25vH;
    }
    .metadata_wrapper {
      width: 4vmax;
    }
  }

  .VueCarousel-wrapper {
    width: 73%;
    left: 13%;
    font-size: 1.6rem;
  }
  .VueCarousel-navigation {
    button {
      top: 22% !important;
      &.VueCarousel-navigation-prev {
        left: 15%;
      }
      &.VueCarousel-navigation-next {
        left: 70%;
      }
    }
  }
}

@media screen and (min-width: 401px) and (max-width: 1024px) and  (orientation:landscape) {
  #app {
    .container {
      padding-top: 30px;

      .topic_index {
        margin-top: 9vmax;
      }
    }
    .bottom_menu {
      top: 43vmax !important;
      font-size: 0.9rem;
    }
  }

  p.topic_title {
    padding: 0 1.5rem;
    font-size: 1.5rem;
    line-height: 1.9rem;
    margin-bottom: 0;
  }
  .VueCarousel-wrapper {
    width: 88%;
    left: 6%;
    font-size: 2rem;
  }
  .VueCarousel-navigation {
    button {
      top: 22% !important;
      &.VueCarousel-navigation-prev {
        left: 9%;
      }
      &.VueCarousel-navigation-next {
        left: 85%;
      }
    }
  }
}

.topic_button {
  background-color: black !important;
  border: 2px solid white !important;
  border-radius: none !important;
  color: white;
  font-size: 1.5rem;
}
</style>
