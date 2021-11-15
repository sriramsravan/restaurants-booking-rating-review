<template>
  <v-container>
    <v-card>
      <v-img class="white--text" height="200px" :src="img">
        <v-container fill-height fluid class="card-edit">
          <v-layout fill-height>
            <v-flex xs12 align-end flexbox>
              <v-row v-if="isAdmin">
                <v-spacer></v-spacer>
                <v-menu bottom right>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" dark icon>
                      <v-icon>mdi-dots-horizontal-circle-outline</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <edit-dialog
                      @reloadNow="getById"
                      :card="{
                        _id: this.id,
                        name: this.name,
                        location: this.location,
                        description: this.description,
                        img: this.img,
                      }"
                    ></edit-dialog>
                    <v-list-item @click="deleteItem">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
            </v-flex>
          </v-layout>
        </v-container>
      </v-img>

      <v-card-title>
        <v-container fill-height fluid>
          <v-layout fill-height>
            <v-flex xs12 flexbox>
              <v-row>
                <div class="h6">{{ name }}</div>
                <v-spacer></v-spacer>
                <!-- <span class="grey--text">rating: {{ rating }}</span
          > --><v-icon>mdi-map-marker</v-icon>
                <div class="subtitle-1">{{ location }}</div> </v-row
              ><v-row
                ><v-spacer></v-spacer>
                <div class="caption">Highest Rating</div>

                <v-rating
                  v-model="highRating"
                  readonly
                  label="Highest Rating"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  half-increments
                  hover
                ></v-rating>
                <div class="caption">
                  ({{ highRating.toFixed(1) || 0 }})
                </div></v-row
              >
              <v-row
                ><v-spacer></v-spacer>
                <div class="caption">Overall Rating</div>

                <v-rating
                  v-model="rating"
                  readonly
                  label="Average Rating"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  half-increments
                  hover
                ></v-rating>
                <div class="caption">({{ rating.toFixed(1) || 0 }})</div></v-row
              >

              <v-row
                ><v-spacer></v-spacer>
                <div class="caption">Lowest Rating</div>

                <v-rating
                  v-model="lowRating"
                  readonly
                  label=""
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  half-increments
                  hover
                ></v-rating>
                <div class="caption">
                  ({{ lowRating.toFixed(1) || 0 }})
                </div></v-row
              >
              <v-row><div class="subtitle-2">Description</div></v-row>
              <v-row
                ><div class="caption">
                  {{ description }}
                </div></v-row
              >
            </v-flex></v-layout
          >
        </v-container>
      </v-card-title>

      <v-card-actions>
        <v-btn @click.stop="show = !show" text color="purple">Comments</v-btn>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="show = !show">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-slide-y-transition>
        <v-card-text v-show="show">
          <comments></comments>
        </v-card-text>
      </v-slide-y-transition>
    </v-card>
  </v-container>
</template>
<script>
// import { find, isEmpty } from "lodash-es";
// import { mapGetters } from "vuex";
import Comments from "@/components/restaurant/comments";
import { storeActions } from "@/store/actions.constants";
import { mapGetters } from "vuex";
import EditDialog from "@/components/restaurant/edit";

export default {
  name: "restaurant-value",
  components: {
    Comments,
    EditDialog,
  },
  props: {
    card: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  data() {
    return {
      show: false,
      id: this.$route.params.id,
      name: null,
      location: null,
      rating: 0,
      img: null,
      highRating: 0,
      lowRating: 0,
      description: null,
    };
  },
  computed: {
    ...mapGetters("user", ["isAdmin"]),
  },
  mounted() {
    this.getById();
  },
  methods: {
    deleteItem() {
      this.$store
        .dispatch(`restaurant/${storeActions.deleteRestaurant}`, {
          id: this.id,
        })
        .then((res) => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: res.data.message,
            timeout: 3000,
            color: "success",
          });
          this.$router.go(-1);
        })
        .catch((err) => {
          console.log(err);
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: err.response.data.message,
            timeout: 3000,
            color: "error",
          });
        });
    },
    getById() {
      this.$store
        .dispatch(`restaurant/${storeActions.getByIdRestaurant}`, {
          id: this.id,
        })
        .then((res) => {
          this.data = res.data;
          Object.keys(res.data).forEach((key) => {
            this[key] = res.data[key];
          });
        })
        .catch((err) => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: err.response.data.message,
            timeout: 3000,
            color: "error",
          });
        });
    },
  },
};
</script>
