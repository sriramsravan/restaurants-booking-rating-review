<template>
  <v-app app>
    <router-view />
    <snackbar></snackbar>
  </v-app>
</template>
<script>
import snackbar from "@/components/snackbar/snackbar.vue";
export default {
  components: {
    snackbar: snackbar,
  },
};
</script>
