function getUserId(){return location.hash.replace(/^[#!\/]*/g,"")}function getBlankUser(){return{id:"",name:"",email:"",permLevel:20,changePass1:"",changePass2:""}}"/users/"!=location.pathname&&(location.pathname="/users/");var usersApp=new Vue({el:"#users-app",data:{loader:!0,success:"",error:"",query:"",users:[],object:getBlankUser(),objectHash:!1,changingPassword:!1,userLevels:{1:"Owner",10:"Admin",20:"Member"},timeouts:{}},created:function(){var scope=this;scope.loadIndex(),scope.loadObject()},computed:{hasChanged:function(){return this.objectHash!==md5(json_encode(this.object))},passwordVerify:function(){return 0===this.object.changePass1.length||this.object.changePass1.length>12},passwordsMatch:function(){return 0===this.object.changePass1.length||this.object.changePass1===this.object.changePass2}},methods:{clearMessages:function(){this.error=this.success=""},resetObject:function(){this.object=getBlankUser(),this.hasChanged=!1,this.objectHash=md5(json_encode(this.object)),this.changingPassword=!0},loadIndex:function(){var scope=this;$.get({url:"/users",success:function(result){scope.users=json_decode(AES.decrypt(result)),scope.toggleLoader(!1)}})},loadObject:function(){var scope=this;scope.toggleLoader(!0),scope.clearMessages();var userId=getUserId();return userId.length?void $.get({url:"/users/"+userId,success:function(data){return data?(scope.object=json_decode(AES.decrypt(data)),scope.cancelChangePassword(),scope.objectHash=md5(json_encode(scope.object)),scope.hasChanged=!1,void scope.toggleLoader(!1)):(location.hash="#/",void scope.loadObject())},error:function(jqXHR){return 401==code?void location.reload():(scope.error=jqXHR.responseText,scope.toggleLoader(!1),void scope.resetObject())}}):(scope.toggleLoader(!1),scope.resetObject(),void(scope.changingPassword=!0))},saveObject:function(){var scope=this;if(scope.toggleLoader(!0),scope.clearMessages(),!scope.passwordsMatch)return void(scope.error="Passwords do not match.");var ajaxData=json_encode(AES.encrypt(scope.object));$.post({url:"/users/"+scope.object.id,data:ajaxData,success:function(result){scope.object=json_decode(AES.decrypt(result)),location.hash="#/"+scope.object.id,scope.loadIndex(),scope.toggleLoader(!1),scope.cancelChangePassword(),scope.objectHash=md5(json_encode(scope.object)),scope.success="Successfully saved the user"},error:function(jqXHR){return 401==jqXHR.status?void location.reload():(scope.error=jqXHR.responseText,void scope.toggleLoader(!1))}})},deleteObject:function(user){var scope=this;$.ajax({method:"delete",url:"/users/"+user.id,data:json_encode(AES.encrypt(user)),success:function(result){scope.success="Successfully deleted the user",scope.resetObject()},error:function(jqXHR){return 401==jqXHR.status?void location.reload():(scope.error=jqXHR.responseText,void scope.toggleLoader(!1))}})},startChangePassword:function(){this.object.changePass1="",this.object.changePass2="",this.changingPassword=!0},cancelChangePassword:function(){this.object.changePass1="",this.object.changePass2="",this.changingPassword=!1},toggleLoader:function(toggle){var scope=this;toggle?scope.timeouts.loader=setTimeout(function(){scope.loader=!0},200):(scope.loader=!1,clearTimeout(scope.timeouts.loader),window.scrollTo(0,0))},search:function(id){if(this.query.length<3)return!0;var regexp=new RegExp(this.query.replace(" ",".*"),"i");return null!==this.users[id].name.match(regexp)||null!==this.users[id].email.match(regexp)}}});$(window).on("hashchange",function(){usersApp.loadObject()});