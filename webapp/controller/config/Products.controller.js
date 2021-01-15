sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/core/EventBus",
	"data/capture/for/sap/utils/config/Products"
	],function(BaseController, Fragment,EventBus, Products){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.config.Products",{
		
		onInit: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.subscribe("loadModelProducts", this.loadModel, this);
			this.loadModel();	
		},
		
		loadModel: function () {
			var sUrl = this.getBaseUrl()+"config/products_controller";
			var sId = "products_gridlist";
			this.getDataFromMySQL(sUrl, sId);
		},
		
		onNavToSubproducts: function () {
			this.getRouter().navTo("subproducts");
		}
		
	});
});