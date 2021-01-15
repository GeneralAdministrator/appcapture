sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"data/capture/for/sap/utils/config/UnitTypeDetails"
	],function(BaseController, JSONModel, UnitTypeDetails) {
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.config.UnitTypeDetails",{
		
		onInit: function () {
			var oRouter = this.getRouter();
				oRouter.getRoute("unitType").attachMatched(this._onRouteMatched, this);
			this._showFormFragment("UnitTypeDisplay");
		},
		
		onExit: function () {
			for (var sPropertyName in this._formFragments) {
				if (!this._formFragments.hasOwnProperty(sPropertyName) || this._formFragments[sPropertyName] == null) {
					return;
				}
			}
			
			this._formFragments[sPropertyName].destroy();
			this._formFragments[sPropertyName] = null;
		},
		
		_onRouteMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			this.byId("unittypedetails_page").setTitle(oArgs.unittype);
			
			var oView = this.getView();
			var sPath = "/UnitTypes/"+(oArgs.idtype-1);
			oView.bindElement({
				path: sPath
			});
			var aData = [oArgs.idtype];
			this.loadModel(aData);
		},
		
		loadModel: function (aIdType) {
			var $this = this;
			var sUrl = this.getBaseUrl()+"config/unittypes_controller/getUnitTypeDetails";
			var jqXHR = $.post(sUrl,{
				data: aIdType
			});
			
			jqXHR.done(function (data) {
				var oModel = new JSONModel(JSON.parse(data));
				$this.setModel(oModel);
			});
		},
		
		editPress: function () {
			this._unitType = Object.assign(
				{},
				this.getModel().getData()
			);	
			this._toggleButtonAndView(true);
			this.buttonNavBack(false);
		},
		
		savePress: function () {
			var oData = this.getView().getModel().getData();
			var sIdType = oData.IdType;
			var sIdDensity = oData.IdDensity;
			var sUrl = this.getBaseUrl()+"config/unittypes_controller/updateUnitTypeAndDensity";                                
			var aData = UnitTypeDetails.getData(this, sIdType, sIdDensity);
			this.updateDataIntoDatabase(sUrl, aData);                                
		},
		
		cancelPress: function () {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			oData = this._unitType;
			oModel.setData(oData);
			this._toggleButtonAndView(false);
			this.buttonNavBack(true);
		},
		
		buttonNavBack: function (bShow) {
			var oPage = this.byId("unittypedetails_page");	
				oPage.setShowNavButton(bShow);
		},
		
		_formFragments: {},
		
		_toggleButtonAndView: function (bEdit) {
			var oView = this.getView();
			
			oView.byId("unittypedetails_edit").setVisible(!bEdit);
			oView.byId("unittypedetails_save").setVisible(bEdit);
			oView.byId("unittypedetails_cancel").setVisible(bEdit);
			
			this._showFormFragment(bEdit? "UpdateUnitType" : "UnitTypeDisplay");
		},
		
		_getFormFragment: function (sFragmentName) {
			var oFormFragment = this._formFragments[sFragmentName];
			
			if (oFormFragment) {
				return oFormFragment;
			}
			
			oFormFragment = sap.ui.xmlfragment(
				this.getView().getId(),
				"data.capture.for.sap.view.config."+sFragmentName
			);
			this._formFragments[sFragmentName] = oFormFragment;
			return this._formFragments[sFragmentName];
		},
		
		_showFormFragment: function (sFragmentName) {
			var oPage = this.byId("unittypedetails_page");
				oPage.removeAllContent();
				oPage.insertContent(
					this._getFormFragment(sFragmentName)
				);
		}
		
	});
});