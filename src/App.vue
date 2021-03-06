<template>
  <v-app>
    <v-app-bar app color="primary" dense dark>
      <v-row align="center" justify="space-between" dense>
        <v-col>
          <v-btn width="48" height="48" color="primary" text>
            <soteria-icon />
          </v-btn>
          <a
            class="white--text"
            href="https://soteriainstitute.org/safe-in-sisters/"
            target="_blank"
            rel="noopener"
            style="text-decoration: none"
            ><small>Soteria Institute</small></a
          >
        </v-col>

        <v-col cols="auto"
          ><v-card-title class="d-sm-none">LCT</v-card-title>
          <v-card-title class="d-sm-inline d-none">
            Local Contact Tracing</v-card-title
          >
        </v-col>
      </v-row>
    </v-app-bar>
    <v-snackbar
      centered
      :value="updateExists"
      :timeout="-1"
      color="primary darken-1"
      vertical
    >
      An update is available. This will have no effect on your stored data. It
      will, however, keep your LCT in sync with the server.

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="refreshApp">
          Update
        </v-btn>
      </template>
    </v-snackbar>
    <v-main> <Visitor /> </v-main>

    <v-footer v-if="false" color="primary lighten-1" padless>
      <v-layout justify-center wrap align-center>
        <v-btn
          v-for="link in links"
          :key="`${link.label}-footer-link`"
          color="white"
          text
          rounded
          class="mx-2"
          :to="link.url"
          >{{ link.label }}</v-btn
        >

        <v-flex
          prepend-icon="mdi-tm"
          primary
          lighten-2
          py-2
          text-center
          white--text
          xs12
        >
          <v-row no-gutters justify="space-between">
            <v-col>
              <small> Patron: <strong>Secours.io</strong></small>
            </v-col>
            <v-col>
              <small>Build {{ build }}</small>
            </v-col>

            <v-col>
              <small>
                &copy; {{ new Date().getFullYear() }} —
                <strong>Soteria.id</strong></small
              >
            </v-col>
          </v-row>
        </v-flex>
      </v-layout>
    </v-footer>

    <v-app-bar bottom dense app color="primary" dark>
      <v-row align="center" dense justify="space-between">
        <v-col class="text-left"
          ><small>{{ this.$socket.io.uri }}</small></v-col
        >
        <v-col class="text-right">
          <small>V {{ build }} </small>
        </v-col>
      </v-row>
    </v-app-bar>
  </v-app>
</template>

<script>
import Visitor from './components/Visitor.vue';
import update from '@/mixins/update.js';
import helpers from '@/mixins/helpers.js';

export default {
  name: 'App',

  components: { Visitor },
  computed: {
    build() {
      return this.$store.getters.appVersion;
    },
    inDevelopment() {
      return process.env.NODE_ENV == 'development';
    },
  },

  data: () => ({
    routes: ['room'],
    socketInfo: '',
    socketUri: 'Cannot connect to server.',
    rating: 3,
    links: [
      {
        label: 'Room',
        url: '/room',
      },
    ],
  }),

  methods: {
    socketUrl() {
      if (this.$socket.io.opts.query) {
        const { id, nsp } = this.$socket.io.opts.query;
        this.socketInfo = `${id}`;
        const uri = this.$socket.io.uri;
        const url = uri.endsWith('/')
          ? `${uri}${nsp ? nsp : ''}`
          : `${uri}/${nsp ? nsp : ''}`;
        return url;
      }
    },
  },
  sockets: {
    // socket.io reserved events
    connect() {
      // wait until a real Room connection or Visitor connection shows up
      if (this.$socket.io.opts.query) {
        const { id, nsp } = this.$socket.io.opts.query;
        this.socketInfo = `${id}`;
        const uri = this.$socket.io.uri;
        const url = uri.endsWith('/')
          ? `${uri}${nsp ? nsp : ''}`
          : `${uri}/${nsp ? nsp : ''}`;
        this.socketUri = url;
      }
    },
    disconnect() {
      this.socketUri = `Disconnected`;
    },
  },

  mixins: [update, helpers],

  async mounted() {
    console.log('App.vue mounted');
  },
};
</script>
