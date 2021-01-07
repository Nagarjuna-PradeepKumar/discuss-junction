export default {
  methods: {
    joinchamber: function(chamberid) {
      if (this.$socket && this.$socket.connected) {
        if (this.$store.state.activechambers.length < 3) {
          this.$socket.emit("joinroom", {
            chamber_id: chamberid,
            name: this.$store.state.user_name,
            user_id: this.$store.state.userid,
          });
        } else {
          this.$store.dispatch("alertdialog", {
            show: true,
            type: "yellow darken-2",
            title: "Warning !",
            message: "Cannot join more than three chambers at a time",
            buttontext: "ok",
          });
        }
      } else {
        this.$store.dispatch("alertdialog", {
          show: true,
          type: "yellow darken-2",
          title: "Warning !",
          message: "You are not online",
          buttontext: "ok",
        });
      }
    },
  },
  computed: {
    isonline: function() {
      console.log("as")
      return this.$store.state.isonline;
    },
  },
};
