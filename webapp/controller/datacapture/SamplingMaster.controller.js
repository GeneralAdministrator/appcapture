sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/f/library",
	"sap/ui/core/EventBus"
	],function(BaseController, JSONModel, fioriLibrary, EventBus){
		"use strict";
		
		return BaseController.extend("data.capture.for.sap.controller.datacapture.SamplingMaster",{
			
			onInit: function () {
				var oEventBus = this.getOwnerComponent().getEventBus();
					oEventBus.subscribe("loadModelSample", this.loadModel, this);
				this.loadModel();
				this.loadProductionUnits();
			},
			
			loadModel: function () {
				this.getOwnerComponent().loadModelSampling();
			},
			
			loadProductionUnits: function () {
				var sUrl = this.getBaseUrl()+"datacapture/sampling_controller/getUnitTypes";
				var sId = "sampligmaster_unittypes";
				this.getDataFromMySQL(sUrl, sId);
			},
			
			onListItemPress: function (oEvent) {
				var oBinding = oEvent.getSource().getBindingContext("sampling");
				var sPath = oBinding.getPath();
				var index = sPath.split("/").slice(-1).pop();

				this.getRouter().navTo("samplingDetail",{
					index: index
				});

			}
		});
	
});