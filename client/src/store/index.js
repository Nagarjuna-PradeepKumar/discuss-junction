import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dialogdata: {
      show: false,
      type: "",
      title: "",
      message: "",
      buttontext: "",
    },
    userid: "",
    user_name: "",
    isonline: false,
    joinedchambers:[],/* {chamberid:"",count:"",photo:"",name:""} */
    activechambers:[],/* [chamberid] */
    currentchamber:"",
  },
  mutations: {
    alertdialog: (state, payload) => {
      state.dialogdata = payload;
    },
    setuserid: (state, payload) => {
      state.userid = payload.user_id;
      state.user_name = payload.user_name;
    },
    setonlinestatus: (state, payload) => {
      if(payload===false){
        state.joinedchambers.forEach((x,i)=>{
          if(state.activechambers.includes(x.chamberid)){
            state.joinedchambers[i].count="you have left"
          }
        })
        state.activechambers=[]
      }
      state.isonline = payload;
    },
    jointhechamber:(state,payload)=>{
      state.activechambers.push(payload.chamberid);
      state.currentchamber=payload.chamberid
      const ind=(state.joinedchambers).findIndex((x)=>x.chamberid===payload.chamberid)
      if(ind===-1){state.joinedchambers.push(payload)}else{state.joinedchambers[ind].count=payload.count}
    },
    leavethechamber:(state,payload)=>{
      state.activechambers = state.activechambers.filter(e => e !== payload);
        state.joinedchambers.forEach((x,i)=>{
          if(x.chamberid===payload){
            state.joinedchambers[i].count="you have left"
          }
        })
    },
    setcurrentchamber:(state,payload)=>{
      state.currentchamber=payload;
    },
    removefromlist:(state,payload)=>{
      state.joinedchambers = state.joinedchambers.filter(e => e.chamberid !== payload);
      if(state.currentchamber===payload){
        if(state.activechambers.length>0){state.currentchamber=state.activechambers[0]}else{
          if(state.joinedchambers.length>0){
            const ind=(state.joinedchambers).findIndex((x)=>x.chamberid !== payload)
            if(ind!==-1){state.currentchamber=state.joinedchambers[ind].chamberid}else{
              state.currentchamber=""
            }
          }else{state.currentchamber=""}
        }
      }
    },
    setonlineusers:(state,payload)=>{
      const ind=state.joinedchambers.findIndex(x=>x.chamberid===payload.chamberid)
      state.joinedchambers[ind].count=payload.count
    }
  },
  actions: {
    alertdialog: (context, payload) => {
      context.commit("alertdialog", payload);
    },
    setuserid: (context, payload) => {
      context.commit("setuserid", payload);
    },
    setonlinestatus: (context, payload) => {
      context.commit("setonlinestatus", payload);
    },
    jointhechamber:(context,payload)=>{
      context.commit("jointhechamber",payload)
    },
    leavethechamber:(context,payload)=>{
      context.commit("leavethechamber",payload)
    },
    setcurrentchamber:(context,payload)=>{
      context.commit("setcurrentchamber",payload)
    },
    removefromlist:(context,payload)=>{
      context.commit("removefromlist",payload)
    },
    setonlineusers:(context,payload)=>{
      context.commit('setonlineusers',payload)
    }
  },
  modules: {},
});
