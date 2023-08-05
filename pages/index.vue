<template>
  <v-container>
    <v-footer>
      アイデア一覧
      <idea-form>
        <template #default="slotProps">
          <v-btn
            v-bind="slotProps.attrs"
            class="ma-2"
            dark
            color="danger"
            v-on="slotProps.on"
          >
            <v-icon>mdi-plus</v-icon>
            新規アイデア追加
          </v-btn>
        </template>
      </idea-form>
    </v-footer>
    <v-main>
      <idea-view
        v-for="(item, index) in ideas"
        :key="index"
        :idea="ideas[index]"
      />
    </v-main>
  </v-container>
</template>

<script>
import {
  defineComponent,
  ref,
  useContext,
  onMounted
} from '@nuxtjs/composition-api'
import IdeaForm from '~/components/Idea/IdeaForm.vue'
import IdeaView from '~/components/Idea/IdeaView.vue'

export default defineComponent({
  name: 'TopPage',
  components: {
    IdeaForm,
    IdeaView
  },
  setup () {
    const { app, $config } = useContext()
    const ideas = ref([])

    fetch($config.fetchUrl + '/storage/ideas.json')
      .then(response => response.json())
      .then((json) => {
        ideas.value = json.ideas
      })

    onMounted(() => {
      app.$echo.channel('idea-channel')
        .listen('IdeaPostedEvent', (e) => {
          const index = ideas.value.findIndex(item => item.id === e.item.id)
          if (index === -1) {
            ideas.value.unshift(e.item)
          } else {
            ideas.value.splice(index, 1, e.item)
          }
        })
        .listen('IdeaDeletedEvent', (e) => {
          const index = ideas.value.findIndex(item => item.id === e.item)
          if (index !== -1) {
            ideas.value.splice(index, 1)
          }
        })
    })

    return {
      ideas
    }
  },
  head: {
    title: 'アイデア一覧'
  }
})
</script>
