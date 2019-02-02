<template>
  <div id="app">
    <div id="lang">
      <button v-on:click="locale == 'fi'">FIN</button>
      |
      <button v-on:click="locale == 'en'">ENG</button>
    </div>
    <router-view :locale="locale" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      locale: null
    }
  },
  mounted () {
    if (localStorage.locale) {
      this.locale = localStorage.getItem('locale')
    }
  },
  watch: {
    locale: {
      handler () {
        localStorage.setItem('locale', this.locale)
      },
      deep: true
    }
  },
  methods: {
    setLocale: function (locale) {
      console.log('switching to ' + locale)
      this.locale = locale
      localStorage.setItem('locale', locale)
    }
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
  img {
    max-height: 10vH;
  }
}
.fixed_person {
  position: fixed;
  max-width: 6.5vmax;
}
html {
  background-color: black;
}

#lang {
  float: right;
  font-size: 1rem;
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
  .tiles {
    padding-top: 1.5rem;
    background-color: black;
  }
}

.columns {
  margin-bottom: 0 !important;
}
.VueCarousel-navigation  {
  font-size: 3rem;
  color: white;
  opacity: 1;
}
.VueCarousel-navigation-button {
  color: white !important;
  font-size: 3rem;
  opacity: 1 !important;
}

.topic_button {
  background-color: black !important;
  border: 2px solid white !important;
  border-radius: none !important;
  color: white;
  font-size: 1.5rem;
}
</style>
