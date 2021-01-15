sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/core/EventBus",
	"data/capture/for/sap/utils/management/Variables",
	"data/capture/for/sap/utils/DragDrop"
	],function(BaseController, Fragment, EventBus, Variables, DragDrop){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.management.Variables",{

		
		loadModel: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.publish("loadModelVariables");
		},
		
		onBeforeOpenContextMenu: function (oEvent) {
			oEvent.getParameter("listItem").setSelected(true);
		},
		
		onDropVariables: function (oEvent) {
			var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext();
			
			if (!oDraggedItemContext) {
				return;
			}
			// restablece la propiedad de rango y actualiza el modelo para actualizar los enlaces
			var oVariablesTable = DragDrop.getIdVariablesTable(this);
			var oVariableModel = oVariablesTable.getModel();
			oVariableModel.setProperty("Rank", DragDrop.ranking.Initial, oDraggedItemContext);
		},
		
		moveToForms: function () {
			
			var oVariablesTable = DragDrop.getIdVariablesTable(this);

			DragDrop.getSelectedItemContext(oVariablesTable, function(oVariableItemContext, iVariableItemIndex) {
				
				var oSelectedVariablesTable = DragDrop.getIdFormsTable(this);
				
				var oFirstItemOfSelectedVariablesTable = oSelectedVariablesTable.getItems()[0];
				var iNewRank = DragDrop.ranking.Default;

				if (oFirstItemOfSelectedVariablesTable) {
					var oFirstContextOfSelectedProductsTable = oFirstItemOfSelectedVariablesTable.getBindingContext();
					iNewRank = DragDrop.ranking.Before(oFirstContextOfSelectedProductsTable.getProperty("Rank"));
				}
				
				var oVariablesModel = oVariablesTable.getModel();
					oVariablesModel.setProperty("Rank", iNewRank, oVariableItemContext);
					
				// seleccionar el elemento insertado y previamente seleccionado
				oSelectedVariablesTable.getItems()[0].setSelected(true);
				var oPrevSelectedItem = oVariablesTable.getItems()[iVariableItemIndex];
				if (oPrevSelectedItem) {
					oPrevSelectedItem.setSelected(true);
				}
				
			}.bind(this));
			
		},

		openCreateVariable: function () {
			var oView = this.getView();
			
			if (!this.byId("createVariable")) {
				Fragment.load({
					id: oView.getId(),
					name:"data.capture.for.sap.view.management.CreateVariable",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("createVariable").open();
			}
		},
		
		closeCreateVariable: function () {
			Variables.cleanForm(this);
			this.byId("createVariable").close();
		},

		onSave: function () {

			if (Variables.check(this)) {
				var aData = Variables.getData(this);
				Variables.insertVariable(this, aData);
			}
		},

		onNavToFormsVariables: function () {
			this.getRouter().navTo("listForms");
		},
	});
});