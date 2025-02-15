<template>
  <div>
    <v-card tag="section" class="mb-8" :color="$theme.card.color">
      <v-card-title class="headline">Settings</v-card-title>
    </v-card>

    <v-card
      tag="form"
      id="blueprints"
      class="section mb-8"
      :color="$theme.card.color"
      @submit.prevent="$store.dispatch('setSetting', {name: 'blueprints', value: enabledBlueprints})"
    >
      <v-card-title class="headline">Blueprints</v-card-title>

      <v-card-text :class="$theme.card.textSize" class="mb-4">
        <p>
          Blueprints provide additional features in Balance Buddy such as visualizations or forms.
          Some blueprints are enabled by default.
        </p>
        <v-row
          v-for="blueprint in $store.state.loadedBlueprints"
          :key="blueprint.id"
          class="py-0 d-flex justify-space-between align-center"
        >
          <v-col class="py-2" cols="8">
            <v-checkbox
              v-model="enabledBlueprints"
              :label="`${blueprint.label} · ${blueprint.title}`"
              :value="blueprint.id"
              hide-details
              class="mt-0"
              :ripple="false"
            ></v-checkbox>
          </v-col>
          <v-col class="py-2 text-right" cols="4">
            <v-btn
              v-if="blueprint.id.startsWith('builtin:')"
              small
              icon
              color="grey"
              :to="{name: 'BlueprintEditor', params: {id: blueprint.id}}"
              title="View"
            >
              <v-icon v-text="$icons.mdiEye"></v-icon>
            </v-btn>
            <v-btn
              v-else
              small
              icon
              color="grey"
              :to="{name: 'BlueprintEditor', params: {id: blueprint.id}}"
              title="View"
            >
              <v-icon v-text="$icons.mdiPencil"></v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="flex-d justify-space-between">
        <v-btn color="primary" type="submit">Save</v-btn>
        <router-link
          :to="{path: '/blueprint-editor'}"
        >
          Create a new blueprint
        </router-link>
      </v-card-actions>
    </v-card>

    <v-card
      tag="form"
      id="aliases"
      class="section mb-8"
      :color="$theme.card.color"
    >
      <v-card-title class="headline">Aliases</v-card-title>

      <v-card-text :class="$theme.card.textSize">
        <p>
          Aliases let you save and reuse search queries.
          For instance, you could set a <code>$dreams</code> alias in place of a
          <code>dream, dreamed, dreams, nightmare, nightmares</code> query.
        </p>
        <v-form>
          <alias-form
            v-for="alias in $store.state.settings.aliases"
            :key="alias._id"
            :alias="alias"
          />
          <alias-form
            :key="String(lastAliasesUpdate)"
            @created="lastAliasesUpdate = new Date(); trackEvent($store, 'alias.created')" />
        </v-form>
      </v-card-text>
    </v-card>
  
    <v-card
      tag="form"
      id="export"
      class="section mb-8"
      :color="$theme.card.color"
      @submit.prevent="exportData"
    >
      <v-card-title class="headline">Export data</v-card-title>
      <v-card-text :class="$theme.card.textSize">
        <p>Export selected data into a JSON file for backup and restore purpose.</p>
        <v-checkbox
          hide-details
          v-model="exportConfig.entries"
          label="Export diary notes"
          :ripple="false"
        ></v-checkbox>
        <v-checkbox
          hide-details
          v-model="exportConfig.board"
          label="Export tasks and board configuration"
          :ripple="false"
        ></v-checkbox>
        <v-checkbox
          hide-details
          v-model="exportConfig.blueprints"
          label="Export blueprints"
          :ripple="false"
        ></v-checkbox>
        <v-checkbox
          hide-details
          v-model="exportConfig.settings"
          label="Export Joyful PA settings"
          :ripple="false"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" type="submit">Export</v-btn>
      </v-card-actions>
    </v-card>
    <v-card
      tag="form"
      id="import"
      class="section mb-8"
      :color="$theme.card.color"
      @submit.prevent="importData"
    >
      <v-card-title class="headline">Import data</v-card-title>
      <v-card-text :class="$theme.card.textSize">
        <p>Import data from a previously generated Joyful PA JSON File. Existing notes and tasks will be kept.</p>
        <v-file-input accept=".json,application/json" label="JSON File" v-model="toImportFile"></v-file-input>
        <v-checkbox
          hide-details
          v-model="importConfig.entries"
          label="Import diary notes"
          :ripple="false"
        ></v-checkbox>
        <v-checkbox
          hide-details
          v-model="importConfig.board"
          label="Import tasks and board configuration"
          :ripple="false"
        ></v-checkbox>
        <v-checkbox
          hide-details
          v-model="importConfig.blueprints"
          label="Import blueprints"
          :ripple="false"
        ></v-checkbox>
        <v-checkbox
          hide-details
          v-model="importConfig.settings"
          label="Import Joyful PA settings"
          :ripple="false"
        ></v-checkbox>
        <v-textarea
          v-if="importLogs.length > 0"
          readonly
          :value="importLogs.join('\n')"
          auto-grow
        >
        </v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" type="submit" :disabled="!toImportFile">Import</v-btn>
      </v-card-actions>
    </v-card>

    <v-card tag="section" id="sync" class="mb-8" :color="$theme.card.color">
      <v-card-title class="headline">Syncing with other devices</v-card-title>

      <v-card-text :class="$theme.card.textSize">
        <p>Your diary can be synced with other devices using any <a href="https://couchdb.apache.org/">CouchDB server</a>. This is not provided as part of Joyful PA though, and you have to find or host one yourself.</p>
        <v-form>
          <v-text-field
            v-model="couchDbUrl"
            label="CouchDB URL"
            name="couchdb-url"
            placeholder="http://localhost:5984/Joyful PA"
            required
          ></v-text-field>
          <v-text-field
            v-model="couchDbUsername"
            label="CouchDB Username"
            name="couchdb-username"
            required
          ></v-text-field>
          <v-text-field
            :append-icon="showdbPassword ? $icons.mdiEye : $icons.mdiEyeOff"
            :type="showdbPassword ? 'text' : 'password'"
            name="couchdb-password"
            required
            label="CouchDB Password"
            v-model="couchDbPassword"
            class="input-group--focused"
            @click:append="showdbPassword = !showdbPassword"
          ></v-text-field>
          <v-btn
            class="mr-4"
            color="primary"
            @click="setupSync">
            Setup sync
          </v-btn>
          <span v-if="syncStatus">{{ syncStatus }}</span>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card tag="section" id="webhook" class="mb-8" :color="$theme.card.color">
      <v-card-title class="headline">Webhook</v-card-title>

      <v-card-text :class="$theme.card.textSize">
        <p>Notify an URL via a POST request when an entry is created, updated or deleted.</p>
          <v-text-field
            v-model="webhook.url"
            label="Webhook URL"
            name="webhookurl"
            type="url"
            required
          ></v-text-field>
        <v-btn
          class="mr-4"
          :disabled="!webhook.url"
          @click="triggerWebhook(webhook.url)">
          Send webhook now
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!webhook.url"
          @click="$store.dispatch('setWebhook', {url: webhook.url}); trackEvent($store, 'webhook.setup')">
          Save
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card v-if="telemetryServer" tag="section" id="telemetry" class="mb-8" :color="$theme.card.color">
      <v-card-title class="headline">Telemetry</v-card-title>

      <v-card-text :class="$theme.card.textSize">
        <p>
          Joyful PA collects some anonymous telemetry data.
          This data is very valuable for us as it helps us understand how people are using the application.
        </p>
        <p>
          We do not collect any personal information such as IP adresses, cookies, mood, notes, tasks or search queries.
          Telemetry data is hosted by Agate, in France, and 
          <a href="https://stats.agate.blue/tempo.agate.blue" _blank="true">
            available publicly for transparency.
          </a>
        </p>
        <p>You can opt-out from data collection using the switch below.</p>

        <v-switch
          v-model="telemetryEnabled"
          label="Send telemetry data"
          @change="updateTelemetry($event)"
        ></v-switch>
      </v-card-text>
    </v-card>

    <v-card tag="section" id="delete" class="mb-8" :color="$theme.card.color">
      <v-card-title class="headline">Delete your data</v-card-title>

      <v-card-text :class="$theme.card.textSize">
        <p>Delete all your data from Joyful PA.</p>
        <v-btn
          color="error"
          @click="deleteConfirm">
          Delete my data…
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import AliasForm from '@/components/AliasForm'

