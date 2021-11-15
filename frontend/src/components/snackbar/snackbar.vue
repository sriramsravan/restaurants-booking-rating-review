<template>
  <v-snackbars :objects.sync="objects"></v-snackbars>
</template>

<script>
import VSnackbars from "v-snackbars";
export default {
  components: {
    "v-snackbars": VSnackbars,
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === `snackbar/setSnackbarText`) {
        this.objects.push({
          message: state.snackbar.snackbarText,
          color: state.snackbar.color, // success,error,warning,
          timeout: state.snackbar.timeout,
        });
      }
    });
  },
  data() {
    return {
      objects: [],
    };
  },
};
</script>
