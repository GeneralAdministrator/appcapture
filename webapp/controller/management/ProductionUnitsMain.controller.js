sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"data/capture/for/sap/model/formatter",
	"data/capture/for/sap/utils/management/ProductiveUnit"
	],function(BaseController, Filter, FilterOperator, Fragment, MessageBox, formatter, ProductiveUnit){
	"use strict";
	return BaseController.extend("data.capture.for.sap.controller.management.ProductionUnitsMain",{
		
		formatter: formatter,
		
		onInit: function () {
			this.loadModel();
		},
		
		loadModel: function () {
			this.getOwnerComponent().loadModelProductionUnits();                         	
		},
		
		onFilterSelect: function (oEvent) {
			var oBinding = this.byId("productionunitsmain_table").getBinding("items"),
				sKey = oEvent.getParameter("key"),
				aFilters = [],
				oFilter;
				
			switch(sKey) {
				case 'Activas':
					oFilter = new Filter("Statu", FilterOperator.EQ, "Activo");
					break;
				case 'Mantenimiento':
					oFilter = new Filter("Statu", FilterOperator.EQ, "Mantenimiento");
					break;
				case 'Inactivas':
					oFilter = new Filter("Statu", FilterOperator.EQ, "Inactivo");
					break;
				default: oFilter = new Filter();
			}
			
			aFilters.push(oFilter);
			oBinding.filter(aFilters);
		},
		
		openGoogleMap: function () {
			this.confirmRegisterType();
		},
		
		openDialog: function () {
			var oView = this.getView();
			if (!this.byId("createproductionunit_without_googlemap")) {
				Fragment.load({
					id: oView.getId(),
					name: "data.capture.for.sap.view.management.crud.productiveunit.CreateProductiveUnitWithoutGoogleMap",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("createproductionunit_without_googlemap").open();
			}
		},
		
		closeDialog: function () {
			ProductiveUnit.cleanForm(this);
			this.byId("createproductionunit_without_googlemap").destroy();
		},
		
		loadModelsInFragment: function () {
			this.loadUnitTypeModel();
		},
		
		loadUnitTypeModel: function () {
			var oModel = this.byId("createProductionUnit_unittype").getModel();
			var sUrl = this.getBaseUrl()+"management/productionunits_controller/getUnitTypeModel";
			var sId = "createProductionUnit_unittype";
			this.getDataFromMySQL(sUrl, sId);
			this.loadProductModel();
		},
		
		loadProductModel: function () {
			var oItem = this.byId("createProductionUnit_unittype").getFirstItem();
			var sKey = oItem.getKey();
			var sUrl = this.getBaseUrl()+"management/productionunits_controller/getProductModel";
			var sId="createProductionUnit_product";
			var aData = [sKey];
			this.getDataFromMySQLWithData(sUrl, sId, aData);
			this.loadSymbolUnitTypeModel(oItem);
		},
		
		changeProductModel: function (oEvent) {
			var oSource = oEvent.getSource(),
				oItem = oSource.getSelectedItem(),
				sKey = oItem.getKey();
			var sUrl = this.getBaseUrl()+"management/productionunits_controller/getProductModel";
			var sId="createProductionUnit_product";
			var aData = [sKey];
			this.getDataFromMySQLWithData(sUrl, sId, aData);
			this.loadSymbolUnitTypeModel(oItem);
		},
		
		loadSymbolUnitTypeModel: function (oItem) {
			var oModel = this.byId("createProductionUnit_unittype").getModel();
			var sPath = oItem.getBindingContext().getPath();
			var sSymbolType = oModel.getProperty(sPath+"/Symbol/");
			this.byId("createProductionUnit_unitarea").setValue(sSymbolType);
		},
		
		onNavDetails: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext("productionUnits");
			var sPath = oBinding.getPath();
			var iIndex = sPath.split("/").splice(-1).pop();
			
			var sIdUnit =			oBinding.getProperty("/ProductionUnits/Units/"+iIndex+"/IdUnit/"),
				sIdProduct =		oBinding.getProperty("/ProductionUnits/Units/"+iIndex+"/IdProduct/");
				
			this.getRouter().navTo("productionUnitsMainDetails",{
				idunit: sIdUnit,
				idproduct: sIdProduct,
				index: iIndex
			});
		},
		
		confirmRegisterType: function () {
			var $this = this;
			MessageBox.confirm(this.getResourceBundle().getText("ProductionUnits.confirm.register"),{
				actions: ["Si","No"],
				emphasizedAction: "Si",
				onClose: function (sAction) {
					if (sAction === "Si") {
						$this.getRouter().navTo("productionUnitsGooglemap");
					} else {
						$this.openDialog();
					}
				}
			});
		},
		
		onSave: function () {
			var aData = ProductiveUnit.getData(this);
			var sUrl = this.getBaseUrl()+"management/productionunits_controller/insertProductionUnit";
			this.insertDataIntoDatabase(sUrl, aData, this);
			this.closeDialog();
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.publish("loadModelProductionsUnitsGoogleMap");
		}
	});
});