import {
  getNewEntryData,
  search,
  getBlueprints,
  getTasks,
  downloadFile,
  getSettings,
  bulkInsertAndUpdate,
  trackEvent
} from '@/utils'

async function importEntries(entries, db, logs) {
  entries = entries || []
  logs.push(`[info] Importing ${entries.length} notes...`)
  let result = await bulkInsertAndUpdate(entries, db)
  let success = result.filter((e) => {
    return e.ok
  }).length
  let failed = result.filter((e) => {
    return !e.ok
  }).length
  if (failed > 0) {
    logs.push(`[error] ${failed} notes failed to import`)
  }
  if (success > 0) {
    logs.push(`[info] ${success} notes imported successfully...`)
  }
  return result
}
async function importBoard(board, db, dispatch, logs) {
  if (!board || !board.settings) {
    return logs.push("[error] Invalid board configuration, skipping")
  }
  logs.push(`[info] Importing board configuration...`)
  await dispatch('boardConfig', board.settings)

  let tasks = board.tasks || []
  logs.push(`[info] Importing ${tasks.length} tasks...`)
  let result = await bulkInsertAndUpdate(tasks, db)
  let success = result.filter((e) => {
    return e.ok
  }).length
  let failed = result.filter((e) => {
    return !e.ok
  }).length

  if (failed > 0) {
    logs.push(`[error] ${failed} tasks failed to import`)
  }
  if (success > 0) {
    logs.push(`[info] ${success} tasks imported successfully...`)
  }
  return result
}


