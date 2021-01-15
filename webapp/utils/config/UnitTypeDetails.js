sap.ui.define([
	"sap/m/MessageToast",
	"sap/m/MessageBox"
	],function(MessageToast, MessageBox) {
	
	var UnitTypeDetails = {
		
		getData: function (oController, sIdType, sIdDensity) {
			var aUnitType = [
				parseInt(sIdType),
				oController.byId("updateunittype_type").getValue(),
				oController.byId("updateunittype_unitarea").getValue(),
				oController.byId("updateunittype_symbolarea").getValue(),
				oController.byId("updateunittype_startproduct").getValue(),
				oController.byId("updateunittype_udstartproduct").getValue(),
				oController.byId("updateunittype_symbolstartproduct").getValue(),
				oController.byId("updateunittype_product").getValue(),
				oController.byId("updateunittype_unitproduction").getValue(),
				oController.byId("updateunittype_symbolproduction").getValue(),
			];
			
			var aDensity = [
				parseInt(sIdDensity),
				parseInt(oController.byId("updateunittype_density").getValue()),
				oController.byId("updateunittype_unitdensity").getValue(),
				oController.byId("updateunittype_symboldensity").getValue(),
				oController.byId("updateunittype_startdate").getValue(),
				oController.byId("updateunittype_enddate").getValue(),
			];
			
			var aData = [aUnitType, aDensity];
			
			return aData;
		}
		
	};
	
	return UnitTypeDetails;
	
},this);