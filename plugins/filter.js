import Vue from 'vue'

export default ({ app }) => {
  Vue.filter('date_format_jpn', function (value) {
    if (!value) { return null }
    return app.$dayjs(value).format('YYYY年MM月DD日')
  })

  Vue.filter('datetime_format', function (value) {
    if (!value) { return null }
    return app.$dayjs(value).format('YYYY/MM/DD HH:mm')
  })

  Vue.filter('short_datetime_format', function (value) {
    if (!value) { return null }
    return app.$dayjs(value).format('MM/DD HH:mm')
  })

  Vue.filter('mb_substr', function (str, length) {
    const begin = 0
    const end = length
    let ret = ''
    for (let i = 0, len = 0; i < str.length; i++, len++) {
      const upper = str.charCodeAt(i)
      const lower = str.length > (i + 1) ? str.charCodeAt(i + 1) : 0
      let s = ''
      if (isSurrogatePear(upper, lower)) {
        i++
        s = String.fromCharCode(upper, lower)
      } else {
        s = String.fromCharCode(upper)
      }
      if (begin <= len && len < end) { ret += s }
    }
    if (str.length > length) { ret += '...' }
    return ret
  })

  function isSurrogatePear (upper, lower) {
    return upper >= 0xD800 && upper <= 0xDBFF && lower >= 0xDC00 && lower <= 0xDFFF
  }
}
