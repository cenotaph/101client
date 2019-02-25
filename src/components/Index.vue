<template>
  <div>
    <div id="lang">
      <button v-on:click="setLocale('fi')">FIN</button>
      |
      <button v-on:click="setLocale('en')">ENG</button>
    </div>
    <div class="container" v-if="questions.length > 0">
      <div class="topic_index">
        <carousel class="101carousel" :per-page="1" :navigationEnabled="true" :paginationEnabled="false" :mouse-drag="true" :centerMode="true">
          <template v-for="question in questions">
            <slide v-if="question.question.length > 1"  v-bind:key="question">
              {{ question.index }} :
              <span v-for="translation in question.question" v-bind:key="translation.language" v-show="locale === translation.language">
                {{ translation.text }}
              </span>
              <Br />
              <router-link :to="{name: 'Topic', params: {id: question.index }}" class="button topic_button is-link">
                <span v-show="locale == 'fi'">Valitse tämä aihe</span>
                <span v-show="locale == 'en'">Choose topic</span>
              </router-link>
            </slide>
          </template>
        </carousel>
        <!-- <p>{{ questions }} </p> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'
import axios from 'axios'

export default {
  components: {
    Carousel,
    Slide
  },
  data () {
    return {
      locale: null,
      questions: []
    }
  },
  methods: {
    setLocale: function (locale) {
      console.log('switching to ' + locale)
      this.locale = locale
      localStorage.setItem('locale', locale)
    }
  },
  async created () {
    console.log('locale is ' + this.locale)
    const QUESTIONS_PATH = `${process.env.API_PATH}/`
    const response = await axios.get(QUESTIONS_PATH)
    this.questions = response.data.data
  },
  mounted () {
    if (localStorage.locale) {
      this.locale = localStorage.getItem('locale')
    }
  }
}
</script>
