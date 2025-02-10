<template>
  <v-app id="balance-buddy" dark>
    <v-app-bar app dense :color="$theme.appBar.color">
      <v-spacer></v-spacer>
      <v-toolbar-title @click="$store.commit('searchQuery', ''); $router.push('/')" class="mr-4" style="cursor: pointer">
        Balance Buddy
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-btn exact to="/diary" title="Diary">
        <v-icon v-text="$icons.mdiBook"></v-icon>
        <span class="ml-2">Diary</span>
      </v-btn>
      <v-btn exact to="/diary/calendar" title="Calendar">
        <v-icon v-text="$icons.mdiCalendar"></v-icon>
        <span class="ml-2">Calendar</span>
      </v-btn>
      <v-btn exact to="/diary/visualization" title="Data">
        <v-icon v-text="$icons.mdiChartTimelineVariant"></v-icon>
        <span class="ml-2">Data</span>
      </v-btn>
      <v-btn exact to="/tasks" title="Tasks">
        <v-icon v-text="$icons.mdiCheck"></v-icon>
        <span class="ml-2">Tasks</span>
      </v-btn>
      <v-btn v-if="$store.getters.pages.length > 0" to="/pages" title="Custom pages">
        <v-icon v-text="$icons.mdiBookOpenPageVariantOutline"></v-icon>
      </v-btn>
      <v-btn to="/about" title="About">
        <v-icon v-text="$icons.mdiHelpCircleOutline"></v-icon>
      </v-btn>
      <v-btn to="/settings" title="Settings">
        <v-icon v-text="$icons.mdiCog"></v-icon>
      </v-btn>
      
      <v-btn
        :loading="$store.state.sync.loading"
        icon
        @click.stop.prevent="$store.dispatch('forceSync', {updateLastSync: true})"
        v-if="$store.state.couchDbUrl"
        title="Sync"
      >
        <v-icon v-text="$icons.mdiSync"></v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-main>
      <v-container fluid tag="main" style="padding-bottom: 64px">
        <router-view ref="view"></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  async created() {
    this.$store.dispatch('loadSettings');
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (this.$store.state.serviceWorker.refreshing) return;
        this.$store.commit("serviceWorker", { refreshing: true });
        window.location.reload();
      });
    }
  },
  mounted() {
    let self = this;
    window.onclick = function(e) {
      var className = "internal-link";
      if (e.target.localName == "a" && e.target.classList.contains(className)) {
        e.preventDefault();
        self.$store.commit('searchQuery', e.target.getAttribute("data-query"));
      }
    };
  },
  computed: {
    bottomNavBarButtonStyle() {
      return 'height: 56px; background: transparent;';
    }
  },
  methods: {
    updateApp() {
      this.$store.commit("serviceWorker", { updateAvailable: false });
      if (
        !this.$store.state.serviceWorker.registration ||
        !this.$store.state.serviceWorker.registration.waiting
      ) {
        return;
      }
      this.$store.state.serviceWorker.registration.waiting.postMessage({
        command: "skipWaiting",
      });
    },
    scrollToTop() {
      window.scrollTo(0,0);
    },
  },
  watch: {
    "$store.state.searchQuery": {
      handler(v) {
        this.searchQuery = v;
        this.$router.push({ path: this.$route.path, query: { ...this.$route.query, q: v }});
      }
    }
  }
};
</script>

<style lang="scss">
html {
  scroll-behavior: smooth;
}
.theme--dark.v-application {
  background-image: linear-gradient(100deg, #0B3040, #515452);
}
.container.narrow {
  max-width: 600px;
}
section.v-card:not(.fluid), .section.v-card:not(.fluid) {
  max-width: 600px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
.rendered-markdown {
  font-size: 110%;
  line-height: 1.5;
}
.rendered-markdown > * {
  margin-bottom: 21px;
}
#composer {
  max-height: 600px;
  overflow-y: auto;
}
.board {
  display: flex;
  overflow-x: auto;
}
</style>
