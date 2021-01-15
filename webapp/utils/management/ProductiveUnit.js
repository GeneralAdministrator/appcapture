sap.ui.define([
	"sap/m/MessageToast"
	],function(MessageToast) {
	"use strict";
	
	var ProductiveUnit = {
		
		getData: function (oController) {
		
			var aData = [
				oController.byId("createProductionUnit_unittype").getSelectedKey(),
				oController.byId("createproductionunit_unitname").getValue(),
				oController.byId("createProductionUnit_area").getValue()
			];

			var aInsert=[aData];
			
			return aInsert;
		},
		
		cleanForm: function (oController) {
			oController.byId("createproductionunit_unitname").setValue(null);
			oController.byId("createProductionUnit_area").setValue(null);
		}
	};
	
	return ProductiveUnit;
}, this);