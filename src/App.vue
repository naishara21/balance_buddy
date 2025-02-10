<template>
  <v-app id="balance-buddy" dark>
    <v-app-bar
      app
      dense
      :color="$theme.appBar.color">
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
      <v-container fluid tag="main">
        <router-view ref="view"></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>
