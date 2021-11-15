<template>
  <v-container>
    <v-layout fill-height>
      <v-flex xs12 flexbox>
        <v-row>
          <div class="h6">
            {{ `${comment.user.LName} ${comment.user.FName}` }}
          </div>
          <v-spacer></v-spacer>
          <v-rating
            v-model="comment.rating"
            readonly
            color="yellow darken-3"
            background-color="grey darken-1"
            small
            half-increments
            hover
          ></v-rating
        ></v-row>
        <v-row
          ><div class="caption">
            {{ comment.comment }}
          </div>
          <v-spacer></v-spacer>
          <div class="caption">Date.of Visit {{dateToSubmit}}</div>
          <v-spacer></v-spacer>

          <v-dialog v-model="reviewPopUp" width="400">
            <template v-slot:activator="{ on }">
              <v-icon v-if="isAdmin" small v-on="on">mdi-pencil-outline</v-icon>
            </template>
            <v-card>
              <v-card-title>
                <h2>Update Review</h2>
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
                    ></v-textarea> </v-row
                  ><v-row
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
                  @click="$refs.review.validate() ? updateReview() : null"
                  color="success"
                  >Submit</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-icon v-if="isAdmin" small color="red" @click="deleteItem"
            >mdi-delete-sweep</v-icon
          >
        </v-row>
      </v-flex></v-layout
    ></v-container
  >
</template>
<script>
import { storeActions } from "@/store/actions.constants";
import { mapGetters } from "vuex";
function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return `${year}-${month}-${day}`;
}

export default {
  props: ["comment"],
  data: function() {
    return {
      ratingToSubmit: this.comment.rating,
      commentToSubmit: this.comment.comment,
      dateToSubmit: getFormattedDate(new Date(this.comment.dateVisit)),
      reviewPopUp: false,
      menu2: false,
    };
  },
  computed: {
    ...mapGetters("user", ["isAdmin"]),
  },
  methods: {
    deleteItem() {
      this.$store
        .dispatch(`review/${storeActions.deleteReview}`, {
          id: this.comment._id,
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
    updateReview() {
      this.$store
        .dispatch(`review/${storeActions.updateReview}`, {
          restaurantId: this.$route.params.id,
          id: this.comment._id,
          data: {
            dateVisit: this.dateToSubmit,
            rating: this.ratingToSubmit,
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
  },
};
</script>
