sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
	],function(ManagedObject, Fragment, JSONModel) {
	"use strict";
	
	return ManagedObject.extend("data/capture/for/sap/controller/management/CreateProductionUnit",{
		
		constructor: function (oView) {
			this._oView = oView;
		},
		
		exit: function () {
			delete this._oView;	
		},
		
		openCreateProductionUnit: function (sTypeRegister) {
			var oView = this._oView;
			var oController = oView.getController();
			
			if (!oView.byId("create_production_unit")) {
				
				var oFragmentController = {
					closeCreateProductionUnit: function () {
						oView.byId("create_production_unit").close();
					},
					
					afterOpenLoadModels: function () {
						var sUrl1 = oController.getBaseUrl()+"management/productionunits_controller/getZoneModel";
						var sUrl2 = oController.getBaseUrl()+"management/productionunits_controller/getUnitTypeModel";
						var sId1 ="createProductionUnit_zone";
						var sId2 ="createProductionUnit_unittype";
						oController.getDataFromMySQL(sUrl1, sId1);
						oController.getDataFromMySQL(sUrl2, sId2);
						var oItem = oController.byId("createProductionUnit_unittype").getFirstItem();
						var aData = [oItem.getAdditionalText()];
						this.loadUnitTypeModel(aData);
						this.loadSymbolUnitTypeModel(oItem);
					},
					
					changeUnitTypeModel: function (oEvent) {
						var oSource = oEvent.getSource();
						var aData = [oSource.getSelectedKey()];
						var oItem = oSource.getSelectedItem();
						this.loadUnitTypeModel(aData);
						this.loadSymbolUnitTypeModel(oItem);
					},
					
					loadUnitTypeModel: function (aData) {
						var sUrl = oController.getBaseUrl()+"management/productionunits_controller/getProductModel";
						var jqXHR = $.post(sUrl,{
							data: aData,
							dataType:"JSON"
						},"JSON");
						
						jqXHR.done(function(data){
							var oJSON = JSON.parse(data);
							var oModel = new JSONModel(oJSON);
							oController.byId("createProductionUnit_product").setModel(oModel);
						});
					},
					
					loadSymbolUnitTypeModel: function (oItem) {
						var oModel = oController.byId("createProductionUnit_unittype").getModel();
						var sPath = oItem.getBindingContext().getPath();
						var sSymbolType = oModel.getProperty(sPath+"/Symbol/");
						oController.byId("createProductionUnit_unitarea").setValue(sSymbolType);
					},
					
					initValue: function () {
						if (sTypeRegister === "GoogleMaps") {
							var oBinding = oController.byId("createProductionUnit_unittype").getSelectedItem().getBindingContext(); 
							var sArea = oBinding.getProperty("Symbol"),
								sProduction = oBinding.getProperty("SymbolProduction");
							oController.byId("createProductionUnit_area").setValue(oController.getArea());
						}
					}
				};
				
				Fragment.load({
					id: oView.getId(),
					name: "data.capture.for.sap.view.management.CreateProductionUnit",
					controller: oFragmentController
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});

			} else {
				oView.byId("create_production_unit").open();
			}
		}
	});
});