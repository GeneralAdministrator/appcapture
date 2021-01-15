sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"data/capture/for/sap/model/formatter",
	"data/capture/for/sap/utils/management/Cycles"
	],function(BaseController,Fragment,JSONModel, MessageBox, Filter, FilterOperator, formatter, Cycles){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.management.ProductionCycles",{
		
		formatter: formatter,
		
		onInit: function () {
			this.loadModel();	
		},
		
		loadModel: function () {
			this.getOwnerComponent().loadModelProductionCycles();          
		},
		
		loadAllModel: function () {
			this.lockComboBox();
		},
	
		changeUnitTypes: function (oEvent) {
			var oSource = oEvent.getSource(),
				aUnitType = [parseInt(oSource.getSelectedItem().mProperties.key)];
			this.loadProductiveCycles(aUnitType[0]);
		},

		onSave: function () {
			var sUrl = this.getBaseUrl()+"management/productioncycles_controller/insertProductionCycle";
			var aData = Cycles.getData(this);
			this.insertDataIntoDatabase(sUrl, aData, this);
			this.closeDialog();
		},
		
		onFilterSelect: function (oEvent) {
			var oBinding = this.byId("productioncycles_table").getBinding("items"),
				sKey = oEvent.getParameter("key"),
				aFilters = [],
				oFilter;

			switch(sKey) {
				case "En produccion":
					oFilter = new Filter("Statu", FilterOperator.EQ, sKey);
					break;
				case 'Mantenimiento':
					oFilter = new Filter("Statu", FilterOperator.EQ, sKey);
					break;
				case 'En espera':
					oFilter = new Filter("Statu", FilterOperator.EQ, sKey);
					break;
				case 'Culminados':
					oFilter = new Filter("Statu", FilterOperator.EQ, sKey);
					break;
				default: oFilter = new Filter();
			}
			
			aFilters.push(oFilter);
			oBinding.filter(aFilters);
		},
		
		openCloseCycle: function () {
			var oView = this.getView();
			
			if (!this.byId("closecycle_dialog")) {
				
				Fragment.load({
					id: oView.getId(),
					name:"data.capture.for.sap.view.management.CloseCycle",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
				
			} else {
				this.byId("closecycle_dialog").open();
			}
		},
		
		closeCloseCycle: function () {
			this.byId("closecycle_dialog").close();	
		},
		
		onOpenDialogCloseCycle: function (oEvent) {
			var oView = this.getView();
			var oObject = oEvent.getSource().getBindingContext().getObject();
			var $this = this;
			
			if (!this.byId("closecycle_dialog")) {
				
				Fragment.load({
					id: oView.getId(),
					name:"data.capture.for.sap.view.management.crud.productivecycle.CloseCycle",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
			
			} else {
				this.byId("closecycle_dialog").destroy();	
			}
		},
		
		onCloseDialogClosecycle: function () {
			this.byId("closecycle_dialog").destroy();
			Cycles.cleanCloseCycle(this);
		},
		
		onCloseCycle: function () {
			var sUrl = this.getBaseUrl()+"management/productioncycles_controller/closeCycle";
			var aData = Cycles.getDataCloseCycle(this);
			this.updateDataIntoDatabase(sUrl, aData, this);
			this.onCloseDialogClosecycle();
		},
		
		onNavCycleSummary: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext("productionCycles"),
				sPath = oBinding.getPath();
			var index = sPath.split("/").slice(-1).pop();
			
			var oModel = this.getView().getModel("productionCycles"),
				sStatu = oModel.getProperty(sPath+"/Statu/");

				switch(sStatu) {
					case "En produccion": 
						this.getRouter().navTo("cycleSummary",{
							index: index
						});
					break;
					case "Mantenimiento":
						alert("Mantenimiento");	
					break;
					case "En espera":
						alert("Planificado");	
					break;
					case "Culminado":
						alert("Cullminado");	
					break;
				}

		}
	});
});