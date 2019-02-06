<template>
  <div>
    <div class="container" v-if="question.question">
      <p>{{ question.question.map((q) => { return q.text }).join() }}</p>
      <div class="columns is-centered" v-for="chunk in responsesChunks">
        <div v-bind:class="{ fixed_person: isFixed, has_video: response.videoSrc, dimmed: isDimmed }" class="is-pulled-left column person" v-for="response in chunk" v-bind:id="'person' + response.respondent" v-bind:ref="'person' + response.respondent" v-bind:answer="response.response">
          <component :is="response.video?'a':'span'"  @click="showModal[response.respondent] = true">
            <img v-bind:src="response.imgSrc" />
          </component>
          <modal v-if="showModal[response.respondent]" @close="showModal[response.respondent] = false">
            <video src="response.videoSrc">
            </video>
          </modal>
        </div>
      </div>
    </div>
    <div class="columns bottom_menu is-centered" id="bottomMenu" ref="bottomMenu" v-show="isFixed">
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
import axios from 'axios'
import Velocity from 'velocity-animate'
import _ from 'lodash'

export default {
  data () {
    return {
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
      isDimmed: false
    }
  },
  props: ['locale'],
  computed: {
    responsesChunks () {
      return _.chunk(Object.values(this.responses), 14)
    }
  },
  methods: {
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
      if (resp.video) {
        this.$set(resp, 'videoSrc', 'https://s3.wasabisys.com/icewhistle-content/sandbox/101/' + resp.respondent + '_' + this.$route.params.id + '.mp4')
      } else {
        this.$set(resp, 'videoSrc', false)
      }
    })
  },
  async mounted () {
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
    this.vertRef = Array.from(new Set(this.tops)).reverse()
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
