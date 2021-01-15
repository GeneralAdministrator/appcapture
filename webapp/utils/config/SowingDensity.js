sap.ui.define([
	"sap/m/MessageToast"
	],function(MessageToast){
	"use strict";
	
	var SowingDensity = {
		
		getData: function (oController) {
			var oModel =	oController.byId("createsdensity_table").getModel();
			var oData = 	oModel.getData();
			var iIndex =	oData.ListSeasons.length;
		
			var aAllData = [];
			for (var i = 0; i < iIndex; i++) {
				aAllData.push(
					[
						oModel.getProperty("/ListSeasons/"+i+"/IdSeason/"),
						parseInt(oModel.getProperty("/ListSeasons/"+i+"/Density/")),
						oModel.getProperty("/ListSeasons/"+i+"/UnitDensity/"),
						oModel.getProperty("/ListSeasons/"+i+"/SymbolDensity/"),
						oModel.getProperty("/ListSeasons/"+i+"/StartDate/"),
						oModel.getProperty("/ListSeasons/"+i+"/EndDate/")
					]
				);
			}	
			
			return aAllData;
		},
		
		getDataForm: function (oController) {
			var aData = [];
				aData.push({
					"IdType":			oController.byId("createsowingdensity_products").getSelectedItem().getAdditionalText(),
					"IdProduct":		oController.byId("createsowingdensity_products").getSelectedKey(),
					"Product":			oController.byId("createsowingdensity_products").getSelectedItem().getText(),
					"IdSeason": 		oController.byId("createsowingdensity_seasons").getSelectedKey(),
					"Season":			oController.byId("createsowingdensity_seasons").getSelectedItem().getText(),
					"Density":			oController.byId("createsowingdensity_density").getValue(),
					"UnitDensity":		oController.byId("createsowingdensity_uddensity").getValue(),
					"SymbolDensity":	oController.byId("createsowingdensity_symboldensity").getValue()
				});
			return aData;
		},
		
		loadUnitDensity: function (oController) {

				var oModel = oController.byId("createsowingdensity_products").getModel();
				var iIndex = oController.byId("createsowingdensity_products").getSelectedIndex();
				
				var sProduct = oModel.getProperty("/ListProducts/"+iIndex+"/Product");
				var sUnitArea= oModel.getProperty("/ListProducts/"+iIndex+"/UnitArea");
				var sSymbolArea = oModel.getProperty("/ListProducts/"+iIndex+"/SymbolArea");

				if (sProduct === undefined && sSymbolArea === undefined) {
					oController.byId("createsowingdensity_uddensity").setValue(null);
					oController.byId("createsowingdensity_symboldensity").setValue(null);
				} else {
					oController.byId("createsowingdensity_uddensity").setValue(sProduct+" x "+sUnitArea);
					oController.byId("createsowingdensity_symboldensity").setValue(sProduct+" x "+sSymbolArea);
				}	
		},
		
		cleanTable: function (oController) {
			oController.byId("createsdensity_table").getModel().setData(null);
		},
		
		cleanForm: function (oController) {
			oController.byId("createsdensity_table").getModel().setData(null);
			oController.byId("createsowingdensity_density").setValue(null);
		}
		
	};
	
	return SowingDensity;
},true);