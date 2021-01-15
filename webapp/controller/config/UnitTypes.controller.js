sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/EventBus",
	"data/capture/for/sap/utils/config/UnitTypes"
	],function(BaseController, Fragment, MessageToast, EventBus, MessageBox, UnitTypes){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.config.UnitTypes",{
		
		onInit: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.subscribe("loadModelUnitTypes", this.loadModel, this);
			this.loadModel();	
		},
		
		loadModel: function () {
			var sUrl = this.getBaseUrl()+"config/unittypes_controller";
			var sId= "unittype_gridlist";
			this.getDataFromMySQL(sUrl, sId);
		},
		
		loadModelAreas: function () {
			var sUrl = this.getBaseUrl()+"config/unittypes_controller/getMagnitudes";
			var sId= "createunittype_area";
			this.getDataFromMySQL(sUrl, sId);
			this.lockComboBox();
		},
		
		openCreateUnitType: function () {
			var oView = this.getView();
			var $this = this;
			
			if (!this.byId("create_unittype")) {
				Fragment.load({
					id: oView.getId(),
					name: "data.capture.for.sap.view.config.CreateUnitType",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("create_unittype").open();
			}
		},
		
		closeCreateUnitType: function () {
			UnitTypes.cleanForm(this);
			this.byId("create_unittype").close();
		},
		
		lockComboBox: function () {
			var oComboBox = this.byId("createunittype_area");
			
				oComboBox.addEventDelegate({
					onAfterRendering: function () {
						oComboBox.$().find("input").attr("readonly",true);
					}
				});
		},
		
		onSave: function () {
			if (UnitTypes.check(this)) {
				var sUrl =this.getBaseUrl()+"config/unittypes_controller/insertUnitType";
				var aData = UnitTypes.getData(this);
				this.insertDataIntoDatabase(sUrl, aData, this);
				this.closeCreateUnitType();
			}
		},
		
		onEdit: function (oEvent) {
			var oView = this.getView();
			var oBinding = oEvent.getSource().getBindingContext();
			var oItem = oBinding.getProperty("Type");
			var sPath = oBinding.getPath();
			var aIndex = sPath.split("/"),
				iIndex = parseInt(aIndex[2]);
			var oRow = this.byId("unittype_table");
				Fragment.load({
					id: oView.getId(),
					name: "data.capture.for.sap.view.config.CreateUnitType",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.bindElement(sPath);
					this.byId("createunittype_unittype").setValue("{Type}");
					this.byId("createunittype_udarea").setValue("{UnitArea}");
					this.byId("createunittype_symbolarea").setValue("{SymbolArea}");
					oDialog.open();
				}.bind(this));
		},
		
		onNavDetails: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext();
			var sIdType = oBinding.getProperty("IdType");
			var sUnitType = oBinding.getProperty("Type");
			this.getRouter().navTo("unitType",{
				idtype: sIdType,
				unittype: sUnitType
			});
		}
		
	});
});