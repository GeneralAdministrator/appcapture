sap.ui.define([
	"sap/m/MessageToast"
	],function(MessageToast){
	"use strict";
	
	var CreateSubproducts = {
		
		getDataForm: function (oController) {
			var aData = [];
			aData.push({
				"Form":					oController.byId("createsubproducts_forms").getSelectedItem().getText(),
				"IdForm":				oController.byId("createsubproducts_forms").getSelectedKey(),
				"Product":				oController.byId("createsubproducts_form1").getValue(),
				"UnitProduct":			oController.byId("createsubproducts_form2").getValue(),
				"SymbolProduct":		oController.byId("createsubproducts_form3").getValue(),
				"Subproduct":			oController.byId("createsubproducts_form4").getValue(),
				"UnitSubproduct":		oController.byId("createsubproducts_form5").getValue(),
				"SymbolSubproduct":		oController.byId("createsubproducts_form6").getValue()
			});
			
			return aData;
		},
		
		getDataTable: function (oController) {
			var oModel = oController.getView().getModel("subproduct"),
				oData = oModel.getData();

			var aDataProduct = [],
				aDataSubproduct = [],
				aData = [];
			var iIdType = parseInt(oController.byId("createsubproducts_unittypes").getSelectedKey()),
				iIdForm = parseInt(oController.byId("createsubproducts_forms").getSelectedKey());
				
				aDataProduct.push(
					iIdType,
					iIdForm,
					oModel.getProperty("/Subproducts/0/Product"),
					oModel.getProperty("/Subproducts/0/UnitProduct"),
					oModel.getProperty("/Subproducts/0/SymbolProduct")
				);
				
			for (var i = 0; i < oData.Subproducts.length; i++) {
				aDataSubproduct.push(
					[
						iIdType,
						oModel.getProperty("/Subproducts/"+i+"/Subproduct"),
						oModel.getProperty("/Subproducts/"+i+"/UnitSubproduct"),
						oModel.getProperty("/Subproducts/"+i+"/SymbolSubproduct")
					]
				);
			}
			
				aData.push(aDataProduct);
				aData.push(aDataSubproduct);

			return aData;
			
		},
		
		cleanForm: function (oController) {
			for (var i = 0; i < 6; i++) {
				oController.byId("createsubproducts_form"+(i+1)).setValue(null);
			}
		},
		
		cleanSubproduct: function (oController) {
			for (var i = 4; i < 7; i++) {
				oController.byId("createsubproducts_form"+i).setValue(null);
			}
		}
		
	};
	
	return CreateSubproducts;
},true);