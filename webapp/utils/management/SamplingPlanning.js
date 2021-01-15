sap.ui.define([
	"sap/m/MessageToast"
	],function(MessageToast){
	"use strict";
	
	var SamplingPlanning = {
		
		getData: function (oController) {

			var aData = this.getIds(oController);
			var aIdUnits =	aData[0],
				aIdCycle =	aData[1];
			var aSend = [];

			for (var i = 0; i < aIdUnits.length; i++) {
				aSend.push([
					parseInt(aIdCycle[i]),
					parseInt(aIdUnits[i]),
					oController.byId("createsample_date").getValue(),
					parseInt(oController.byId("createsample_users").getSelectedKey())	
				]);
			}

			return aSend;
		},
		
		getIds: function (oController) {
			
			var oUnits = oController.byId("createsample_productionunits"),
				oModel = oUnits.getModel(),
				aItems = oUnits.getItems();
			var aIdUnit = [],
				aIdCycle = [];
			
			$.each(aItems, function (index, oItem) {
				if (oUnits.isItemSelected(oItem)) {
					aIdUnit.push(oModel.getProperty("/SamplingList/"+index+"/IdUnit/"));
					aIdCycle.push(oModel.getProperty("/SamplingList/"+index+"/IdCycle/"));
				}
			});

			return [aIdUnit, aIdCycle];
		},
		
		cleanForm: function (oController) {
			oController.byId("createsample_date").setPlaceholder(oController.getResourceBundle().getText("CreateSample.placeholder.label1"));
			oController.byId("createsample_productionunits").destroyItems();
			oController.byId("createsample_users").setSelectedKey("");
		}
		
	};
	
	return SamplingPlanning;
}, true);