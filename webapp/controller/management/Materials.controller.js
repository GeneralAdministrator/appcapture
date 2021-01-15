sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"data/capture/for/sap/utils/Utils"
	],function(BaseController,Fragment, JSONModel, Utils){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.management.Materials",{

		onInit: function () {
			this.loadModel();
		},
		
		openCreateMaterial: function () {
			var oView = this.getView();
			
			if (!this.byId("create_material")) {
				Fragment.load({
					id: oView.getId(),
					name: "data.capture.for.sap.view.management.CreateMaterial",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("create_material").open();
			}
		},
		
		closeCreateMaterial: function () {
			this.byId("create_material").close();
		},

		loadModel: function () {
			
			var $this = this;
			
			//var sUrl = "http://localhost:8081/http://saperpder.lamar.local:8585/sap/opu/odata/sap/ZGW_MATAPP_SRV/MaterialesSet?$format=json";
			// var jqXHR = $.get(sUrl, function (oData) {
			// 	$this.byId("materials_table").setModel(new JSONModel(oData));
			// });
			
			// jqXHR.done(function () {
			// 	Utils.synchOk($this);
			// });
			
			// jqXHR.fail(function () {
			// 	Utils.synchFailed($this);	
			// });
			
			var sUrl ="http://localhost:8081/http://saperpder.lamar.local:8585/sap/opu/odata/sap/ZGW_MATAPP_SRV/MaterialesSet?$format=json";
			var $this = this;
			
			$.ajax({
				url: sUrl,
				data:"GET",
				dataType:"JSON",
				contentType:"application/json",
				success: function (oData) {
					console.log(oData);
					$this.byId("materials_table").setModel(new JSONModel(oData));
				}
			});
			
			// var oModelOdata = new sap.ui.model.odata.v2.ODataModel(sUrl);
			// 	this.byId("materials_table").setModel(oModelOdata,"oData");
			// var oModel = this.byId("materials_table").getModel("oData");


			// oModel.read("/zgw_maraSet?$format=json",{
			// 	success: function (oData) {
			// 		$this.byId("materials_table").setModel(new JSONModel(oData));
			// 	},
				
			// 	error: function (oError) {
			// 		console.log(oError);
			// 	}
			// });
		}
	});
	
});