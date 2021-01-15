sap.ui.define([
	"sap/m/MessageToast"
	],function(MessageToast){
	"use strict";
	
	var Seasons = {
		
		getData: function (oController) {

			var aData =[
				oController.byId("createseasons_product").getSelectedKey(),
				oController.byId("createseasons_seasons").getValue(),
				oController.byId("createseasons_startdate").getValue(),
				oController.byId("createseasons_enddate").getValue()
			];
			return aData;
		},
		
		cleanForm: function (oController) {
			oController.byId("createseasons_seasons").setValue(null);
			oController.byId("createseasons_startdate").setValue(null);
			oController.byId("createseasons_enddate").setValue(null);
		}
	};
	
	return Seasons;
},this);