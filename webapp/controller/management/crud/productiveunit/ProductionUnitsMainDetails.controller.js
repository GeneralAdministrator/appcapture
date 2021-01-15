sap.ui.define([
	"data/capture/for/sap/controller/BaseController"
	],function (BaseController) {
	"use strict";
	return BaseController.extend("data.capture.for.sap.controller.management.crud.productiveunit.ProductionUnitsMainDetails",{
		
		onInit: function () {
			var oRouter = this.getRouter();
				oRouter.getRoute("productionUnitsMainDetails").attachPatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var iIdUnit = parseInt(oArgs.idunit),
				iIdProduct = parseInt(oArgs.idproduct),
				iIndex = oArgs.index;
			var oView = this.getView();

				oView.bindElement({
					path: '/ProductionUnits/Units/'+iIndex,
					model: "productionUnits"
				});
			this.loadEndProducts(iIdUnit, iIdProduct);
		},
		
		loadEndProducts: function (iIdUnit, iIdProduct) {
			var sUrl = this.getBaseUrl()+"management/productionunits_controller/getEndProducts";
			var sId = "productionunitsmaindetails_table";
			var aData = [iIdUnit,iIdProduct];
			this.getDataFromMySQLWithData(sUrl, sId, aData);
		}
		
	});
});