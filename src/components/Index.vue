<template>
  <div class="container" v-if="questions.length > 0">
    <carousel :per-page="1" :navigationEnabled="true" :paginationEnabled="false" :mouse-drag="true" :centerMode="true">
      <template v-for="question in questions">
        <slide v-if="question.question.length > 1"  v-bind:key="question">
          {{ question.index }} :
          <span v-for="translation in question.question" v-bind:key="translation.language" v-show="locale === translation.language">
            {{ translation.text }}
          </span>
          <Br />
          <router-link :to="{name: 'Topic', params: {id: question.index }}" class="button topic_button is-link">
            Valitse tämä aihe
          </router-link>
        </slide>
      </template>
    </carousel>
    <!-- <p>{{ questions }} </p> -->
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
  props: ['locale'],
  data () {
    return {
      questions: []
    }
  },
  async created () {
    console.log('locale is ' + this.locale)
    const QUESTIONS_PATH = `${process.env.API_PATH}/`
    const response = await axios.get(QUESTIONS_PATH)
    this.questions = response.data.data
  }
}
</script>
