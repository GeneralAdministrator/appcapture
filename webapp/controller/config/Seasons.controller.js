sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/core/EventBus",
	"data/capture/for/sap/utils/config/Seasons"
	],function(BaseController, Fragment, EventBus, Seasons){
	"use strict";
	return BaseController.extend("data.capture.for.sap.controller.config.Seasons",{
		
		onInit: function () {
			this._oEventBus = this.getOwnerComponent().getEventBus();
			this._oEventBus.subscribe("loadModelSeasons", this.loadModel, this);
			this.loadModel();	
		},
		
		loadModel: function () {
			this._oEventBus.publish("loadModelCreateSowingProducts");
			var sUrl = this.getBaseUrl()+"config/seasons_controller";
			var sId = "seasons_gridlist";
			this.getDataFromMySQL(sUrl, sId);                     
		},
		
		loadProduct: function () {
			var sUrl = this.getBaseUrl()+"config/seasons_controller/getProducts";
			var sId = "createseasons_product";
			this.getDataFromMySQL(sUrl, sId);
		},
		
		openCreateSeasons: function () {
			var oView = this.getView();
			if (!this.byId("crateseasons_dialog")) {
				Fragment.load({
					id: oView.getId(),
					name:"data.capture.for.sap.view.config.CreateSeasons",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("crateseasons_dialog").open();
			}
		},
		
		closeCreateSeasons: function () {
			Seasons.cleanForm(this);
			this.byId("crateseasons_dialog").close();
		},
		
		onSave: function () {
			var aData = Seasons.getData(this);
			var sUrl = this.getBaseUrl()+"config/seasons_controller/insertSeason";
			this.insertDataIntoDatabase(sUrl, aData, this);
			this.closeCreateSeasons();
		},
		
		onDrop: function (oInfo) {
			var oDragged = oInfo.getParameter("draggedControl"),
				oDropped = oInfo.getParameter("droppedControl"),
				sInsertPosition = oInfo.getParameter("dropPosition"),
				oGrid = oDragged.getParent(),
				oModel = this.byId("seasons_gridlist").getModel(),
				aItems = oModel.getProperty("/ListSeasons"),
				iDragPosition = oGrid.indexOfItem(oDragged),
				iDropPosition = oGrid.indexOfItem(oDropped);
				
				var oItem = aItems[iDragPosition];
				aItems.splice(iDragPosition, 1);
				
				if (iDragPosition < iDropPosition) {
					iDropPosition--;
				}
				
				if (sInsertPosition === "Before") {
					aItems.splice(iDropPosition, 0, oItem);
				} else {
					aItems.splice(iDropPosition + 1, 0, oItem);
				}
				
				oModel.setProperty("/ListSeasons",aItems);
		},
		
		refreshModel: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.publish("loadModelCreateSowingProducts");
		}
			
	});
});