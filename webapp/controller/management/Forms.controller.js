sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/core/Fragment",
	"data/capture/for/sap/utils/management/Forms",
	"data/capture/for/sap/utils/DragDrop"
	],function(BaseController, Fragment, Forms, DragDrop){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.management.Forms",{

		onDropForms: function (oEvent) {

			var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext();
			if (!oDraggedItemContext) {
				return;
			}
			
			var oRanking = DragDrop.ranking;
			var iNewRank = oRanking.Default;
			var oDroppedItem = oEvent.getParameter("droppedControl");

			if (oDroppedItem instanceof sap.m.ColumnListItem) {
				// obtener los datos de la fila soltada
				var sDropPosition = oEvent.getParameter("dropPosition");
				var oDroppedItemContext = oDroppedItem.getBindingContext();
				var iDroppedItemRank = oDroppedItemContext.getProperty("Rank");
				var oDroppedTable = oDroppedItem.getParent();
				var iDroppedItemIndex = oDroppedTable.indexOfItem(oDroppedItem);
				
				// encuentra el nuevo índice de la fila arrastrada dependiendo de la posición de colocación
				var iNewItemIndex = iDroppedItemIndex + (sDropPosition === "After" ? 1 : -1);
				var oNewItem = oDroppedTable.getItems()[iNewItemIndex];
				if (!oNewItem) {
					// soltado antes de la primera fila o después de la última fila
					iNewRank = oRanking[sDropPosition](iDroppedItemRank);
				} else {
					// soltado entre la primera y la última fila
					var oNewItemContext = oNewItem.getBindingContext();
					iNewRank = oRanking.Between(iDroppedItemRank, oNewItemContext.getProperty("Rank"));
				}
			}

			// establece la propiedad de rango y actualiza el modelo para actualizar los enlaces
			var oFormsTable = DragDrop.getIdFormsTable(this);
			var oFormsModel = oFormsTable.getModel();
				oFormsModel.setProperty("Rank", iNewRank, oDraggedItemContext);
		},
		
		moveToVariables: function () {
			
			var oVariablesTable = DragDrop.getIdFormsTable(this);
			
			DragDrop.getSelectedItemContext(oVariablesTable, function (oSelectedItemContext, iSelectedItemIndex) {
				
				// restablece la propiedad de rango y actualiza el modelo para actualizar los enlaces
				var oVariablesModel = oVariablesTable.getModel();
				oVariablesModel.setProperty("Rank", DragDrop.ranking.Initial, oSelectedItemContext);
				
				// selecciona la posición previamente seleccionada
				var aItemsOfVariablesTable = oVariablesTable.getItems();
				var oPrevItem = aItemsOfVariablesTable[
						Math.min(iSelectedItemIndex, aItemsOfVariablesTable.length - 1)
					];
				if (oPrevItem) {
					oPrevItem.setSelected(true);
				}
			});
		},
		
		moveSelectedItem: function (sDirection) {

			var oFormsTable = DragDrop.getIdFormsTable(this);
			
			DragDrop.getSelectedItemContext(oFormsTable, function (oSelectedItemContext, iSelectedItemIndex) {
				
				var iSiblingItemIndex = iSelectedItemIndex + (sDirection === "Up" ? -1 : 1);
				var oSiblingItem = oFormsTable.getItems()[iSiblingItemIndex];
				var oSiblingItemContext = oSiblingItem.getBindingContext();
				if (!oSiblingItemContext) {
					return;
				}
				
				// intercambia el rango seleccionado y el de hermanos
				var oFormsModel = oFormsTable.getModel();
				var iSiblingItemRank = oSiblingItemContext.getProperty("Rank");
				var iSelectedRank = oSelectedItemContext.getProperty("Rank");
				
				oFormsModel.setProperty("Rank", iSiblingItemRank, oSelectedItemContext);
				oFormsModel.setProperty("Rank", iSelectedRank, oSiblingItemContext);
				
				// después de mover seleccione el hermano
				oFormsTable.getItems()[iSiblingItemIndex].setSelected(true);
			});
		},
		
		moveUp: function () {
			this.moveSelectedItem("Up");
		},
		
		moveDown: function () {
			this.moveSelectedItem("Down");	
		},
		
		onBeforeOpenContextMenu: function (oEvent) {
			oEvent.getParameters().listItem.setSelected(true);
		},
		
		openCreateForm: function () {
			var oView = this.getView();
			var $this = this;
			
			if (!this.byId("create_form")) {
				Fragment.load({
					id: oView.getId(),
					name:"data.capture.for.sap.view.management.CreateForm",
					controller:this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("create_form").open();
			}
		},
		
		closeCreateForm: function () {
			this.byId("create_form").close();
			Forms.cleanForm(this);
		},

		getVariables: function () {
			var oTable = 	DragDrop.getIdFormsTable(this),
				oItems = 	oTable.getItems();
			var aVariables = [];
				oItems.forEach(element => {
					var sIdVariable = element.getBindingContext().getProperty('IdVariable');
					aVariables.push(parseInt(sIdVariable));
				});
			return aVariables;
		},

		onSave: function () {
			if (Forms.check(this)) {
				var aForm = Forms.getForm(this);
				var aVariables = this.getVariables();
				var aAllData = [aForm, aVariables];
				Forms.insertForm(this, aAllData);
			}
		},
		
		onNavToListForms: function () {
			this.getRouter().navTo("listForms");
		},
		
		refreshModel: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.publish("loadModelForms");
		}
		
	});
});