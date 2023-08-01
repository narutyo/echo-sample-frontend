import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - echo-sample-frontend',
    title: 'echo-sample-frontend',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/axios.js',
    '~plugins/filter.js',
    '~plugins/dayjs.js',
    '~plugins/utils.js',
    { src: '~plugins/errorToast.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/laravel-echo',
    '@nuxtjs/dotenv',
    '@nuxtjs/toast'
  ],

  echo: {
    broadcaster: 'socket.io',
    host: process.env.ECHO_URL
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      font: false
    },
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue,
          secondary: '#304156',
          success: colors.green,
          danger: colors.red,
          warning: colors.deepOrange,
          info: colors.indigo,

          dark: '#242939',

          background: '#f2f3f8'
        },
        dark: {
          primary: colors.blue,
          secondary: '#304156',
          success: colors.green,
          danger: colors.red,
          warning: colors.deepOrange,
          info: colors.indigo
        }
      }
    }
  },
  toast: {
    position: 'top-right',
    duration: 5000
  },

  publicRuntimeConfig: {
    axios: {
      proxy: true
    },
    proxy: {
      '/': process.env.API_URL_BROWSER
    },
    homeUrl: process.env.FRONTEND_URL,
    siteTitle: process.env.TITLE,
    fetchUrl: process.env.FETCH_URL
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.API_URL
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
