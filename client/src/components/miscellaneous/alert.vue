<template>
  <v-dialog v-model="dialogmessage.show" max-width="500px">
    <v-card>
      <v-card-title
        v-bind:class="dialogmessage.type"
        class="headline lighten-2"
      >{{ dialogmessage.title }}</v-card-title>
      <p class="pt-6 text-center">{{dialogmessage.message}}</p>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" @click="closedialog">{{dialogmessage.buttontext}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "dialogbox",
  computed: {
    dialogmessage() {
      return this.$store.state.dialogdata;
    }
  },
  methods: {
    closedialog: function() {
      this.$store.dispatch("alertdialog", {
        show: false,
        type: "",
        title: "",
        message: "",
        buttontext: ""
      });
    }
  }
};
</script>