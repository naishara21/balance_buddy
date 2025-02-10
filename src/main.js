import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { VuePlausible } from 'vue-plausible'

Vue.config.productionTip = false


// three shaking icons to reduce bundle size
import {
  mdiArrowLeft,
  mdiBook,
  mdiBookOpenPageVariantOutline,
  mdiCalendar,
  mdiChartTimelineVariant,
  mdiCheck,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronUp,
  mdiClock,
  mdiClockOutline,
  mdiClose,
  mdiCog,
  mdiContentCopy,
  mdiDelete,
  mdiDeleteOutline,
  mdiDotsHorizontal,
  mdiDownload,
  mdiEye,
  mdiEyeOff,
  mdiFormatListBulleted,
  mdiHeart,
  mdiHeartOutline,
  mdiHelpCircleOutline,
  mdiMagnify,
  mdiMenuDown,
  mdiPencil,
  mdiPlus,
  mdiReply,
  mdiReplyOutline,
  mdiSend,
  mdiSync,
  mdiTrashCan,
} from '@mdi/js'

Vue.prototype.$icons = {
  mdiArrowLeft,
  mdiBook,
  mdiBookOpenPageVariantOutline,
  mdiCalendar,
  mdiChartTimelineVariant,
  mdiCheck,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronUp,
  mdiClock,
  mdiClockOutline,
  mdiClose,
  mdiCog,
  mdiContentCopy,
  mdiDelete,
  mdiDeleteOutline,
  mdiDotsHorizontal,
  mdiDownload,
  mdiEye,
  mdiEyeOff,
  mdiFormatListBulleted,
  mdiHeart,
  mdiHeartOutline,
  mdiHelpCircleOutline,
  mdiMagnify,
  mdiMenuDown,
  mdiPencil,
  mdiPlus,
  mdiReply,
  mdiReplyOutline,
  mdiSend,
  mdiSync,
  mdiTrashCan,
}

Vue.prototype.$theme = {
  appBar: {
    color: "#011627",
  },
  card: {
    color: "#011627",
    textSize: "body-1",
  },
  nestedCard: {
    color: "#011627",
    textSize: "body-2",
  },
  drawer: {
    color: "dark blue",
  },
  menu: {
    color: "dark blue",
  },
  switch: {
    color: "blue",
  },
  input: {
    color: "dark blue",
  },
  mainButton: {
    color: "dark blue",
  },
}
if (process.env.VUE_APP_PLAUSIBLE_HOST) {
  let options = {
    apiHost: process.env.VUE_APP_PLAUSIBLE_HOST,
    hashMode: true,
    enableAutoPageviews: false,
    trackLocalhost: process.env.VUE_APP_PLAUSIBLE_TRACK_LOCALHOST == "true" ? true : false,
  }
  if (process.env.VUE_APP_DOMAIN) {
    options.domain = process.env.VUE_APP_DOMAIN
  }
  Vue.use(VuePlausible, options)
}
new Vue({
  router,
  store,
  render: h => h(App),
  vuetify,

  beforeCreate() {
    window.document.getElementById('app-shell').remove()
    this.$store.commit('loadCachedState')
    this.$store.commit('initDb')
    this.$store.dispatch(
      'setupSync',
      {
        url: this.$store.state.couchDbUrl,
        username: this.$store.state.couchDbUsername,
        password: this.$store.state.couchDbPassword,
      }
      )
  }
}).$mount('#app')
