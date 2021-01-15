sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/ui/core/Fragment"
	],function(BaseController, ObjectIdentifier, Text, Input, Fragment){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.config.NormalValues",{
		
		onInit: function () {
			this.loadModel();
			this.oTable = this.byId('normalvalues_table');
			this.oReadOnlyTemplate = this.byId("normalvalues_table").removeItem(0);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			this.oEditableTemplate = new sap.m.ColumnListItem({
				cells:[
					new ObjectIdentifier({
						title: "{normalValues>Variable}"
					}),
					new Text({
						text: "{normalValues>Unit}"	
					}),
					new Input({
						value: "{normalValues>Min}"
					}),
					new Input({
						value: "{normalValues>Max}"
					})
				]	
			});
		},
		
		loadModel: function () {
			this.getOwnerComponent().loadModelNormalValues();	
		},
		
		rebindTable: function(oTemplate, sKeyboardMode) {
			this.oTable.bindItems({
				path: "normalValues>/Variables",
				template: oTemplate,
				templateShareable: true
			}).setKeyboardMode(sKeyboardMode);
		},
		
		onSelect: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext("normalValues");
			var sPath = oBinding.getPath();
			var oView = this.getView();
			
			if (!this.byId("updatenormalvalue_dialog")) {
				
				Fragment.load({
					id: oView.getId(),
					name:"data.capture.for.sap.view.config.UpdateNormalValue",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.bindElement({
						path: sPath,
						model: "normalValues"
					});
					oDialog.open();
				});
				
			} else {
				this.byId("updatenormalvalue_dialog").open();
			}
		},
		
		onClose: function () {
			this.byId("updatenormalvalue_dialog").destroy();
			this.byId("updatenormalvalue_min").setvalue(null);
			this.byId("updatenormalvalue_max").setvalue(null);
		},
		
		onSave: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext("normalValues"),
				sPath = oBinding.getPath();
			var oModel = this.getView().getModel("normalValues");
			
			var index = sPath.split("/").slice(-1).pop(),
				min = this.byId("updatenormalvalue_min").getValue(),
				max = this.byId("updatenormalvalue_max").getValue(),
				idVar = oModel.getProperty("/Variables/"+index+"/IdVariable/"),
				idUmbral = oModel.getProperty("/Variables/"+index+"/IdUmbral/");
				
			var sUrl = this.getBaseUrl()+"config/normalvalues_controller/updateUmbral",
				aData = [parseInt(idVar), parseInt(idUmbral), parseFloat(min), parseFloat(max)];
			
				this.updateDataIntoDatabase(sUrl, aData, this);
				
				this.onClose();
		},
		
		onEdit: function () {
			//this.aProductCollection = deepExtend([], this.getview().getModel().getProperty("/variables"));
			this.byId("normalvalues_edit").setVisible(false);
			this.byId("normalvalues_save").setVisible(true);
			this.byId("normalvalues_cancel").setVisible(true);
			this.rebindTable(this.oEditableTemplate, "Edit");
		},
		
		onSaveAll: function () {
			this.byId("normalvalues_edit").setVisible(true);
			this.byId("normalvalues_save").setVisible(false);
			this.byId("normalvalues_cancel").setVisible(false);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		},
		
		onCancel: function () {
			this.byId("normalvalues_edit").setVisible(true);
			this.byId("normalvalues_save").setVisible(false);
			this.byId("normalvalues_cancel").setVisible(false);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		}
		
	});
});