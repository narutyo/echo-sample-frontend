<template>
  <v-lazy
    v-model="shown"
    :options="{
      threshold: .5
    }"
    min-height="100"
    transition="fade-transition"
  >
    <v-card>
      <v-card-title>
        <nuxt-link
          :to="{ path: '/idea/' + currentIdea.id }"
        >
          {{ currentIdea.title }}
        </nuxt-link>
      </v-card-title>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <v-card-text><div v-html="$nl2br(currentIdea.body)" /></v-card-text>
      <v-card-subtitle>
        {{ currentIdea.updated_at|datetime_format }}
        <idea-form
          :idea="idea"
        >
          <template #default="slotProps">
            <v-btn
              v-bind="slotProps.attrs"
              color="success"
              dark
              icon
              v-on="slotProps.on"
            >
              <v-icon>mdi-pencil-box-outline</v-icon>
            </v-btn>
          </template>
        </idea-form>
        <v-btn
          color="danger"
          dark
          icon
          @click="del(currentIdea)"
        >
          <v-icon>mdi-delete-forever</v-icon>
        </v-btn>
      </v-card-subtitle>
    </v-card>
  </v-lazy>
</template>

<script>
import {
  defineComponent,
  useContext,
  ref,
  toRefs,
  watch
} from '@nuxtjs/composition-api'
import IdeaForm from '~/components/Idea/IdeaForm.vue'

export default defineComponent({
  components: {
    IdeaForm
  },
  props: {
    idea: {
      type: Object,
      default: () => {}
    }
  },
  setup (props) {
    const { app } = useContext()
    const { idea } = toRefs(props)

    const currentIdea = ref(idea.value)
    const shown = ref(false)
    const loading = ref(false)

    const del = async (item) => {
      loading.value = true
      await app.$axios.$delete('/idea/' + item.id).then((response) => {
        loading.value = false
        app.$toast.success('削除しました')
      }).catch((err) => {
        app.$error_toast(err, '削除に失敗しました')
        loading.value = false
      })
    }

    watch(() => idea.value,
      (to, from) => {
        currentIdea.value = to
      },
      { deep: true }
    )

    return {
      shown,
      currentIdea,

      del
    }
  }
})
</script>
