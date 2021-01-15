sap.ui.define([
	"data/capture/for/sap/controller/BaseController"
	],function(BaseController){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.datacapture.Sampling",{
		
		openCreateSampling: function () {
			this.getRouter().navTo("createSample");
		}
		
	});
});