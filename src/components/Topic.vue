<template>
  <div>
    <div id="lang">
      <button v-on:click="setLocale('fi')">FIN</button>
      |
      <button v-on:click="setLocale('en')">ENG</button>
    </div>
    <div class="container" v-if="question.question">
      <p class="topic_title" v-for="q in question.question" v-bind:key="q.language" v-show="locale === q.language">{{ q.text }}</p>
      <div class="columns is-centered" v-for="chunk in responsesChunks">
        <div v-bind:class="{ fixed_person: isFixed, has_video: response.video, dimmed: isDimmed }" class="is-pulled-left column person" v-for="response in chunk" v-bind:id="'person' + response.respondent" v-bind:ref="'person' + response.respondent" v-bind:answer="response.response">
          <component :is="response.video?'a':'span'"  @click="toggleModal(response.respondent)">
            <img v-bind:src="response.imgSrc" @mouseover="toggleMetadata(response.respondent)" @mouseleave="toggleMetadata(response.respondent)" />
            <div v-if="response.video" v-show="showMetadata[response.respondent]" class="metadata_wrapper">
              <div v-for="attributes in participants[response.respondent].details" class="metadata" v-show="locale === attributes.language">
                {{ attributes.married }}<br />
                {{ attributes.occupation }}<br />
                {{ attributes.status }}<br />
                {{ participants[response.respondent].location }}
              </div>
            </div>
          </component>
        </div>
      </div>
    </div>
    <div class="modals_container">
      <div v-for="chunk in responsesChunks" v-if="chunk.length > 0">
        <div v-for="response in chunk">
          <vue-modaltor v-if="response.video"
                        :resize-width='{1200:"60%",992:"80%",768:"90%"}'
                        :visible="showModal[response.respondent]"
                        :bgOverlay='"#000000"'
                        :bgPanel='"#000000"'
                        @hide="toggleModal(response.respondent)">
            <template slot="close-icon">
              <svg class="close_button" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="20" height="20" xml:space="preserve" v-on:click="stopPlayers">
                <path fill="#FFFFFF" d="M8.7,7.6c-0.4-0.4-1-0.4-1.4,0C6.9,8,6.9,8.6,7.3,9l11,11l-11,11c-0.4,0.4-0.4,1,0,1.4c0.4,0.4,1,0.4,1.4,0 l11-11l11,11c0.4,0.4,1,0.4,1.4,0c0.4-0.4,0.4-1,0-1.4l-11-11L32,9c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0l-11,11L8.7,7.6z" class="st0">
                </path>
              </svg>
            </template>
            <video-player class="video-player-box vjs-big-play-centered"
                          ref="videoPlayer"
                          :crossOrigin='"anonymous"'
                          :options="playerOptions[response.respondent]"
                          v-bind:trackList="tracks[response.respondent]"
                          :playsinline="true">
            </video-player>
          </vue-modaltor>
        </div>
      </div>
    </div>
    <div class="columns bottom_menu is-mobile is-centered" id="bottomMenu" ref="bottomMenu" v-show="isFixed">
      <div class="column has-text-left">
        <span v-show="locale === 'fi'">Täysin eri mieltä</span>
        <span v-show="locale === 'en'">Completely disagree</span>
      </div>
      <div class="column">
        <span v-show="locale === 'fi'">Eri mieltä</span>
        <span v-show="locale === 'en'">Somewhat disagree</span>
      </div>
      <div class="column">
        <router-link :to="{name: 'Index'}">
          <span v-show="locale === 'fi'">Vaihda aihe</span>
          <span v-show="locale === 'en'">Change topic</span>
        </router-link>
      </div>
      <div class="column">
        <span v-show="locale === 'fi'">Sanaa mieltä</span>
        <span v-show="locale === 'en'">Somewhat agree</span>
      </div>
      <div class="column has-text-right">
        <span v-show="locale === 'fi'">Täysin samaa mieltä</span>
        <span v-show="locale === 'en'">Completely agree</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import Velocity from 'velocity-animate'
import _ from 'lodash'
import VueModalTor from 'vue-modaltor'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
Vue.use(VueModalTor)

