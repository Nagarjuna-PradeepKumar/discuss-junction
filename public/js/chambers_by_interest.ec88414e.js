(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chambers_by_interest"],{"705b":function(t,a,e){"use strict";a["a"]={methods:{joinchamber:function(t){this.$socket&&this.$socket.connected?this.$store.state.activechambers.length<3?this.$socket.emit("joinroom",{chamber_id:t,name:this.$store.state.user_name,user_id:this.$store.state.userid}):this.$store.dispatch("alertdialog",{show:!0,type:"yellow darken-2",title:"Warning !",message:"Cannot join more than three chambers at a time",buttontext:"ok"}):this.$store.dispatch("alertdialog",{show:!0,type:"yellow darken-2",title:"Warning !",message:"You are not online",buttontext:"ok"})}},computed:{isonline:function(){return console.log("as"),this.$store.state.isonline}}}},"7b24":function(t,a,e){},b21b:function(t,a,e){t.exports=e.p+"img/notfound1.247956c0.png"},dbbc:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,s=t._self._c||a;return!1===t.is_all_loaded?s("v-container",[s("v-row",{staticClass:"text-h5 mb-3 white--text",attrs:{justify:"start"}},[t._v("Interests")]),s("v-row",[s("v-col",{attrs:{cols:"12",md:"6"}},[s("v-skeleton-loader",{attrs:{type:"list-item-avatar, article, actions",dark:""}})],1),s("v-col",{attrs:{cols:"12",md:"6"}},[s("v-skeleton-loader",{attrs:{type:"list-item-avatar-two-line, article, actions",dark:""}})],1)],1)],1):"error"===t.is_all_loaded?s("v-container",{staticClass:"mt-10"},[s("v-row",{staticClass:"text-h5 mb-3 white--text",attrs:{justify:"start"}},[t._v("Interests")]),s("v-row",{attrs:{justify:"center"}},[s("v-img",{attrs:{src:e("b21b"),height:"300px","max-width":"600px"}})],1),s("v-row",{staticClass:"text-h3 mt-5",attrs:{justify:"center"}},[t._v("No content yet!!!")])],1):s("v-container",[s("v-row",{staticClass:"text-h5 mb-3 white--text",attrs:{justify:"start"}},[t._v("Interests")]),s("v-card",{staticClass:"transparent",attrs:{elevation:"0"}},[s("v-row",{attrs:{justify:"center"}},t._l(t.suggested_chambers,(function(a,e){return s("v-col",{key:e,attrs:{cols:"12",sm:"6"}},[s("v-hover",{scopedSlots:t._u([{key:"default",fn:function(e){var r=e.hover;return[s("v-card",{staticClass:"cardbg",class:{"on-hover":r},attrs:{"max-width":"500px",elevation:r?12:2}},[s("v-container",{staticClass:"pb-0 mb-0"},[s("v-row",{staticClass:"elevation-1 pa-0 ma-0",attrs:{justify:"center"}},[s("v-col",{staticClass:"d-flex justify-center",attrs:{cols:"12",md:"8"}},[t._v("id: "+t._s(a._id))]),s("v-col",{staticClass:"green--text d-flex justify-center",attrs:{cols:"12",md:"4"}},[s("v-chip",{attrs:{small:"",color:"green"}},[t._v(t._s(a.active_user_count)+" online")])],1)],1),s("v-row",[s("v-col",{staticClass:"fill-height d-flex flex-column align-center",attrs:{cols:"12",md:"3","align-self":"center"}},[a.photo_url?s("v-img",{staticClass:"elevation-10",attrs:{src:a.photo_url,"max-width":"100%","max-height":"100%"}}):t._e(),t.user_id===a.created_by_userid?s("v-row",{staticClass:"mt-5",attrs:{justify:"center"}},[s("v-chip",[t._v("Your chamber")])],1):t._e()],1),s("v-col",{staticClass:"pa-5"},[s("v-row",{staticClass:"ma-0 pa-0"},[s("v-col",{staticClass:"ma-0 pa-0"},[t._v("created date:")]),s("v-col",{staticClass:"ma-0 pa-0"},[t._v(t._s(new Date(parseInt(a.created)).toLocaleDateString("en-US")))])],1),s("v-row",{staticClass:"ma-0 pa-0"},[s("v-col",{staticClass:"ma-0 pa-0"},[t._v("creator:")]),s("v-col",{staticClass:"ma-0 pa-0"},[t._v(t._s(a.created_by_name))])],1),s("v-row",{staticClass:"ma-0 pa-0"},[s("v-col",{staticClass:"ma-0 pa-0"},[t._v("name:")]),s("v-col",{staticClass:"ma-0 pa-0"},[t._v(t._s(a.chamber_name))])],1),s("v-row",{staticClass:"ma-0 pa-0"},[s("v-col",{staticClass:"ma-0 pa-0"},[t._v("description:")]),s("v-col",{staticClass:"ma-0 pa-0"},[t._v(t._s(a.chamber_description))])],1)],1)],1),s("v-row",{attrs:{justify:"center"}},t._l(a.hashtags.map((function(t){return"#"+t})),(function(a,e){return s("v-chip",{key:e,staticClass:"ml-1 mr-1 mb-2 white--text",attrs:{color:"#1D1D1D"}},[t._v(t._s(a))])})),1),s("v-row",{staticClass:"pb-0 mb-0"},[s("v-btn",{staticClass:"white--text",attrs:{block:"",color:"#1D1D1D"},on:{click:function(e){return t.joinchamber(a._id)}}},[t._v("Join chamber")])],1)],1)],1)]}}],null,!0)})],1)})),1)],1),s("v-row",{staticClass:"titlebg mt-10",attrs:{justify:"center"}},[s("v-pagination",{attrs:{length:t.lengthofpageination,"total-visible":7},model:{value:t.page_number,callback:function(a){t.page_number=a},expression:"page_number"}})],1),s("dialog-box")],1)},r=[],i=e("f4e3"),o=e("b14a"),n=e("705b"),c=new i["a"],l={name:"trending_chamberss",mixins:[n["a"]],components:{"dialog-box":o["a"]},data:function(){return{is_all_loaded:!1,suggested_chambers:[],page_number:1,total_items:0,items_per_page:4}},methods:{},mounted:function(){var t=this;this.$axios.post("/findbyinterest",{items_per_page:this.items_per_page,page_number:this.page_number},{headers:{Authorization:"Bearer ".concat(c.get("token"))}}).then((function(a){console.log(a.data),a.data.success?a.data.success.length>0&&(t.suggested_chambers=a.data.success,t.total_items=a.data.success.length,t.is_all_loaded=!0):(a.data.error,t.is_all_loaded="error")})),this.$emit("settab",{id:2,name:"interest"})},computed:{user_id:function(){return this.$store.state.userid},lengthofpageination:function(){return Math.ceil(this.total_items/this.items_per_page)}}},m=l,d=(e("e8cb"),e("2877")),u=e("6544"),v=e.n(u),_=e("8336"),h=e("b0af"),p=e("cc20"),b=e("62ad"),g=e("a523"),f=e("ce87"),w=e("adda"),C=e("891e"),x=e("0fd9"),y=e("3129"),k=Object(d["a"])(m,s,r,!1,null,"4cc62c24",null);a["default"]=k.exports;v()(k,{VBtn:_["a"],VCard:h["a"],VChip:p["a"],VCol:b["a"],VContainer:g["a"],VHover:f["a"],VImg:w["a"],VPagination:C["a"],VRow:x["a"],VSkeletonLoader:y["a"]})},e8cb:function(t,a,e){"use strict";var s=e("7b24"),r=e.n(s);r.a}}]);
//# sourceMappingURL=chambers_by_interest.ec88414e.js.map