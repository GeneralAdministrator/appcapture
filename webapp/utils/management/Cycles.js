sap.ui.define([
	"sap/m/MessageToast"
	],function(MessageToast){
	"use strict";
	
	var Cycles = {
		
		getData: function (oController) {
			
			var aData = [];
			var aUnits = oController.byId("createcycle_units").getSelectedKeys(),
				aProducts = oController.byId("createcycle_table").getModel().getData().Products;
				
			aData = [aUnits, aProducts];

			return aData;
		},
		
		getDataForm: function (oController) {
			
			var sDate = oController.byId("createcycle_startdate").getValue(),
				oModel = oController.byId("createcycle_seasons").getModel(),
				iIndex = oController.byId("createcycle_seasons").getSelectedIndex(),
				sStart = oModel.getProperty("/Seasons/"+iIndex+"/StartDate/"),
				sEnd = oModel.getProperty("/Seasons/"+iIndex+"/EndDate/");
			var sEndDate = oController.addDays(sStart, sEnd, sDate);
			
			var aData = [];
			aData.push({
				"Date":			oController.byId("createcycle_startdate").getValue(),
				"EndDate":		sEndDate,
				"IdProduct":	oController.byId("createcycle_products").getSelectedKey(),
				"Product":		oController.byId("createcycle_products").getSelectedItem().getText(),
				"IdForm":		oController.byId("createcycle_products").getSelectedItem().getAdditionalText(),
				"IdStation":	oController.byId("createcycle_seasons").getSelectedKey(),
				"Station":		oController.byId("createcycle_seasons").getSelectedItem().getText(),
			});
			return aData;
		},
		
		addProduct: function (iIndex, oModel){
			var aData = [];
			
			aData.push({
				"IdProduct":	oModel.getProperty("/Products/"+iIndex+"/IdProduct/"),
				"Product":		oModel.getProperty("/Products/"+iIndex+"/Product/"),
				"IdForm":		oModel.getProperty("/Products/"+iIndex+"/IdForm/"),
			});
			
			return aData;
		},
		
		getDataCloseCycle: function (oController) {
			
			var sTitle = oController.byId("closecycle_dialog").getTitle();
			var iIdCycle = this.getIdCycle(sTitle);
			var sUnitName = this.getUnitName(sTitle);
			
			var aData = [
				parseFloat(oController.byId("closecycle_cantproduct").getValue()),
				oController.getToday(),
				iIdCycle,
				sUnitName
			];
			
			return aData;
		},
		
		cleanForm: function (oController) {
			oController.byId("createcycle_listunit").destroyItems();
			oController.byId("createcycle_listproducts").destroyItems(null);
			oController.byId("createcycle_seasons").destroyItems();
			oController.byId("createcycle_startdate").setValue(null);
			oController.byId("createcycle_enddate").setValue(null);
		},
		
		cleanCloseCycle: function (oController) {
			oController.byId("closecycle_cantproduct").setValue(null);
		}
		
	};
	
	return Cycles;
},this);