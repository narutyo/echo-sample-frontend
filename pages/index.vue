<template>
  <v-container>
    <v-footer>
      アイデア一覧
      <idea-form
        @reload="getContents"
      >
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
      <v-card
        v-for="item in list"
        :key="item.id"
      >
        <v-card-title>
          <nuxt-link
            :to="{ path: '/idea/' + item.id }"
          >
            {{ item.title }}
          </nuxt-link>
        </v-card-title>
        <v-card-text>{{ item.body }}</v-card-text>
        <v-card-subtitle>{{ item.updated_at|datetime_format }}</v-card-subtitle>
      </v-card>
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

export default defineComponent({
  name: 'TopPage',
  components: {
    IdeaForm
  },
  setup () {
    const { app } = useContext()
    const loading = ref(false)
    const list = ref([])
    const page = ref(1)
    const limit = ref(20)

    const getContents = async () => {
      loading.value = true

      const paramJson = {
        'fields[]': ['id', 'title', 'body', 'updated_at'],
        limit: limit.value,
        offset: (page.value - 1) * limit.value
      }
      const ret = await app.$axios.$get('/idea?' + app.$search_params(paramJson))

      list.value = ret.results
      loading.value = false
    }

    onMounted(async () => {
      await getContents()
    })

    return {
      loading,
      page,
      list,
      limit,

      getContents
    }
  },
  head: {
    title: 'アイデア一覧'
  }
})
</script>
