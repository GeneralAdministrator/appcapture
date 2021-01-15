sap.ui.define([
	"data/capture/for/sap/controller/BaseController"
	],function(BaseController){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.launchpad.Capture",{
		
		onNavToMaintenance: function () {
			this.getRouter().navTo("maintenance");
		},
		
		onNavToSampling: function () {
			this.getRouter().navTo("sampling");
		}
		
	});
});