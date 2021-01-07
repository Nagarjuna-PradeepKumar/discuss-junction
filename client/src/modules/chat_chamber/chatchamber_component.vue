<template>

  <v-container v-if="joinedchambers.length===0" class="mt-10">
    <v-row justify="center">
      <v-img :src="require('../../assets/join.png')" height="300px" max-width="600px" />
    </v-row>
    <v-row justify="center" class="text-h3 mt-5 ma-3 pa-3 text-center">Join a chamber to discuss !!!</v-row>
  </v-container>

  
  <div class="pa-0 ma-0" v-else>
    <chatbox
      v-for="chamber in joinedchambers"
      :key="chamber.id"
      v-bind:chamberdetails="chamber"
      v-show="currentchamber===chamber.id"
    />
  </div>
</template>
<script>
import chatbox from "../../components/chatpage/chatbox";
export default {
  name: "chatchamber_component",
  components: {
    chatbox
  },
  data: () => ({
    rooms: []
  }),
  activated() {
    this.$emit("settab", { id: 3, name: "chatchamber" });
  },
  computed: {
    joinedchambers: function() {
      return this.$store.state.joinedchambers.map(x => {
        return { id: x.chamberid, name: x.name, count: x.count };
      });
    },
    currentchamber: function() {
      return this.$store.state.currentchamber;
    }
  }
};
</script>