export default ({ app }, inject) => {
  const errorToast = function (err, message = null) {
    const excludes = [429, 500] // axiosでtoast標示するエラーコードは除外
    if (!excludes.includes(err?.status)) {
      if (err.response.data?.message) {
        app.$toast.error(err.response.data.message)
      } else if (message !== null) {
        app.$toast.error(message)
      }
    }
  }
  inject('error_toast', errorToast)
}
