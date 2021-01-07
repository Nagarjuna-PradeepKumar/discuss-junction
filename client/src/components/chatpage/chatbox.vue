<template>
  <v-container class="ma-0 pa-0" fluid>
    <!-- Title row -->
    <v-row justify="space-between" align="center" class="titlebg pa-0 ma-0 titlecard">
      <v-btn @click="onlineuserview=!onlineuserview" icon class="ml-3 black mt-1">
        <v-icon color="green">mdi-dots-horizontal-circle-outline</v-icon>
      </v-btn>
      <div class="white--text d-flex">
        <h3>{{chamberdetails.name}}</h3>
        <pre>    {{typinguser}}</pre>
      </div>
      <v-btn class="mr-3 black mt-1" v-if="chamberdetails.count==='you have left'" icon @click="removefromlist">
        <v-icon color="blue">mdi-delete</v-icon>
      </v-btn>
      <v-btn v-else icon class="mr-3 black mt-1" @click="leavechamber">
        <v-icon color="blue">mdi-exit-run</v-icon>
      </v-btn>
    </v-row>
    <!-- Navigation drawer and chat area -->
    <v-container
      class="ma-0 pa-0 d-flex"
      :style="{height: viewportheight+'px' }"
      fluid
      style="overflow-y:auto"
    >
      <div class="d-flex">
        <v-navigation-drawer
          v-if="onlineuserview"
          color="#dbbe80"
          class="pa-0"
          v-model="onlineuserview"
          :temporary="temporarychecker"
        >
          <v-virtual-scroll
            :items="online_users"
            :item-height="50+'px'"
            :height="viewportheight+'px'"
            style="flex:1"
          >
            <template v-slot="{ item }">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-if="item.userid===myuserid">{{ item.name }} (me)</v-list-item-title>
                  <v-list-item-title v-else>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon color="green darken-4" right>mdi-music-note-whole</v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-navigation-drawer>
      </div>
      <!-- Chat area -->
      <v-container class="sandalbg ma-0 pa-0 qwerty" fluid>
        <v-card
          class="ml-16 mr-16 mt-0 mb-0 scrollsetter sandal"
          :style="{'min-height':viewportheight+'px','max-height':viewportheight+'px','overflow-y':'auto'}"
        >
          <v-container class="sandal">
            <v-container
              class="pa-0 pl-5 pr-5 ma-0"
              v-for="(message,i) in message_history"
              :key="i"
            >
              <!-- sent by me -->
              <v-row dense justify="end" class="mb-3" v-if="message.userid===myuserid">
                <div
                  class="bluebg pa-3"
                  style="display:inline-block;max-width:70%;word-break:break-all;border-radius:10px"
                >{{message.message}}</div>
                <v-col cols="12" class="ma-0 pa-0 d-flex justify-end">
                  <div class="text-overline ma-0 pa-0" v-if="message.msgid==='sent'">
                    <v-icon color="titlebg">mdi-check-all</v-icon>
                  </div>
                  <div class="text-overline ma-0 pa-0" v-else>
                    <v-icon>mdi-check</v-icon>
                  </div>
                </v-col>
              </v-row>
              <!-- sent by others -->
              <v-row
              dense
                justify="start"
                class="mb-3 pa-0"
                v-if="(message.userid!=myuserid)&&(message.userid!='admin')"
              >
                <v-col cols="12" class="ma-0 pa-0">
                  <div class="text-overline ma-0 pa-0">{{message.time}}</div>
                </v-col>
                <div
                  class="pa-3 othersend mt-0"
                  style="display:inline-block;max-width:70%;word-break:break-all;border-radius:10px"
                >
                  <div style="color:#FF003F">{{message.sentby}}</div>
                  {{message.message}}
                </div>
              </v-row>
              <!-- sent by admin -->
              <v-row justify="center" dense class="mt-1 mb-1" v-if="message.userid==='admin'">
                <div
                  class="grey pa-1 ma-0 text-caption"
                  style="border-radius:5px"
                >admin: {{message.message}}</div>
              </v-row>
            </v-container>
          </v-container>
        </v-card>
      </v-container>
    </v-container>
    <!-- typing area -->
    <v-container class="messagearea titlebg ma-0 pa-0" fluid>
      <v-row class=" ma-0 pa-0" justify="center" no-gutters>
        <v-col cols="10" sm="5" class="pa-0 ma-0">
          <v-textarea
          background-color="#dbbe80"
          color="sandal"
            ref="textmessagearea"
            placeholder="type your text here"
            outlined
            height="50px"
            class="ma-1"
            no-resize
            v-model="mytexttosend"
            :disabled="chamberdetails.count==='you have left'"
            @keypress="typing"
          />
        </v-col>
        <v-col cols="1" sm="1" align-self="center" class="mb-8 mr-0 ml-0">
          <v-btn icon class="red" @click="sendmessage(mytexttosend);mytexttosend=''">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
