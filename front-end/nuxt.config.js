export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  
  server: { 
    port: process.env.NODE_ENV === 'development' ? 3000 : 3500
    //port: 4000
  },

  /*env: {
    baseURL: process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'http://localhost:4000'
  },*/

publicRuntimeConfig: {
    myVariable: process.env.NODE_ENV || '',
    
 },



  head: {
    title: 'tech-system-web',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
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
    { src: "~plugins/vue-tables-2.js", ssr: false },
    { src: "~plugins/vue-context.js", ssr: false },
    { src: "~plugins/vue-clickaway.js", ssr: false },
    { src: "~plugins/v-viewer.js", ssr: false },
    { src: "~plugins/vuedraggable.js", ssr: false },
    { src: "~plugins/vue-multiselect.js", ssr: false },
    { src: "~plugins/vue-google-charts", ssr: false},
    { src: "~plugins/vue-search-select", ssr: false}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/bootstrap-vue',
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/login', method: 'post', propertyName: 'token' },
          logout: { url: '/' },
          user: { url: '/auth/user', method: 'get', propertyName: 'user' },
          home: '/home'
        },
        tokenRequired: true,
        tokenType: ''
      }
    }
  },

  axios: {
    baseURL: (process.env.NODE_ENV === 'development') ?  'http://localhost:2000'  : 'http://localhost:3001', // Used as fallback if no runtime config is provided 'http://localhost:3001' http://it-foundry:3001
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ['vue-tables-2', "v-viewer"],
    transpile: ["vee-validate/dist/rules","vue-context","vue-clickaway","v-viewer", "vuedraggable","vue-multiselect","vue-google-charts"],
  }
}

