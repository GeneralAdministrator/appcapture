sap.ui.define([
	"data/capture/for/sap/controller/BaseController"
	],function(BaseController){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.launchpad.Managament",{
		
		onNavToProductionUnits: function () {
			//this.getRouter().navTo("productionUnits");
			this.getRouter().navTo("productionUnitsMain");
		},
		
		onNavToProductionCycles: function () {
			this.getRouter().navTo("productionCycles");
		},
		
		onNavToCyclePlanning: function () {
			this.getRouter().navTo("cyclePlanning");	
		},
		
		onNavToSamplingPlanning: function () {
			this.getRouter().navTo("samplingPlanning");	
		},
		
		onNavToMaterials: function () {
			this.getRouter().navTo("materials");
		}

	});
});