<script>
export default {
  name: "chatbox",
  data: () => ({
    message_history: [],
    online_users: [],
    typinguser: "",
    windowheight: 0,
    mainareaheight: 0,
    messageareaheight: 65,
    titleheight: 0,
    onlineuserview: false,
    temporarychecker: false,
    mytexttosend: ""
  }),
  props: ["chamberdetails"],
  mounted() {
    window.onkeydown = function(e) {
  if (e.keyCode == 8 && e.target == document.body)
    e.preventDefault();
}

    /* Setting heights */
    this.windowheight = window.innerHeight;
    this.mainareaheight = document
      .getElementsByClassName("v-main__wrap")[0]
      .getBoundingClientRect().height;
    this.messageareaheight = document
      .getElementsByClassName("messagearea")[0]
      .getBoundingClientRect().height;
    this.titleheight = document
      .getElementsByClassName("titlecard")[0]
      .getBoundingClientRect().height;
    window.addEventListener("resize", this.window_resized);
    /* Pushing my details to users online */
    this.online_users.push({
      socketid: this.$socket.id,
      userid: this.myuserid,
      name: this.myname
    });
    /* admin welcome message */
    this.message_history.push({
      userid: "admin",
      sentby: "admin",
      message: `welcome to the discussion ${this.myname}`
    });
    if (this.$socket && this.$socket.connected) {
      /* Send to thers that you have joined */
      this.$socket.emit("sendme", {
        chamber_id: this.chamberdetails.id,
        socketid: this.$socket.id,
        name: this.myname,
        user_id: this.myuserid
      });
      /* getting all users and updating */
      this.$socket.on("listofonlineusers", message => {
        console.log(message)
        if (this.chamberdetails.id === message.chamber_id) {
            const ids = new Set(this.online_users.map(({ userid }) => userid));
            this.online_users=[...this.online_users,...message.list.filter(({ userid }) => !ids.has(userid))]
        }
      });
      /* Receive new user details and send online users in my list*/
      this.$socket.on("userjoined", message => {
        if (this.chamberdetails.id === message.chamber_id) {
          if (this.online_users.length > 0) {
            const ind = this.online_users.findIndex(
              x => x.socketid === message.socketid
            );
            if (ind === -1) {
              this.online_users.push({
                socketid: message.socketid,
                userid: message.user_id,
                name: message.name
              });
              this.message_history.push({
                userid: "admin",
                sentby: "admin",
                message: `${message.name} has joined the discussion`
              });
            }
          }
          this.$socket.emit("listofusers", {
            chamber_id: this.chamberdetails.id,
            list: this.online_users
          });
        }
      });
      /* message receipt */
      this.$socket.on("messagereceipt", message => {
        if (this.chamberdetails.id === message.chamber_id) {
          const ind = this.message_history.findIndex(
            x => x.msgid && x.msgid === message.msgid
          );
          if (ind !== -1) {
            this.message_history[ind].msgid = "sent";
          }
        }
      });
      /* Receive message */
      this.$socket.on("receivemessage", message => {
        if (this.chamberdetails.id === message.chamber_id) {
          this.message_history.push({
            sentby: message.name,
            userid: message.userid,
            message: message.message,
            time:new Date().toLocaleString()
          });
          this.$nextTick(() => {
            var container = document.getElementsByClassName("scrollsetter")[0];
            var scrollheight = container.scrollHeight;
            container.scrollTop = scrollheight;
          });
        }
      });
      /* Receive keypress event */
      this.$socket.on("keypressreceive", message => {
        if (this.chamberdetails.id === message.chamber_id) {
          this.typinguser = message.message;
          setTimeout(()=>{this.typinguser=""},1000)
        }
      });
      /* On user left */
      this.$socket.on('left',(message)=>{
      if (this.chamberdetails.id === message.chamber_id) {
        const ind=this.online_users.findIndex(x=>x.socketid===message.socketid)
        if(ind!==-1){const delname=this.online_users.splice(ind,1);
        this.message_history.push({
          userid: "admin",
          sentby: "admin",
          message: `${delname[0].name} has left the discussion`
        });
        }
      }
    })
    }

  },
  methods: {
    sendmessage: function(message) {
      /* sending messages */
      if (message != "") {
        const rand = Math.floor(Math.random() * Math.floor(9999));
        this.$socket.emit("sendmessage", {
          chamber_id: this.chamberdetails.id,
          user_id: this.myuserid,
          name: this.myname,
          message: message,
          msgid: rand
        });
        this.message_history.push({
          sentby: this.myname,
          userid: this.myuserid,
          message: message,
          time:new Date().toLocaleString(),
          msgid: rand
        });
        this.$nextTick(() => {
          var container = document.getElementsByClassName("scrollsetter")[0];
          var scrollheight = container.scrollHeight;
          container.scrollTop = scrollheight;
        });
      };
      this.$refs.textmessagearea.focus()
    },
    typing: function() {
      /* Receive keypress event */
      this.$socket.emit("keypress", {
        chamber_id: this.chamberdetails.id,
        name: this.myname
      });
    },
    removefromlist: function() {
      this.$store.dispatch("removefromlist", this.chamberdetails.id);
    },
    leavechamber: function() {
      if (this.$socket && this.$socket.connected) {
        this.message_history.push({
        userid: "admin",
        sentby: "admin",
        message: `You have left the discussion ${this.myname}`
      });
        this.$socket.emit("leavechamber", {
          user_id: this.myuserid,
          chamber_id: this.chamberdetails.id
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
    window_resized: function() {
      const asd = window.innerHeight;
      this.mainareaheight = this.mainareaheight + (asd - this.windowheight);
      this.windowheight = asd;
      this.temporarychecker = window.innerWidth < 1200 ? true : false;
    }
  },
  computed: {
    viewportheight: function() {
      return this.mainareaheight - this.messageareaheight - this.titleheight;
    },
    myuserid: function() {
      return this.$store.state.userid;
    },
    myname: function() {
      return this.$store.state.user_name;
    }
  },
  watch:{
    online_users:function(){
      this.$store.dispatch('setonlineusers',{chamberid:this.chamberdetails.id,count:this.online_users.length})
    }
  }
};
</script>
<style lang="css" >
.messagearea {
  position: sticky;
  bottom: 0;
  height: 65px;
  overflow-y: hidden;
  color: bisque;
}

/* * {
  scrollbar-width: 5px;
  scrollbar-color: red green;
  padding-top: 0px;
}

*::-webkit-scrollbar {
  width: 5px;
}
*::-webkit-scrollbar-track {
  background: orange;
}
*::-webkit-scrollbar-thumb {
  background-color: blue;
  border-radius: 2px;
  border: 3px solid orange;
} */
</style>

<style scoped>
.sandalbg {
  background: rgb(29, 29, 29);
  background: linear-gradient(
    10deg,
    rgba(29, 29, 29, 1) 24%,
    rgba(252, 202, 100, 1) 100%
  );
}
.sandalbackground {
  background: rgb(29, 29, 29);
  background: linear-gradient(
    10deg,
    rgba(29, 29, 29, 1) 77%,
    rgba(252, 202, 100, 1) 100%
  );
}
.bluebg{
  background-color: #43ADA5;
}
.othersend{
background-color: #FFFFCC;
}
</style>
