"use strict";var greenhouseApp=angular.module("greenhouseApp",["ui.router","ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase"]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/login"),a.state("index",{url:"",templateUrl:"views/root.html",resolve:{user:function(a){var b=a.defer(),c=new Firebase("https://greenhouse.firebaseio.com/"),d=new FirebaseSimpleLogin(c,function(a,e){a&&b.resolve(null),e?(console.log("logged in:",e),b.resolve({user:e,auth:d,fb:c})):b.resolve({auth:d})});return b.promise}},controller:"RootCtrl"}).state("index.users",{"abstract":!0,url:"/users",templateUrl:"views/user.html",controller:"UserCtrl"}).state("index.users.main",{url:"/:uid",templateUrl:"views/main.html",controller:"MainCtrl"}).state("index.users.channel",{url:"/:uid/channels/:cid",templateUrl:"views/channel.html",controller:"ChannelCtrl"}).state("index.users.settings",{url:"/:uid/settings",templateUrl:"views/settings.html",controller:"SettingsCtrl"}).state("index.signup",{url:"/signup",templateUrl:"views/signup.html",controller:"SignupCtrl"}).state("index.login",{url:"/login",templateUrl:"views/login.html",controller:"LoginCtrl"})}]);greenhouseApp.filter("reverse",function(){function a(a){var b,c=[];if(a)if(angular.isArray(a))c=a;else if("object"==typeof a)for(b in a)a.hasOwnProperty(b)&&c.push(a[b]);return c}return function(b){return a(b).slice().reverse()}}),greenhouseApp.controller("RootCtrl",["$scope","$rootScope","$state","user",function(a,b,c,d){console.log("rootCTRL",d),d&&d.user?(console.log("root.js",d),a.user=d.user,a.uid=d.user.id,a.isAuthenticated=!0):c.go("index.login"),b.$on("$stateChangeStart",function(d,e){b.isAuthenticated||"index.signup"==e.name||"index.login"==e.name?!b.isAuthenticated||"index"!=e.name&&"index.login"!=e.name&&"index.signup"!=e.name||(d.preventDefault(),a.isAuthenticated=!0,a.user=b.user,c.go("index.users.main",{uid:a.user.id})):(d.preventDefault(),a.isAuthenticated=!1,c.go("index.login"))}),a.logout=function(){console.log("logged out"),b.isAuthenticated=!1,a.user=null,d.auth.logout(),c.go("index.login")}}]),angular.module("greenhouseApp").controller("UserCtrl",["$scope","$stateParams","user",function(a,b){console.log("userCTRL",b.uid)}]),angular.module("greenhouseApp").controller("SignupCtrl",["$scope","$state","$firebase",function(a,b){var c=new Firebase("https://greenhouse.firebaseio.com"),d=new FirebaseSimpleLogin(c,function(a,c){a?console.log(a):c&&(console.log("signup:",c),b.go("index"))});a.createUser=function(){var c=a.fields;d.createUser(c.email,c.password,function(a,d){if(!a){var e=new Firebase("https://greenhouse.firebaseio.com/users/"+d.id);e.set({id:d.id,email:c.email}),b.go("index.login")}})}}]),angular.module("greenhouseApp").controller("LoginCtrl",["$scope","$rootScope","$state","$firebase","user",function(a,b,c,d,e){console.log("loginCTRL",e);var f=new Firebase("https://greenhouse.firebaseio.com/"),g=new FirebaseSimpleLogin(f,function(a,d){a?console.log(a):d&&(console.log("login.js:",d),b.isAuthenticated=!0,b.user=d,c.go("index"))});a.loginUser=function(){var b=a.fields;g.login("password",{email:b.email,password:b.password})}}]),angular.module("greenhouseApp").controller("SettingsCtrl",["$scope","$stateParams","user",function(a,b,c){a.changePassword=function(){a.showAlert=!1;var b=a.fields.old,d=a.fields.new_confirm;a.fields.new_password===a.fields.new_confirm?c.auth.changePassword(a.user.email,b,d,function(b){a.$apply(b?function(){a.showAlert=!0,a.alertClass="danger",a.alertMessage="Password change failed."}:function(){a.showAlert=!0,a.alertClass="success",a.alertMessage="Password changed successfully."})}):(a.showAlert=!0,a.alertClass="danger",a.alertMessage="Given new passwords are not equal!")}}]),angular.module("greenhouseApp").controller("MainCtrl",["$scope","$stateParams","$firebase","user",function(a,b,c){console.log("mainCTRL");var d=new Firebase("https://greenhouse.firebaseio.com/users/"+a.user.id+"/channels");a.channels=c(d),a.addChannel=function(){{var b=a.fields;d.push(b)}}}]),angular.module("greenhouseApp").controller("ChannelCtrl",["$scope","$stateParams","$firebase","user",function(a,b,c){a.cid=b.cid;var d=new Firebase("https://greenhouse.firebaseio.com/users/"+a.user.id+"/channels/"+a.cid);a.channel=c(d);var e=new Firebase("https://greenhouse.firebaseio.com/users/"+a.user.id+"/channels/"+a.cid+"/data"),f={};a.data={},a.showMore=!1,a.updown="down",Highcharts.setOptions({global:{useUTC:!1}}),e.once("value",function(a){var b=[],c=[],d=a.val();for(var e in d)if(d.hasOwnProperty(e)){b=[];for(var f in d[e].data)d[e].data.hasOwnProperty(f)&&b.push(d[e].data[f]);c.push({id:d[e].id,name:d[e].name,data:b,unit:d[e].unit||""})}$("#chart1").highcharts("StockChart",{chart:{type:"area",zoomType:"x"},credits:{enabled:!1},legend:{enabled:!0},rangeSelector:{allButtonsEnabled:!0},tooltip:{formatter:function(){for(var a="<b>"+Highcharts.dateFormat("%A, %b %e, %Y",this.x)+"</b>",b=0;b<this.points.length;b++)a+="<br/><b>"+this.points[b].series.name+":</b> "+Math.round(100*this.points[b].y)/100+" "+this.points[b].series.options.unit;return a}},series:c})}),e.on("child_added",function(b){var d="https://greenhouse.firebaseio.com/users/"+a.uid+"/channels/"+a.cid+"/data/"+b.name()+"/data";a.series_id=b.name(),f[b.val().id]=new Firebase(d),f[b.val().id].endAt().limit(1).on("child_added",function(a){var c=a.val()[0],d=parseFloat(a.val()[1]);$("#chart1").highcharts().get(b.val().id).addPoint([c,d])}),a.data[b.val().id]={val:c(f[b.val().id].limit(1)),unit:b.val().unit,key:b.name()}}),a.switchMore=function(){a.updown="up"==a.updown?"down":"up",a.showMore=!a.showMore},a.parseDate=function(a){var b=new Date(a);return b.getDate()+"."+(b.getMonth()+1)+"."+b.getFullYear()+" "+b.getHours()+":"+b.getMinutes()+":"+b.getSeconds()},a.addSeries=function(){a.fields&&a.fields.id&&a.fields.unit&&e.push({id:a.fields.id,name:a.fields.id,unit:a.fields.unit},function(a){console.log("done",a),$("#data-id")[0].value="",$("#data-unit")[0].value="",alert("Series added!")})},a.removeSeries=function(b){var c=confirm("Are you sure to remove series data?");c&&($("#chart1").highcharts().get(b)&&$("#chart1").highcharts().get(b).remove(),delete a.data[b],f[b].parent().remove(function(){console.log("done")}))},a.roundVal=function(a){return Math.round(100*a)/100}}]);