async function importSettings(settings, db, logs) {
  settings = settings || []
  logs.push(`[info] Importing ${settings.length} settings...`)
  let result = await bulkInsertAndUpdate(settings, db)
  let success = result.filter((e) => {
    return e.ok
  }).length
  let failed = result.filter((e) => {
    return !e.ok
  }).length
  if (failed > 0) {
    logs.push(`[error] ${failed} settings failed to import`)
  }
  if (success > 0) {
    logs.push(`[info] ${success} settings imported successfully...`)
  }
  return result
}


async function importBlueprints(blueprints, db, logs) {
  blueprints = blueprints || []
  blueprints = blueprints.filter(b => {
    return !b._id.startsWith('builtin:')
  })
  logs.push(`[info] Importing ${blueprints.length} blueprints...`)
  let result = await bulkInsertAndUpdate(blueprints, db)
  let success = result.filter((e) => {
    return e.ok
  }).length
  let failed = result.filter((e) => {
    return !e.ok
  }).length
  if (failed > 0) {
    logs.push(`[error] ${failed} blueprints failed to import`)
  }
  if (success > 0) {
    logs.push(`[info] ${success} blueprints imported successfully...`)
  }
  return result
}


export default {
  components: {
    AliasForm
  },
  data () {
    return {
      lastAliasesUpdate: new Date(),
      exportConfig: {
        entries: true,
        board: true,
        blueprints: true,
        settings: true,
      },
      importConfig: {
        entries: true,
        board: true,
        blueprints: true,
        settings: true,
      },
      enabledBlueprints: [...this.$store.state.settings.blueprints || []],
      importLogs: [],
      syncStatus: null,
      toImportFile: null,
      showdbPassword: false,
      couchDbUrl: this.$store.state.couchDbUrl,
      couchDbUsername: this.$store.state.couchDbUsername,
      couchDbPassword: this.$store.state.couchDbPassword,
      webhook: this.$store.state.settings.webhook || {
        url: '',
      },
      telemetryEnabled: this.$store.getters['settings'].telemetry,
      telemetryServer: process.env.VUE_APP_PLAUSIBLE_HOST,
      trackEvent,
    }
  },
  methods: {
    async exportData () {
      let data = {}
      if (this.exportConfig.entries) {
        data.entries = await search({
          store: this.$store,
          sortDesc: false,
          query: ''
        })
      }
      if (this.exportConfig.board) {
        data.board = {
          settings: this.$store.state.settings.boardConfig,
          tasks: await getTasks(this.$store, '')
        }
      }
      if (this.exportConfig.blueprints) {
        data.blueprints = await getBlueprints(this.$store)
      }
      if (this.exportConfig.settings) {
        let settings = await getSettings(this.$store)
        data.settings = settings.filter(s => {
          return s._id != "boardConfig"
        })
      }

      let d = (new Date()).toISOString().slice(0, 16)
      downloadFile(
        window,
        document,
        JSON.stringify(data),
        'application/json',
        `tempo_export_${d}.json`
      )
      trackEvent(this.$store, "data.exported")
    },
    async triggerWebhook (url) {
      await this.$store.dispatch("forceSync", {updateLastSync: true})
      let payload = {
        event: 'entry.created',
        entry: getNewEntryData('Hello there, this is a #test')
      }
      await this.$store.dispatch('triggerWebhook', {url, payload})
    },
    async importData () {
      this.importLogs = []
      if (!this.toImportFile) {
        console.log('No file to import')
        return
      }
      this.importLogs.push("[info] Loading file...")
      let text = await this.toImportFile.text()
      this.importLogs.push("[info] Parsing file...")
      let data = JSON.parse(text)
      if (this.importConfig.entries ){
        await importEntries(data.entries, this.$store.state.db, this.importLogs)
      }
      if (this.importConfig.board ){
        await importBoard(data.board, this.$store.state.db, this.$store.dispatch, this.importLogs)
      }
      if (this.importConfig.blueprints ){
        await importBlueprints(data.blueprints, this.$store.state.db, this.importLogs)
      }
      if (this.importConfig.settings ){
        await importSettings(data.settings, this.$store.state.db, this.importLogs)
        await this.$store.dispatch("loadSettings")
      }
      this.importLogs.push(`[info] Import complete!`)
      trackEvent(this.$store, "data.imported")
    },
    deleteConfirm () {
      if (confirm("This will remove all your notes. This action is irreversible.")) {
        this.$store.dispatch('reset')
        this.importedEntries = 0
        this.failedEntries = 0
        trackEvent(this.$store, "data.deleted")
      }
    },
    async setupSync () {
      this.syncStatus = "Checking sync..."
      try {
        await this.$store.dispatch(
          'setupSync', {
            url: this.couchDbUrl,
            username: this.couchDbUsername,
            password: this.couchDbPassword
          }
        )
        this.syncStatus = `Sync OK!`
        trackEvent(this.$store, "sync.setup")
      } catch (e) {
        this.syncStatus = `Error: ${e.name || e}`
      }
    },
    async updateTelemetry (v) {
      if (!v) {
        trackEvent(this.$store, "telemetry.disabled")
      }
      await this.$store.dispatch("setSetting", {name: "telemetry", value: v})
    }
  }
}
</script>
