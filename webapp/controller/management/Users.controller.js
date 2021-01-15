sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"data/capture/for/sap/model/formatter",
	"data/capture/for/sap/utils/management/Users"
	],function(BaseController, Fragment, JSONModel, formatter, Users){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.management.Users",{

		formatter: formatter,

		onInit: function () {
			var oModel = this.getOwnerComponent().getModel("user");
				this.setModel(oModel);
		},

		onBeforeRendering: function () {
			this.loadUsers();
		},
		
		openCreateUser: function () {
			var oView = this.getView();
			
			if (!this.byId("create_user")) {
				Fragment.load({
					id: oView.getId(),
					name:"data.capture.for.sap.view.management.CreateUser",
					controller:this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("create_user").open();
			}
		},
		
		closeCreateUser: function () {
			Users.cleanForm(this);
			this.byId("create_user").close();
		},

		generatePassword: function () {
			var sPassword = Users.generatePassword();
			this.byId("createUser_password").setValue(sPassword);
		},

		loadUsers: function () {

			var sUrl = this.getBaseUrl()+"management/users_controller";
			var $this = this;

			$.ajax({
				url: sUrl,
				type: "GET",
				dataType:"JSON",
				contentType:"application/json",
				async: false,
				success: function (oData) {
					$this.byId("users_table").setModel(new JSONModel(oData));
				}
			});
		},	

		onSave: function () {
			if (Users.check(this)) {
				var aData = Users.getData(this);
				Users.insertUser(this, aData);
			}
		}
		
	});
});