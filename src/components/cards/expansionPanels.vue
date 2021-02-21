<template>
  <!-- Expansion Panel option -->
  <div>
    <v-card-title>LCT Public Spaces</v-card-title>
    <v-card-subtitle
      >Community: {{ nsp }} Visitor: {{ nickName }}</v-card-subtitle
    >

    <v-card-actions>
      <v-btn @click="usePanels = !usePanels">A/B test</v-btn>

      <v-spacer></v-spacer>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="!selectedSpace || !nickName"
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            @click="save"
          >
            Log visit:
            {{ selectedSpace }}
          </v-btn>
        </template>
        <span>Send your visit to the server</span>
      </v-tooltip>
    </v-card-actions>

    <expansion-panels v-model="panelState" multiple popout dark>
      <!-- Favorites -->
      <v-expansion-panel>
        <v-expansion-panel-header color="primary lighten-3" dark>
          Your Favorite Spaces
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list flat dense>
            <v-list-item-group v-model="favorite">
              <v-list-item v-for="(item, i) in favorites" :key="i">
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Local Spaces -->
      <v-expansion-panel>
        <v-expansion-panel-header color="primary lighten-3" dark>
          Your Local Spaces
        </v-expansion-panel-header>

        <!-- Spaces -->
        <v-expansion-panel-content>
          <v-card-text>
            <v-select
              v-model="categorySelected"
              :items="categoryLabels"
              item-text="label"
              item-value="NAME"
              return-object
              label="Category"
              hint="We group public spaces by these categories."
              persistent-hint
              @change="onChangeCategory"
            ></v-select>
            <v-autocomplete
              v-model="selectedSpace"
              :items="filteredSpaces"
              :filter="customFilter"
              color="white"
              item-text="room"
              label="Room"
              clearable
            ></v-autocomplete>
          </v-card-text>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Ad Hoc visits -->
      <v-expansion-panel>
        <v-expansion-panel-header color="primary lighten-3" dark>
          Your Spontaneous Spaces
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card-text>
            <v-card-subtitle
              >Spontaneous spaces are unstructured gatherings. Examples of
              deliberate public gatherings include rallies, raves, and group
              hikes. Examples of accidental gatherings are waiting for a bus,
              train, or plane. A common example includes sharing a ride in a
              vehicle.</v-card-subtitle
            >
            <v-bottom-sheet v-model="sheet" inset>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark v-bind="attrs" v-on="on" block>
                  Add such a gathering...
                </v-btn>
              </template>

              <v-sheet class="text-center" height="200px">
                <v-card-text>
                  <v-text-field
                    v-model="selectedSpace"
                    label="Identify the gathering"
                    hint="Use a name others in the gathering would use"
                    persistent-hint
                    clearable
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    class="mt-6"
                    text
                    color="error"
                    @click="sheet = !sheet"
                  >
                    Done
                  </v-btn>
                  <v-btn class="mt-6" text color="error" @click="cancel">
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-sheet>
            </v-bottom-sheet>
          </v-card-text>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </expansion-panels>
    -->
  </div>
</template>
