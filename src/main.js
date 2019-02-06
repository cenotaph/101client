// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import VueSilentbox from 'vue-silentbox'

Vue.use(VueSilentbox)
Vue.use(VueI18n)
Vue.config.productionTip = false

let i18n = new VueI18n({
  locale: 'fi' // set locale
})
if (localStorage.locale) {
  i18n.locale = localStorage.getItem('locale')
} else {
  localStorage.setItem('locale', i18n.locale)
}

/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
