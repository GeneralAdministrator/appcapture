sap.ui.define([
	"sap/m/MessageToast"
	],function(MessageToast){
	"use strict";
	
	var SamplingDetail = {
		
		getData: function (oController, iCont, sPath) {
			var aData = [];
			var aInsert = [];
			var oModel = oController.getModel("sampling");

			for (var i = 0; i < iCont; i++) {
				var sId = "samplingdetail_input"+i;
				aData.push(
					parseInt(oModel.getProperty(sPath+"/IdUnit/")),
					parseInt(oModel.getProperty(sPath+"/IdCycle/")),
					parseInt(oModel.getProperty(sPath+"/IdSample/")),
					parseInt(oController.byId(sId).getSelectedKey()),
					oController.byId(sId).getValue(),
					oModel.getProperty(sPath+"/IdUser/")
				);
				aInsert.push(aData);
				aData = [];
			}
			
			return aInsert;
		},
		
		cleanForm: function (oController, iCont) {
			for (var i = 0; i < iCont; i++) {
				var sId = "samplingdetail_input"+i;
				oController.byId(sId).setValue("");
			}
		}
		
	};
	
	return SamplingDetail;
}, true);