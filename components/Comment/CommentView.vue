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
      <!-- eslint-disable-next-line vue/no-v-html -->
      <v-card-text><div v-html="$nl2br(currentComment.body)" /></v-card-text>
      <v-card-subtitle>
        {{ currentComment.updated_at|datetime_format }}
        <comment-form
          :idea="idea"
          :comment="currentComment"
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
        </comment-form>
        <v-btn
          color="danger"
          dark
          icon
          @click="del(currentComment)"
        >
          <v-icon>mdi-delete-forever</v-icon>
        </v-btn>
      </v-card-subtitle>
      <v-card-actions>
        <comment-form
          :idea="idea"
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
              コメント投稿
            </v-btn>
          </template>
        </comment-form>
      </v-card-actions>
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
import CommentForm from '~/components/Comment/CommentForm.vue'

export default defineComponent({
  components: {
    CommentForm
  },
  props: {
    idea: {
      type: Object,
      default: () => {}
    },
    comment: {
      type: Object,
      default: () => {}
    }
  },
  setup (props) {
    const { app } = useContext()
    const { comment } = toRefs(props)

    const currentComment = ref(comment.value)
    const shown = ref(false)
    const loading = ref(false)

    const del = async (item) => {
      loading.value = true
      await app.$axios.$delete('/comment/' + item.id).then((response) => {
        loading.value = false
        app.$toast.success('削除しました')
      }).catch((err) => {
        app.$error_toast(err, '削除に失敗しました')
        loading.value = false
      })
    }

    watch(() => comment.value,
      (to, from) => {
        currentComment.value = to
      },
      { deep: true }
    )

    return {
      shown,
      currentComment,

      del
    }
  }
})
</script>
