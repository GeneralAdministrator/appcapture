sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/EventBus",
	"data/capture/for/sap/utils/config/SowingDensity"
	],function(BaseController, JSONModel, EventBus, SowingDensity){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.config.CreateSowingDensity",{
		
		onInit: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.subscribe("loadModelCreateSowingProducts", this.loadProducts, this);
		},
		
		onBeforeRendering: function () {
			this.loadProducts();
		},
		
		loadModel: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.publish("loadModelSowingDensity");
		},
		
		loadProducts: function () {
			var sUrl = this.getBaseUrl()+"config/sowingdensity_controller/getProducts";
			var sId = "createsowingdensity_products";
           var $this = this;
            $.ajax({
                url: sUrl,
                type:"GET",
                dataType:"JSON",
                contentType:"application/json",
                async:false,
                success: function (oData) {
                	var oModel = new JSONModel(oData);
					var aId = [oModel.getProperty("/ListProducts/0/IdProduct/")];
					$this.byId(sId).setModel(oModel);
					$this.loadSeasons(aId);
					SowingDensity.loadUnitDensity($this);
                }
            });
		},
		
		loadSeasons: function (aData) {
			var sUrl = this.getBaseUrl()+"config/sowingdensity_controller/getSeasons";
			var sId ="createsowingdensity_seasons";
			this.getDataFromMySQLWithData(sUrl, sId, aData);
		},
		
		changeProduct: function (oEvent) {
			var sProduct = oEvent.getSource().getSelectedItem().getText();
			var aIdProduct = [oEvent.getSource().getSelectedKey()];

			this.loadSeasons(aIdProduct);
			SowingDensity.loadUnitDensity(this);

			try {
				this.cleanTable();
			} catch (err) {
				//
			}
		},
				
		onAdd: function () {
			
			var aData = SowingDensity.getDataForm(this);

			try {
				var oModel = this.byId("createsdensity_table").getModel();
				var oProperty = oModel.getProperty("/ListSeasons/");
				var newRow = oProperty.concat(aData);
				oModel.setProperty("/ListSeasons",newRow);
			} catch (err) {
				var oData = {};
					oData.ListSeasons = aData;
				var sJSON = JSON.stringify(oData),
					oJSON = JSON.parse(sJSON);
				this.byId("createsdensity_table").setModel(new JSONModel(oJSON));
			}
			this.updateModelSeasons();
				
		},
		
		onDelete: function (oEvent) {
			this.updatedModelSeasons(oEvent);
			var sPath = oEvent.getSource().getBindingContext().getPath();
			var sIndex = sPath.split("/");
			var iIndex = parseInt(sIndex[2]);
				if (iIndex !== -1) {
					var oModel = this.byId("createsdensity_table").getModel(), 
					    aData = oModel.getData();
					aData.ListSeasons.splice(iIndex, 1);
					oModel.setData(aData);
				}
		},
		
		updateModelSeasons: function () {
			var iIndex = this.byId("createsowingdensity_seasons").getSelectedIndex();
			var oModel = this.byId("createsowingdensity_seasons").getModel(),
				aData = oModel.getData();
			aData.ListSeasons.splice(iIndex, 1);
			oModel.setData(aData);
		},
		
		updatedModelSeasons: function (oEvent) {
			var oModel = this.byId("createsdensity_table").getModel();
			var sPath = oEvent.getSource().getBindingContext().getPath();
			var sIndex = sPath.split("/");
			var iIndex = parseInt(sIndex[2]);

			var oData = [{
				"IdStation":	oModel.getProperty("/ListSeasons/"+iIndex+"/IdSeason/"),
				"Station":		oModel.getProperty("/ListSeasons/"+iIndex+"/Season/")
			}];
			
			var oModelSeasons = this.byId("createsowingdensity_seasons").getModel();
			var oProperty = oModelSeasons.getProperty("/ListSeasons/");
			var newRow = oProperty.concat(oData);
				oModelSeasons.setProperty("/ListSeasons",newRow);
		},
		
		cleanTable: function () {
			this.byId("createsdensity_table").getModel().setData(null);
		},
		
		onSave: function () {
			var aData = SowingDensity.getData(this);
			var sUrl = this.getBaseUrl()+"config/sowingdensity_controller/insertSowingDensity";
			this.insertDataIntoDatabase(sUrl, aData, this);
			this.onNavToSowingDensity();
			SowingDensity.cleanForm(this);
		},
		
		onNavToSowingDensity: function () {
			this.getRouter().navTo("sowingDensity");
		},
		
		cleanForm: function () {
			this.cleanTable();
			SowingDensity.cleanForm(this);
		}
			
	});
});