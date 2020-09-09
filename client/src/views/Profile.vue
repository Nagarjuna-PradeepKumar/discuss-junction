<template>
  <v-app>
    <!-- Right side navigation drawer -->
    <v-navigation-drawer
      expand-on-hover
      v-model="rightdrawer"
      clipped
      right
      app
      dark
      disable-resize-watcher
      color="titlebg"
    >
      <v-list>
        <v-list-item-title class="text-center text-h6">discussions</v-list-item-title>
        <v-list-item
          two-line
          v-for="(chamber) in joinedchambers"
          :key="chamber.chamberid"
          @click="setcurrent(chamber.chamberid)"
        >
          <v-list-item-avatar>
            <img :src="chamber.photo" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{chamber.name}}</v-list-item-title>
            <v-list-item-subtitle>{{chamber.count}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action
            v-if="chamber.count==='you have left'"
            @click="removefromlist(chamber.chamberid)"
          >
            <v-list-item-action-text v-text="'delete'"></v-list-item-action-text>
            <v-icon color="grey lighten-1">mdi-delete</v-icon>
          </v-list-item-action>

          <v-list-item-action v-else @click="leavechamber(chamber.chamberid)">
            <v-list-item-action-text v-text="'leave'"></v-list-item-action-text>
            <v-icon color="grey lighten-1">mdi-delete</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!--  Top app bar -->
    <v-app-bar clipped-right dense app fixed color="#1D1D1D" dark>
      <v-btn icon @click="connectsocket" :loading="issocketloading">
        <v-icon :color="isonline===true?'green':'red'">mdi-power-settings</v-icon>
      </v-btn>
      <v-toolbar-title
        v-if="isonline===true"
        class="green--text overline hidden-sm-and-down pl-0 ml-0"
      >
        <pre>online </pre>
      </v-toolbar-title>
      <v-toolbar-title
        v-if="isonline===false"
        class="red--text overline hidden-sm-and-down pl-0 ml-0"
      >
        <pre>offline</pre>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title>Discuss Junction</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon depressed @click="rightdrawer=!rightdrawer">
        <v-icon>mdi-chat</v-icon>
      </v-btn>

      <v-menu offset-y dark>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon depressed v-bind="attrs" v-on="on">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
        <v-list>
          <!-- <v-list-item-group dark> -->
          <v-list-item dark @click="deletemyaccount">
            <v-list-item-icon>
              <v-icon>mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>delete account</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item dark @click="changepassword">
            <v-list-item-icon>
              <v-icon>mdi-lock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>change password</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item dark @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-location-exit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- </v-list-item-group> -->
        </v-list>
      </v-menu>

      <!-- tabs in app bar -->
      <template v-slot:extension>
        <v-tabs align-with-title v-model="currenttab.id">
          <v-tab @click="changetab('/profile',{id:0,name:'myprofile'})">Me</v-tab>
          <v-tab @click="changetab('/profile/findchamber',{id:1,name:'findchamber'})">Search</v-tab>
          <v-tab
            @click="changetab('/profile/createchamber',{id:2,name:'createchamber'})"
          >Create chamber</v-tab>
          <v-tab @click="changetab('/profile/chatchamber',{id:3,name:'chatchamber'})">Active chamber</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <!-- Main view of components -->
    <v-main class="mainclass">
      <keep-alive include="chatchamber_component">
        <router-view v-on:settab="settab" />
      </keep-alive>
    </v-main>
    <internetchecker />
  </v-app>
</template>
<script>
import internetchecker from "../components/checknetwork/internetchecker";
import Cookies from "universal-cookie";
const cookies = new Cookies();
export default {
  name: "profile",
  components: { internetchecker },
  data: () => ({
    rightdrawer: false,
    currenttab: { id: 0, name: "myprofile" },
    activelist: "",
    issocketloading: false
  }),
  beforeCreate() {
    if (cookies.get("token")) {
      this.$axios
        .post("/verify", {
          token: `${cookies.get("token")}`
        })
        .then(Response => {
          if (Response.data.success) {
            this.$store.dispatch("setuserid", {
              user_id: Response.data.user_id,
              user_name: Response.data.user_name
            });
          }
          if (Response.data.error) {
            this.$router.push("/");
          }
        });
    } else {
      this.$router.push("/");
    }
  },
  methods: {
    onlinetoggle: function() {
      if (this.isonline === true) {
        this.isonline = false;
      } else {
        this.isonline = true;
      }
    },
    changetab: function(route, tab) {
      this.currenttab = tab;
      if (this.$route.path !== route) this.$router.push(route);
      // this.$router.push(tab).catch(err => {});
    },
    settab: function(tabs) {
      this.currenttab = tabs;
    },
    connectsocket: function() {
      if (this.isonline === false) {
        this.issocketloading = true;
        this.$connectSocketio();
        this.$socket.on("confirmconnect", message => {
          if (message.success) {
            this.issocketloading = false;
            this.$store.dispatch("setonlinestatus", true);
          }
        });
        this.$socket.on("confirmjoiningroom", message => {
          this.$store.dispatch("jointhechamber", {
            name: message.name,
            chamberid: message.success,
            photo: message.photo,
            count: message.count
          });
          console.log("joined chamber");
          return this.$router.push("/profile/chatchamber");
        });
        this.$socket.on("errorjoiningroom", message => {
          this.$store.dispatch("alertdialog", {
            show: true,
            type: "yellow darken-2",
            title: "Warning !",
            message: message.message,
            buttontext: "ok"
          });
        });
        this.$socket.on("leftaroom", message => {
          this.$store.dispatch("leavethechamber", message.chamber_id);
        });
      } else {
        this.$disconnectSocketio();
        this.$store.dispatch("setonlinestatus", false);
      }
    },
    setcurrent: function(id) {
      this.$store.dispatch("setcurrentchamber", id);
      if (this.$route.path !== "/profile/chatchamber")
        this.$router.push("/profile/chatchamber");
    },
    removefromlist: function(id) {
      this.$store.dispatch("removefromlist", id);
    },
    leavechamber: function(id) {
      if (this.$socket && this.$socket.connected) {
        this.$socket.emit("leavechamber", {
          user_id: this.$store.state.userid,
          chamber_id: id
        });
      } else {
        this.$store.dispatch("alertdialog", {
          show: true,
          type: "yellow darken-2",
          title: "Warning !",
          message: "You are not online",
          buttontext: "ok"
        });
      }
    },
    changepassword: function() {
      this.$router.push("/profile/changepassword");
    },
    logout: function() {
      cookies.remove("token");
      cookies.remove("io");
      return this.$router.push("/logout");
    },
    deletemyaccount: function() {
      return this.$router.push("/profile/deleteaccount");
    }
  },
  beforeDestroy() {
    this.$disconnectSocketio();
  },
  computed: {
    isonline: function() {
      return this.$store.state.isonline;
    },
    joinedchambers: function() {
      return this.$store.state.joinedchambers;
    },
    activechamber: function() {
      return this.$store.state.currentchamber;
    }
  }
};
</script>
<style >
.v-tab {
  text-transform: none !important;
}
.mainclass {
  background: rgb(29, 29, 29);
  background: linear-gradient(
    187deg,
    rgba(29, 29, 29, 1) 24%,
    rgba(252, 202, 100, 1) 100%
  );
}
</style>