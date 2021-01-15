sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"data/capture/for/sap/model/formatter",
	"sap/ui/core/EventBus",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
	],function(BaseController, formatter, EventBus, JSONModel, MessageToast, MessageBox){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.config.ListFarms",{
		
		formatter: formatter,
		
		onInit: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.subscribe("loadModelFarm",this.loadModel, this);
			this.loadModel();	
		},
		
		onNavFarm: function () {
			this.getRouter().navTo("farm");
		},
		
		loadModel: function () {
			var sUrl = this.getBaseUrl()+"config/farm_controller";
			var sId="listfarms_gridlist";
			this.getDataFromMySQL(sUrl, sId);            
		},
		
		loadDefault: function () {
			var oModel = sap.ui.require.toUrl("data.capture.for.sap.model.ListFarms.json");	
				this.byId("listfarms_table").setModel(new JSONModel(oModel));
		},
		
		onEdit: function () {
				
		},
		
		onDelete: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext();
			var sFarmName = oBinding.getProperty("FarmName");
			
			var $this = this;
			var sUrl = this.getBaseUrl()+"config/farm_controller/deleteFarm";
			var oData = [];
				oData.push(sFarmName);

			MessageBox.confirm(this.getResourceBundle().getText("ListFarms.delete")+sFarmName+"?",{
				actions:[MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.Ok,
				onClose: function (sAction) {
					if (sAction === "OK") {
						var jqXHR = $.post(sUrl,{
							data: oData
						});
						jqXHR.done(function(){
							MessageToast.show($this.getResourceBundle().getText("Generic.delete.ok"));
							$this.loadModel();
						});
						jqXHR.fail(function () {
							MessageToast.show($this.getResourceBundle().getText("Generic.delete.failed"));	
						});
					}
				}
			});
		},
		
		onUpdate: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext();
			var sFarmName = oBinding.getProperty("FarmName");
			var $this = this;
			var sUrl = this.getBaseUrl()+"config/farm_controller/updateDefault";
			var aData = [];
				aData.push(sFarmName);
			
			MessageBox.confirm(this.getResourceBundle().getText("ListFarms.update")+sFarmName+"?",{
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if (sAction === "OK") {
						var jqXHR = $.post(sUrl,{
							data: aData
						});
						jqXHR.done(function(){
							MessageToast.show($this.getResourceBundle().getText("Generic.update.ok"));
							$this.loadModel();
							$this.updateAllModels();
						});
						jqXHR.fail(function () {
							MessageToast.show($this.getResourceBundle().getText("Generic.update.failed"));	
						});
					}
				}
			});
		},
		
		updateAllModels: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.publish("loadModelUnitTypes");
				oEventBus.publish("loadModelProducts");
				oEventBus.publish("loadModelSeasons");
				oEventBus.publish("loadModelSowingDensity");
				oEventBus.publish("loadModelCreateSowingProducts");
				oEventBus.publish("loadModelVariables");
				oEventBus.publish("loadModelForms");
				//Modelos de la Unidad Productiva
				oEventBus.publish("loadModelProductionUnits");
				//oEventBus.publish("loadModelProductionsUnitsUnitstype");
				oEventBus.publish("loadModelProductionsUnitsGoogleMap");
				//Modelos de crear subproductoa
				oEventBus.publish("selectUnitTypes");
				oEventBus.publish("selectForm");
				this.getOwnerComponent().loadModelNormalValues();
		}
			
	});
});