sap.ui.define([
	"sap/m/MessageToast",
	"data/capture/for/sap/utils/Utils"
	],function(MessageToast, Utils){
	"use strict";
	
	var UnitTypes = {
		
		check: function (oController) {
			var sType = oController.byId("createunittype_unittype").getValue().length;
				
				if (sType === 0) {
					MessageToast.show(oController.getResourceBundle().getText("CreateUnitType.placeholder.label1"));
					return false;
				}  else {
					return true;
				}
		},
		
		getData: function (oController) {
			var sType = 				oController.byId("createunittype_unittype").getValue(),
				sIdArea=				oController.byId("createunittype_area").getSelectedKey();
				
			var aData = [parseInt(sIdArea),sType];
			return aData;
		},
		
		cleanForm: function (oController) {
			oController.byId("createunittype_unittype").setValue(null);
		}
		
	};
	
	return UnitTypes;
},true);