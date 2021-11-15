<template>
  <v-scroll-y-transition>
    <v-container
      @click="
        $router.push({ name: 'Restaurant By Id', params: { id: card._id } })
      "
    >
      <v-card>
        <v-img class="white--text" height="200px" :src="photo">
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
                        @reloadNow="$emit('reloadNow')"
                        :card="card"
                      ></edit-dialog>
                      <v-list-item @click="deleteItem()">
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
          > -->
                  <v-rating
                    v-model="rating"
                    readonly
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    half-increments
                    hover
                  ></v-rating>
                  <div class="caption">({{ rating.toFixed(1) }})</div>
                </v-row>
                <v-row
                  ><v-icon>mdi-map-marker</v-icon>
                  <div class="subtitle-1">{{ location }}</div></v-row
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
          <BookingDialog :card="card" />
          <v-spacer></v-spacer>
          <v-dialog v-model="reviewPopUp" width="400">
            <template v-slot:activator="{ on }">
              <v-btn
                outlined
                @click.stop="
                  ratingToSubmit = null;
                  commentToSubmit = null;
                  dateToSubmit = null;
                "
                v-on="on"
                slot="activator"
                >Review
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <h2>Review for {{ name }}</h2>
              </v-card-title>

              <v-card-text>
                <v-form ref="review">
                  <v-row>
                    <v-rating
                      v-model="ratingToSubmit"
                      color="yellow darken-3"
                      background-color="grey darken-1"
                      half-increments
                      hover
                    ></v-rating>
                  </v-row>
                  <v-row>
                    <v-textarea
                      label="Review"
                      v-model="commentToSubmit"
                      rows="1"
                      auto-grow
                    ></v-textarea>
                  </v-row>
                  <v-row
                    ><v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateToSubmit"
                          label="Date of Visit"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="dateToSubmit"
                        @input="menu2 = false"
                      ></v-date-picker> </v-menu
                  ></v-row>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="reviewPopUp = false" color="error">Cancel</v-btn>
                <v-btn
                  @click="$refs.review.validate() ? createReview() : null"
                  color="success"
                  >Submit</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- <v-btn icon @click.stop="show = !show">
            <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
          </v-btn> -->
        </v-card-actions>

        <v-slide-y-transition>
          <!-- <v-card-text v-show="show">
            <div>{{ comment.content }}</div>
          </v-card-text> -->
        </v-slide-y-transition>
      </v-card>
    </v-container>
  </v-scroll-y-transition>
</template>
<script>
// import { find, isEmpty } from "lodash-es";
import { mapGetters } from "vuex";
import EditDialog from "@/components/restaurant/edit";
import BookingDialog from "@/components/restaurant/booking/card";
import { storeActions } from "@/store/actions.constants";
export default {
  name: "restaurant-item",
  components: {
    EditDialog,
    BookingDialog,
  },
  props: {
    card: Object,
  },
  data() {
    return {
      menu2: false,
      reviewPopUp: false,
      show: false,
      name: this.card.name || "KFC",
      location: this.card.location || "Hyderabad",
      rating: this.card.rating,
      link: this.card.link || "#",
      description: this.card.description || "description",
      photo: this.card.img || this.getPhotoUrl(),
      ratingToSubmit: null,
      dateToSubmit: null,
      commentToSubmit: null,
    };
  },
  computed: {
    ...mapGetters("user", ["isAdmin"]),
  },
  mounted() {
    // this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
    //   text: `${"checking"}`,
    //   timeout: 1000,
    //   color: "success",
    // });
  },
  methods: {
    deleteItem() {
      this.$store
        .dispatch(`restaurant/${storeActions.deleteRestaurant}`, {
          id: this.card._id,
        })
        .then((res) => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: res.data.message,
            timeout: 3000,
            color: "success",
          });
          this.addPopUp = false;
          this.$emit("reloadNow");
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
    createReview() {
      this.$store
        .dispatch(`review/${storeActions.createReview}`, {
          restaurantId: this.card._id,
          data: {
            rating: this.ratingToSubmit,
            dateVisit: this.dateToSubmit,
            comment: this.commentToSubmit,
          },
        })
        .then((res) => {
          this.$store.dispatch(`snackbar/${storeActions.setSnackbarText}`, {
            text: res.data.message,
            timeout: 3000,
            color: "success",
          });
          this.$emit("reloadNow");
          this.reviewPopUp = false;
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
    getPhotoUrl() {
      //   const cardsDefault = find(this.card.photos, (o) => o.default).url;

      //   if (isEmpty(cardsDefault)) {
      return `https://via.placeholder.com/500x200.png?text=No+Image!`;
      //   } else {
      //     return cardsDefault;
      //   }
    },
  },
};
</script>
