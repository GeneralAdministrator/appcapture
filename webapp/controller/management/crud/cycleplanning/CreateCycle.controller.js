sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"data/capture/for/sap/utils/management/Cycles"
	],function(BaseController, JSONModel, Cycles){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.management.crud.cycleplanning.CreateCycle",{
		
		onInit: function () {
			this.loadUnitTypes();
			this.lockDatePicker();
			this.oEventBus = this.getOwnerComponent().getEventBus();
			this.oEventBus.subscribe("loadCreateCycle", this.loadModel, this);
		},
		
		loadModel: function () {
			this.oEventBus.publish("loadModelProductionCycles");
			this.getOwnerComponent().loadModelPlannedCycles();
		},
		
		loadUnitTypes: function () {
			var sUrl = this.getBaseUrl()+"config/products_controller/getUnitType";
			var sId = "createcycle_unittype";
            var $this = this;
            $.ajax({
                url: sUrl,
                type:"GET",
                dataType:"JSON",
                contentType:"application/json",
                async:false,
                success: function (oData) {
                	var oModel = new JSONModel(oData);
                	$this.byId(sId).setModel(oModel);
                	$this._oModel = oModel;
                	$this.loadUnits();
                	$this.loadProducts();
                }
            });
		},
		
		changeUnitTypes: function () {
			this.loadUnits();
			this.loadProducts();
			
			try {
				this.cleanTable();
			} catch (err) {
				//
			}
		},
		
		loadUnits: function () {
			var oModel = this._oModel;
			var sIdUnitType = oModel.getProperty("/UnitTypes/0/IdType/");
			
			var sUrl = this.getBaseUrl()+"management/cycleplanning_controller/getProductionUnits",
				sId = "createcycle_units",
				aData =[parseInt(sIdUnitType)];
			this.getDataFromMySQLWithData(sUrl, sId, aData);
		},
		
		loadProducts: function () {
			var oModel = this._oModel;
			var sIdUnitType = oModel.getProperty("/UnitTypes/0/IdType/");
			
			var sUrl = this.getBaseUrl()+"management/cycleplanning_controller/getProducts",
				sId = "createcycle_products",
				aData =[parseInt(sIdUnitType)];
			this.getDataFromMySQLWithData(sUrl, sId, aData);
		},
		
		changeProduct: function () {
			this.cleanForm();
		},
		
		lockDatePicker: function () {
			var oDatePicker = this.byId("createcycle_startdate");
			
				oDatePicker.addEventDelegate({
					onAfterRendering: function () {
						oDatePicker.$().find("input").attr("readonly",true);
					}	
				});
		},
		
		changeDate: function (oEvent) {
			var sDate = oEvent.getSource().getValue(),
				sProduct = this.byId("createcycle_products").getSelectedKey(),
				aData = [sDate, [sProduct]];
				
			var sUrl = this.getBaseUrl()+"management/cycleplanning_controller/getSeasons",
				sId="createcycle_seasons";
			this.getDataFromMySQLWithData(sUrl, sId, aData);
		},
		
		onAdd: function () {
			var oData = Cycles.getDataForm(this);

			try {
				var oModel = this.byId("createcycle_table").getModel(),
					oProperty = oModel.getProperty("/Products"),
					newRow = oProperty.concat(oData);
					oModel.setProperty("/Products", newRow);
			} catch (err) {
				var oObj = {};
					oObj.Products = oData;
				var sJSON = JSON.stringify(oObj),
					oJSON = JSON.parse(sJSON);
				this.byId("createcycle_table").setModel(new JSONModel(oJSON));
			}
			
			this._deleteProduct();
			this.cleanForm();
		},
		
		_deleteProduct: function () {
			var iIndex = this.byId("createcycle_products").getSelectedIndex(),
				oModel = this.byId("createcycle_products").getModel(),
				oData = oModel.getData();
				oData.Products.splice(iIndex, 1);
				oModel.setData(oData);
		},
		
		addProduct: function (oEvent) {
			
			var oBinding = oEvent.getSource().getBindingContext(),
				sPath = oBinding.getPath(),
				iIndex = sPath.split("/").splice(-1).pop();
			var oModelTable = this.byId("createcycle_table").getModel();

			var aData = [];
			aData.push({
				"IdProduct":	oModelTable.getProperty("/Products/"+iIndex+"/IdProduct/"),
				"Product":		oModelTable.getProperty("/Products/"+iIndex+"/Product/"),
				"IdForm":		oModelTable.getProperty("/Products/"+iIndex+"/IdForm/"),
			});
			
			var oModel = this.byId("createcycle_products").getModel(),
				oProperty = oModel.getProperty("/Products/"),
				newRow = oProperty.concat(aData);
				oModel.setProperty("/Products/", newRow);
		},
		
		onDelete: function (oEvent) {
			this.addProduct(oEvent);
			var oBinding = oEvent.getSource().getBindingContext(),
				sPath = oBinding.getPath(),
				iIndex = sPath.split("/").splice(-1).pop();
				
			if (iIndex !== -1) {
				var oModel = this.byId("createcycle_table").getModel(),
					oData = oModel.getData();
					oData.Products.splice(iIndex, 1);
					oModel.setData(oData);
			}
			
			this.cleanForm();

		},
		
		cleanUnits: function () {
			var oUnits = this.byId("createcycle_units");
			var aKeys = oUnits.getSelectedItems();
			$.each(aKeys, function (index, oKey){
				oUnits.removeSelectedItem(oKey);
			});
		},
		
		cleanForm: function () {
			this.byId("createcycle_startdate").setValue(null);
			this.byId("createcycle_seasons").destroyItems();
		},
		
		cleanTable: function () {
			this.cleanForm();
			try {
				this.byId("createcycle_table").getModel().setData(null);
			} catch (err) {
				this.cleanForm();
			}
			this.loadProducts();
		},
		
		onSave: function () {
			var aData = Cycles.getData(this);
			var sUrl = this.getBaseUrl()+"management/cycleplanning_controller/insertProductionCycle";
			this.insertDataIntoDatabase(sUrl, aData, this);   
			this.cleanTable();
			this.onNavCyclePlanning();
		},
		
		onNavCyclePlanning: function () {
			this.getRouter().navTo("cyclePlanning");
		}
		
	});
});