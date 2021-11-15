<script>
import CommentItem from "@/components/restaurant/comment/item";
import { storeActions } from "@/store/actions.constants";

export default {
  name: "restaurant-value",
  components: {
    CommentItem,
  },
  data: function() {
    return {
      id: this.$route.params.id,
      comments: [],
      page: 1,
      disable: false,
    };
  },
  methods: {
    getComments() {
      this.$store
        .dispatch(`review/${storeActions.getAllReviews}`, {
          restaurantId: this.id,
          params: { page: this.page++ },
        })
        .then((res) => {
          let { docs, ...meta } = res.data;
          this.comments = [...this.comments, ...docs];
          this.disable = !meta.hasNextPage;
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
<template>
  <v-container
    ><comment-item
      :comment="comment"
      v-for="comment in comments"
      :key="comment._id"
      @reloadNow="
        () => {
          comments = [];
          disable = false;
          page = 1;
        }
      "
    ></comment-item>
    <scroll-loader :loader-method="getComments" :loader-disable="disable">
    </scroll-loader> </v-container
></template>
