export default ({ app, $axios, $toast }) => {
  // ヘッダ
  $axios.setHeader('X-Requested-With', 'XMLHttpRequest')

  // リクエストログ
  $axios.onRequest((config) => {
  })
  // レスポンスログ
  $axios.onResponse((config) => {
    // console.log(config)
  })
  // エラーログ
  $axios.onError((e) => {
    const res = e.response
    // console.log(res)
    const status = res?.status ?? 500

    switch (status) {
      case 401:
        break
      case 422:
        app.$redirect_notice(res)
        break
      case 429:
        $toast.error('アクセス回数が多すぎたため、サーバーエラーが発生しました。<br />しばらく経ってから操作を行ってください。')
        break
      case 500:
        $toast.error('サーバーエラーが発生しました。<br />しばらく経ってから操作を行ってください。')
        break
      default:
        if (res.data?.message) {
          $toast.error(res.data.message)
        }
        break
    }
  })
}
