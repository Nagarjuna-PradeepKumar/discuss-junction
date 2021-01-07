(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["resendactivation"],{"4bd4":function(t,e,r){"use strict";r("4de4"),r("7db0"),r("4160"),r("caad"),r("07ac"),r("2532"),r("159b"),r("4795");var s=r("5530"),a=r("58df"),i=r("7e2b"),n=r("3206");e["a"]=Object(a["a"])(i["a"],Object(n["b"])("form")).extend({name:"v-form",provide:function(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(t){var e=Object.values(t).includes(!0);this.$emit("input",!e)},deep:!0,immediate:!0}},methods:{watchInput:function(t){var e=this,r=function(t){return t.$watch("hasError",(function(r){e.$set(e.errorBag,t._uid,r)}),{immediate:!0})},s={_uid:t._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?s.shouldValidate=t.$watch("shouldValidate",(function(a){a&&(e.errorBag.hasOwnProperty(t._uid)||(s.valid=r(t)))})):s.valid=r(t),s},validate:function(){return 0===this.inputs.filter((function(t){return!t.validate(!0)})).length},reset:function(){this.inputs.forEach((function(t){return t.reset()})),this.resetErrorBag()},resetErrorBag:function(){var t=this;this.lazyValidation&&setTimeout((function(){t.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(t){return t.resetValidation()})),this.resetErrorBag()},register:function(t){this.inputs.push(t),this.watchers.push(this.watchInput(t))},unregister:function(t){var e=this.inputs.find((function(e){return e._uid===t._uid}));if(e){var r=this.watchers.find((function(t){return t._uid===e._uid}));r&&(r.valid(),r.shouldValidate()),this.watchers=this.watchers.filter((function(t){return t._uid!==e._uid})),this.inputs=this.inputs.filter((function(t){return t._uid!==e._uid})),this.$delete(this.errorBag,e._uid)}}},render:function(t){var e=this;return t("form",{staticClass:"v-form",attrs:Object(s["a"])({novalidate:!0},this.attrs$),on:{submit:function(t){return e.$emit("submit",t)}}},this.$slots["default"])}})},"6c82":function(t,e,r){"use strict";r.r(e);var s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-container",[r("v-row",{attrs:{id:"logo"}},[r("v-col")],1),r("v-row",[r("v-col",[r("v-card",{staticClass:"pa-6",attrs:{elevation:"24",dark:"","min-height":"300px"}},[r("v-overlay",{attrs:{value:t.overlay,absolute:"",color:"primary"}},[r("v-progress-circular",{attrs:{indeterminate:"",size:"50"}})],1),r("v-card-subtitle",{staticClass:"text-center orange--text"},[t._v("Resend activation link")]),""!=t.errormessage?r("v-row",{staticClass:"red--text mt-3 mb-3 errormessagedisplay",attrs:{justify:"center"}},[t._v(t._s(t.errormessage)+" !")]):t._e(),""!=t.successmessage?r("v-row",{staticClass:"green--text mt-3 mb-3 errormessagedisplay",attrs:{justify:"center"}},[t._v(t._s(t.successmessage)+" !")]):t._e(),r("v-row",{attrs:{justify:"center"}},[r("v-form",{ref:"loginform"},[r("v-text-field",{attrs:{dense:"",label:"email",type:"text","prepend-icon":"mdi-account-box",required:"",rules:[function(t){return!!t||"Username is required"}],color:"orange"},model:{value:t.send.user_email,callback:function(e){t.$set(t.send,"user_email",e)},expression:"send.user_email"}}),r("v-btn",{staticClass:"primary mt-5",attrs:{block:"",small:""},on:{click:function(e){return e.preventDefault(),t.resend(e)}}},[t._v("Resend")])],1)],1),r("v-row",{staticClass:"white--text mt-10",attrs:{justify:"center"}},[r("span",[t._v("Not an existing user ?")])]),r("v-row",{staticClass:"white--text",attrs:{justify:"center"}},[r("router-link",{staticClass:"signuptext",attrs:{to:"/signup"}},[r("p",[t._v("signup")])])],1)],1)],1)],1),r("dialog-box")],1)},a=[],i=r("b14a"),n={components:{"dialog-box":i["a"]},data:function(){return{overlay:!1,errormessage:"",successmessage:"",send:{user_email:""}}},methods:{resend:function(){var t=this;this.errormessage="",this.successmessage="",this.overlay=!0,this.$axios.post("/resendactivation",this.send).then((function(e){e.data.success&&(t.overlay=!1,t.successmessage=e.data.success),e.data.error&&(t.errormessage=e.data.error,t.overlay=!1)}))}}},o=n,u=(r("d69c"),r("2877")),c=r("6544"),d=r.n(c),l=r("8336"),f=r("b0af"),h=r("99d9"),v=r("62ad"),m=r("a523"),p=r("4bd4"),g=r("a797"),b=r("490a"),_=r("0fd9"),w=r("8654"),y=Object(u["a"])(o,s,a,!1,null,"4434d0a4",null);e["default"]=y.exports;d()(y,{VBtn:l["a"],VCard:f["a"],VCardSubtitle:h["b"],VCol:v["a"],VContainer:m["a"],VForm:p["a"],VOverlay:g["a"],VProgressCircular:b["a"],VRow:_["a"],VTextField:w["a"]})},b18f:function(t,e,r){},d69c:function(t,e,r){"use strict";var s=r("b18f"),a=r.n(s);a.a}}]);
//# sourceMappingURL=resendactivation.40cc2000.js.map