<template>
  <v-dialog
    v-model="isAddOpen"
    persistent
    max-width="640px"
  >
    <template #activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs" />
    </template>
    <div class="mb-2 mb-md-3 text-right">
      <v-btn
        aria-label="閉じる"
        fab
        small
        @click="close()"
      >
        <v-icon
          small
        >
          mdi-close
        </v-icon>
      </v-btn>
    </div>
    <v-card
      class="pt-6 pb-4 pb-md-8 px-4 px-md-12"
    >
      <div>
        <v-form
          ref="observer"
        >
          <v-row>
            <v-col
              cols="12"
              sm="12"
              md="12"
            >
              <div>
                <v-text-field
                  v-model="form.title"
                  label="タイトル"
                  :rules="[rules.required, rules.length]"
                />
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="form.body"
                label="本文"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
        </v-form>
      </div>
      <div
        class="text-center mt-4"
      >
        <v-btn
          v-if="!idea"
          outlined
          :loading="loading"
          @click="post"
        >
          登録
        </v-btn>
        <v-btn
          v-else
          outlined
          :loading="loading"
          @click="update"
        >
          更新
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  toRefs,
  useContext,
  watch
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    idea: {
      type: Object,
      default: () => {}
    }
  },
  setup (props, { emit }) {
    const { app } = useContext()
    const { idea } = toRefs(props)

    // フォーム
    const observer = ref(null)
    const { menu } = false

    const isAddOpen = ref(false)
    const form = ref({
      title: '',
      body: ''
    })
    const loading = ref(false)

    // バリデーション
    const rules = ref({
      required: value => !!value || '必須項目です',
      length: value => (value && value.length <= 255) || '※255文字以内で入力してください'
    })

    watch(() => isAddOpen.value,
      (to, from) => {
        if (to === true && idea.value) {
          form.value.title = idea.value.title
          form.value.body = idea.value.body
        }
      },
      {
        immediate: true
      }
    )

    const post = async () => {
      if (observer.value.validate()) {
        loading.value = true
        await app.$axios.$post('/idea', form.value).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('登録しました')
          emitReload()
        }).catch((err) => {
          app.$error_toast(err, '登録に失敗しました')
          loading.value = false
        })
      }
    }

    const update = async () => {
      if (observer.value.validate()) {
        loading.value = true
        await app.$axios.$put('/idea/' + idea.value.id, form.value).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('更新しました')
          emitReload()
        }).catch((err) => {
          app.$error_toast(err, '更新に失敗しました')
          loading.value = false
        })
      }
    }

    const emitReload = () => {
      emit('reload')
    }

    const close = () => {
      isAddOpen.value = false
      observer.value.reset()
    }

    return {
      observer,

      isAddOpen,
      form,
      loading,
      rules,
      menu,

      post,
      update,
      close
    }
  }
})
</script>
