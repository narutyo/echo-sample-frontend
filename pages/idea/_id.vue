<template>
  <v-container
    id="scrolling-techniques-7"
  >
    <v-card>
      <v-card-title>{{ idea.title }}</v-card-title>
      <v-card-text>{{ idea.body }}</v-card-text>
      <v-card-subtitle>{{ idea.updated_at|datetime_format }}</v-card-subtitle>
    </v-card>
    <comment-view
      v-for="(item, index) in comments"
      :key="index"
      :idea="idea"
      :comment="comments[index]"
    />
  </v-container>
</template>

<script>
import {
  defineComponent,
  ref,
  useContext,
  onMounted
} from '@nuxtjs/composition-api'
import CommentView from '~/components/Comment/CommentView.vue'

export default defineComponent({
  name: 'IdeaDetail',
  components: {
    CommentView
  },
  setup () {
    const { app, route, $config } = useContext()
    const loading = ref(false)
    const idea = ref({})
    const comments = ref([])

    fetch($config.fetchUrl + '/storage/' + route.value.params.id + '.json')
      .then(response => response.json())
      .then((json) => {
        idea.value = json.idea
        comments.value = json.comments
      })

    onMounted(() => {
      app.$echo.channel('comment-channel_' + route.value.params.id)
        .listen('CommentPostedEvent', (e) => {
          const index = comments.value.findIndex(item => item.id === e.item.id)
          if (index === -1) {
            comments.value = [...comments.value, e.item]
          } else {
            comments.value.splice(index, 1, e.item)
          }
        })
    })

    return {
      loading,
      idea,
      comments
    }
  },
  head: {
    title: '個別アイデア'
  }
})
</script>