export default {
  components: {
    videoPlayer
  },
  data () {
    return {
      locale: null,
      question: [],
      responses: [],
      participants: [],
      animationTrigger: false,
      isFixed: false,
      tops: [],
      vertRef: [],
      rows: 7,
      horzRef: [],
      showModal: [],
      showMetadata: [],
      playerOptions: [],
      tracks: [],
      isDimmed: false
    }
  },
  computed: {
    responsesChunks () {
      return _.chunk(Object.values(this.responses), 14)
    }
  },
  methods: {
    stopPlayers: function () {
      let medias = Array.prototype.slice.apply(document.querySelectorAll('audio,video'))
      medias.forEach(function (media) {
        media.pause()
      })
    },
    toggleMetadata: function (respondent) {
      Vue.set(this.showMetadata, respondent, !this.showMetadata[respondent])
    },
    toggleModal: function (respondent) {
      Vue.set(this.showModal, respondent, !this.showModal[respondent])
    },
    setLocale: function (locale) {
      console.log('switching to ' + locale)
      this.locale = locale
      localStorage.setItem('locale', locale)
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    iconValue (response) {
      return Math.round(response / 4) + 3
    },
    widthSet (response) {
      return response * 3.875
    },
    changeFace () {
      this.responses.forEach((val, index) => {
        this.responses[index].imgSrc = '/static/avatars/' + val.respondent + '_' + this.iconValue(val.response) + '.png'
      })
    },
    getNewRow (array) {
      array.forEach((startValue, index) => {
        array[index] = this.vertRef[this.participants[index + 1].age]
        this.responses[index].vertref = this.vertRef[this.participants[index + 1].age]
      })
      return array
    },
    dimIcons (i) {
      this.isDimmed = true
    },
    moveShit (el, index, value, done) {
      this.horzRef[this.iconValue(value)] = this.horzRef[this.iconValue(value)] || []
      this.horzRef[this.iconValue(value)][this.participants[index].age] = this.horzRef[this.iconValue(value)][this.participants[index].age] || 0
      if (this.animationTrigger === true) {
        Velocity(el, {
          left: Math.min(93, parseInt(parseFloat(this.iconValue(value) * 14.28) + 4 + Math.min(9.2, parseFloat(2.875 * this.horzRef[this.iconValue(value)][this.participants[index].age])))) + 'vw',
          top: this.tops[index] + 'px'
        }, {
          duration: 3000,
          easing: 'linear',
          complete: () => {
            this.dimIcons(index)
          }
        })
        this.horzRef[this.iconValue(value)][this.participants[index].age]++
      } else {
        done()
      }
    },
    leaveEl (el, done) {
      done()
    },
    showCSS (el) {
      el.style.top = el.getBoundingClientRect().top
      el.style.left = el.getBoundingClientRect().left
      // el.style.position = 'fixed'
    }
  },
  async created () {
    const QUESTIONS_PATH = `${process.env.API_PATH}/`
    const qresponse = await axios.get(QUESTIONS_PATH)
    this.question = qresponse.data.data[this.$route.params.id]

    const STATS_PATH = `${process.env.API_PATH}/participants/`
    const participants = await axios.get(STATS_PATH)
    this.participants = participants.data.data

    const TOPIC_URL = `${process.env.API_PATH}/topic/${this.$route.params.id}`
    const response = await axios.get(TOPIC_URL)
    this.responses = response.data.data
    this.responses.forEach(resp => {
      this.$set(resp, 'imgSrc', '/static/avatars/' + resp.respondent + '_3.png')
      // this.$set(resp, 'videoSrc', resp.video)
      if (resp.video) {
        Vue.set(this.playerOptions, resp.respondent, {
          language: this.locale,
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          controls: true,
          aspectRatio: '20:9',
          sources: [{
            type: 'video/mp4',
            src: resp.video
          }]
        })
        Vue.set(this.tracks, resp.respondent, [{
          kind: 'Captions',
          label: 'English',
          src: resp.subtitles,
          srcLang: 'en',
          default: true
        }])
      }
    })
  },
  async mounted () {
    if (localStorage.locale) {
      this.locale = localStorage.getItem('locale')
    }
    await this.sleep(3000)
    await this.changeFace()
    // console.log(this.$refs['person2'][0].clientHeight)
    // console.log(this.$refs['person100'][0].getBoundingClientRect().top)
    this.rows = parseInt(this.$refs['person100'][0].getBoundingClientRect().top / this.$refs['person2'][0].clientHeight)
    for (let i = 0; i <= 99; i++) {
      let el = this.$refs['person' + parseInt(i + 1)][0]
      let top = el.getBoundingClientRect().top
      let left = el.getBoundingClientRect().left
      // el.style.position = 'fixed'
      this.tops.push(top)
      el.style.top = top + 'px'
      el.style.left = left + 'px'
    }
    this.vertRef = Array.from(new Set(this.tops)).reverse().slice(-7)
    this.vertRef.unshift(0)
    // this.vertRef = this.vertRef.slice(0, 7).reverse()
    this.$refs.bottomMenu.style.top = parseInt(this.vertRef[1] + 95) + 'px'
    this.tops = this.getNewRow(this.tops)
    await this.sleep(1500)
    this.animationTrigger = true
    this.isFixed = true

    for (let i = 0; i <= 99; i++) {
      let el = this.$refs['person' + parseInt(1 + i)][0]
      this.moveShit(el, i, el.attributes.answer.nodeValue)
    }
  }
}
</script>
