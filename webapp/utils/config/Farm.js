sap.ui.define([
	"sap/m/MessageToast"
	],function(MessageToast){
	"use strict";
	
	var Farm = {
		
		check: function (oController) {
			var sNombre =	oController.byId("createfarm_name").getValue().length;
			var iCant=		oController.byId("createfarm_cantunit").getValue().length;
			if (sNombre === 0 && iCant === 0) {
				MessageToast.show(oController.getResourceBundle().getText("CreateFarm.all"));
				return false;
			} else if (sNombre === 0 && iCant > 0) {
				MessageToast.show(oController.getResourceBundle().getText("CreateFarm.name"));
				return false;
			} else if (sNombre > 0 && iCant === 0) {
				MessageToast.show(oController.getResourceBundle().getText("CreateFarm.cant"));
				return false;	
			} else {
				return true;
			}
		},
		
		getData: function (oController) {
			var sNombre =	oController.byId("createfarm_name").getValue();
			var iCant = 	parseInt(oController.byId("createfarm_cantunit").getValue());
			var fLat =		parseFloat(oController.byId("createfarm_lat").getValue());
			var fLng =		parseFloat(oController.byId("createfarm_lng").getValue());
			
			var aData = [sNombre, fLat, fLng, iCant];
			
			return aData;
		},
		
		cleanForm: function (oController) {
			oController.byId("createfarm_name").setValue(null);
			oController.byId("createfarm_cantunit").setValue(null);
			oController.byId("createfarm_lat").setValue(null);
			oController.byId("createfarm_lng").setValue(null);
		}
		
	};
	
	return Farm;
},true);