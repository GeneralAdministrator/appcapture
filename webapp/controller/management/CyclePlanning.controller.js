sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"data/capture/for/sap/utils/management/CyclePlanning",
	"data/capture/for/sap/model/formatter"
	],function(BaseController, JSONModel, Fragment, MessageBox, Filter, FilterOperator, CyclePlanning, formatter){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.management.CyclePlanning",{
		
		formatter: formatter,
		
		onBeforeRendering: function () {
			this.loadModel();	
		},
		
		loadModel: function () {
			this.getOwnerComponent().loadModelPlannedCycles();
		},
	
		onNavToCreateCycle: function () {
			this.getRouter().navTo("createCycle");
		},
		
		onDelete: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext("plannedCycles");
			var sId = oBinding.getProperty("IdCycle");
			var sName = oBinding.getProperty("Unit");
			var aData = [parseInt(sId)];
			var $this = this;
			
			var sUrl = this.getBaseUrl()+"management/cycleplanning_controller/deleteCycle";
			
			MessageBox.confirm(this.getResourceBundle().getText("Generic.delete")+sName+"?",{
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if (sAction === "OK") {
						$this.deleteDataFromDataBase(sUrl, aData, $this);
					}
				}
			});
			
		},
		
		onOpenUpdate: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext("plannedCycles"),
				sPath = oBinding.getPath(),
				$this = this,
				oView = this.getView();

			if (!this.byId("updatecycle_dialog")) {
				Fragment.load({
					id: oView.getId(),
					name: "data.capture.for.sap.view.management.crud.cycleplanning.UpdateCycle",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.bindElement({
						path:sPath,
						model:"plannedCycles"
					});
					oDialog.open();
					$this.lockDatePicker();
				});	
			} else {
				this.byId("updatecycle_dialog").open();
				$this.lockDatePicker();
			}
		},
		
		onCloseUpdate: function () {
			this.byId("updatecycle_dialog").destroy();
		},
	
		onUpdate: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext("plannedCycles"),
				sPath = oBinding.getPath();
			var oModel = this.byId("updatecycle_dialog").getModel("plannedCycles"),
				iIdCycle = parseInt(oModel.getProperty(sPath+"/IdCycle"));
				
			var sUrl = this.getBaseUrl()+"management/cycleplanning_controller/updateCycle";
			var aData = CyclePlanning.getDataUpdate(this, iIdCycle);
			this.updateDataIntoDatabase(sUrl, aData, this);
			this.onCloseUpdate();
		},
		
		onOpenActive: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext("plannedCycles"),
				sPath = oBinding.getPath();
			var oView = this.getView();
			var $this = this;
			
			if (!this.byId("activecycle_dialog")) {
				Fragment.load({
					id: oView.getId(),
					name:"data.capture.for.sap.view.management.crud.cycleplanning.ActivateCycle",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.bindElement({
						path: sPath,
						model:'plannedCycles'
					});
					oDialog.open();
				});
			} else {
				this.byId("activecycle_dialog").open();
			}
			
		},
		
		onCloseActive: function () {
			this.byId("activecycle_dialog").destroy();
		},
		
		onActive: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext("plannedCycles"),
				sPath = oBinding.getPath();
			var oModel = this.byId("cycleplanning_table").getModel("plannedCycles"),
				iIdCycle = parseInt(oModel.getProperty(sPath+"/IdCycle/")),
				iIdUnit = parseInt(oModel.getProperty(sPath+"/IdUnit/"));
			var aData = CyclePlanning.getDataActivateCycle(this, iIdCycle, iIdUnit);
			var sUrl = this.getBaseUrl()+"management/cycleplanning_controller/activeCycle";
			this.updateDataIntoDatabase(sUrl, aData, this);
			this.onCloseActive();
		},
		
		
		lockDatePicker: function () {
			var oStartDate = this.byId("updatecycle_startdate");
				oStartDate.addEventDelegate({
					onAfterRendering: function () {
						oStartDate.$().find("input").attr("readonly",true);
					}	
				});
			var oEndDate = this.byId("updatecycle_enddate");
				oEndDate.addEventDelegate({
					onAfterRendering: function () {
						oEndDate.$().find("input").attr("readonly",true);
					}	
				});
		}
		
	});
});