sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/EventBus",
	"data/capture/for/sap/utils/config/CreateSubproducts"
	],function(BaseController, JSONModel, EventBus, CreateSubproducts){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.config.CreateSubproducts",{
		
		onInit: function () {
			this.loadUnitTypes();
			this.loadForm();
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.subscribe("selectUnitTypes", this.loadUnitTypes, this);
				oEventBus.subscribe("selectForm", this.loadForm, this);
		},
		
		loadModel: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.publish("loadModelProducts");
				oEventBus.publish("loadModelCreateSowingProducts");
		},
		
		loadUnitTypes: function () {
			var sUrl = this.getBaseUrl()+"config/products_controller/getUnitType";
			var sId = "createsubproducts_unittypes";
			this.getDataFromMySQL(sUrl, sId);
		},
		
		loadForm: function () {
			var sUrl = this.getBaseUrl()+"config/products_controller/getForm";
			var sId = "createsubproducts_forms";
			this.getDataFromMySQL(sUrl, sId);
		},
		
		onNavToProducts: function () {
			this.getRouter().navTo("products");	
		},
	
		onAdd: function () {
			var aData = CreateSubproducts.getDataForm(this);
			this.cleanSubProduct();

			try{
				var oModel = this.getView().getModel("subproduct"),
					sProperty = oModel.getProperty("/Subproducts"),
					newRow = sProperty.concat(aData);
					oModel.setProperty("/Subproducts", newRow);
			} catch(err) {
				var oData = {};
					oData.Subproducts = aData;
				var sJSON = JSON.stringify(oData),
					oJSON = JSON.parse(sJSON);
				this.getView().setModel(new JSONModel(oJSON),"subproduct");
			}
		},
		
		onDelete: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("subproduct").getPath();
			var iIndex = sPath.split("/").slice(-1).pop();

				if(iIndex !== -1) {
					var oModel = this.getView().getModel("subproduct"),
						oData = oModel.getData();
						oData.Subproducts.splice(iIndex, 1);
						oModel.setData(oData);
				}
		},
		
		onSave: function () {
			var sUrl = this.getBaseUrl()+"config/products_controller/insertProduct";
			var aData = CreateSubproducts.getDataTable(this);
			this.insertDataIntoDatabase(sUrl, aData, this);
			this.onNavToProducts();
			this.loadModel();
			this.cleanAll();
		},
		
		onCancel: function () {
			try {
				this.getView().getModel("subproduct").setData(null);
				this.cleanForm();
			} catch(err) {
				this.cleanForm();
			}

		},
		
		cleanAll: function () {
			this.getView().getModel("subproduct").setData(null);
			this.cleanForm();
		},
		
		cleanSubProduct: function () {
			CreateSubproducts.cleanSubproduct(this);
		},
		
		cleanForm: function () {
			CreateSubproducts.cleanForm(this);
		}
		
	});
});