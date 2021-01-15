sap.ui.define([
	"sap/m/MessageToast"
	],function(MessageToast){
	"use strict";
	
	var Products = {
		
		getData: function (oController) {
			var aData = [
				oController.byId("createproduct_unittype").getSelectedKey(),
				oController.byId("createproduct_startproduct").getValue(),
				oController.byId("createproduct_udstartproduct").getValue(),
				oController.byId("createproduct_symbolstartproduct").getValue(),
				oController.byId("createproduct_endproduct").getValue(),
				oController.byId("createproduct_udendproduct").getValue(),
				oController.byId("createproduct_symbolendproduct").getValue()
			];
			
			return aData;
		},
		
		cleanForm: function (oController) {
				oController.byId("createproduct_startproduct").setValue(null);
				oController.byId("createproduct_udstartproduct").setValue(null);
				oController.byId("createproduct_symbolstartproduct").setValue(null);
				oController.byId("createproduct_endproduct").setValue(null);
				oController.byId("createproduct_udendproduct").setValue(null);
				oController.byId("createproduct_symbolendproduct").setValue(null);
		}
	};
	
	return Products;
},this);