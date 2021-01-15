sap.ui.define([
	"sap/m/MessageToast"
	],function(MessageToast){
	
	
	var CyclePlanning = {
		
		getDataActivateCycle: function (oController, idCycle, idUnit) {
			var aData = [
				parseFloat(oController.byId("activecycle_cantproduct").getValue()),
				oController.getToday(),
				idCycle,
				idUnit
			];
			
			return aData;
		},
		
		getDataUpdate: function (oController, iId) {
			var aData = [
				oController.byId("updatecycle_startdate").getValue(),
				oController.byId("updatecycle_enddate").getValue(),
				iId
			];
			
			return aData;
		},
		
	};
	
	return CyclePlanning;
	
}, this);