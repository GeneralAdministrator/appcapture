sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"data/capture/for/sap/utils/datacapture/SamplingDetail",
	"sap/ui/core/EventBus"
	],function(BaseController, JSONModel, SamplingDetail, EventBus){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.datacapture.SamplingDetail",{
		
		onInit: function () {
			var oRouter = this.getRouter();
				oRouter.getRoute("samplingDetail").attachPatternMatched(this._onRouteMatched, this);    
		},
		
		_onRouteMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var oView = this.getView();
			var sPath = "/ProductionUnits/"+oArgs.index;
			this._sPath = sPath;
			oView.bindElement({
				path: sPath,
				model:"sampling"
			});
			
			var oModel = oView.getModel("sampling"),
				iIdForm = parseInt(oModel.getProperty(sPath+"/IdForm"));
			this.loadModelDetail(iIdForm);			
		},
		
		loadModel: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.publish("loadModelSample");
				oEventBus.publish("loadModelSamplingPlanning");
		},
		
		loadModelDetail: function (id) {
			var sUrl = this.getBaseUrl()+"datacapture/sampling_controller/getForm";
			var sId = "samplingdetail_simplefor";	
			var aData = [id];
			
       		var $this = this;
       		
			var jqXHR = $.post(sUrl,{
				data: aData,
				dataType:"JSON"
			},"JSON");
			
			jqXHR.done(function(data){
				var oJSON = JSON.parse(data);
				var oModel = new JSONModel(oJSON);
				$this._oModel = oModel;
				$this.createForm(oModel);
				$this.cleanForm();
			});
			
		},
		
		createForm: function (oModel) {
			
			var oSimpleForm = this.byId("samplingdetail_simplefor");
				oSimpleForm.destroyContent();
				
			var sTitle = this._oModel.getProperty("/Form/FormName/");
			var cantVariables = this._oModel.getProperty("/Form/CantVariables/");
			this._cantVar = cantVariables;
			var $this = this;
				
				oSimpleForm.setTitle("Formulario - "+sTitle);
				
				for (var i = 0; i < cantVariables; i++) {

					var sIdVariable =	this._oModel.getProperty("/Form/Variables/"+i+"/IdVariable/");
					var sVariable = 	this._oModel.getProperty("/Form/Variables/"+i+"/Variable/");
					var sUnit = 		this._oModel.getProperty("/Form/Variables/"+i+"/Unit/");
					
					oSimpleForm.addContent(
						new sap.m.Label({
							text: sVariable+" ("+sUnit+")",
							required: true
						})
					);
					
					oSimpleForm.addContent(
						new sap.m.Input({
							id: $this.getView().createId("samplingdetail_input"+i),
							placeholder:"Ingrese el valor de "+sVariable,
							selectedKey: sIdVariable,
							width:"20rem"
						})
					);
				}
			

		},
		
		onEditToggleButtonPress: function (oEvent) {
			var typeButton = oEvent.getSource().mProperties.text;
			var oObjectPage = this.byId("samplingdetail_objectpagelayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
				oObjectPage.setShowFooter(!bCurrentShowFooterState);
			if (typeButton === "Cancelar") {
				SamplingDetail.cleanForm( this,  this._cantVar);
			}
		},
		
		onSave: function () {
			var sUrl = this.getBaseUrl()+"datacapture/sampling_controller/insertValores";
			var aData = SamplingDetail.getData(this, this._cantVar, this._sPath, this._oModel);
			this.insertDataIntoDatabase(sUrl, aData, this);
			this.cleanForm();
			this.getRouter().navTo("sampling");
		},
		
		cleanForm: function () {
			SamplingDetail.cleanForm(this, this._cantVar);
		},
		
		onNavToSummary: function () {
			this.getRouter().navTo("summary",{
				IdUnit: this._idUnit,
				IdCycle: this._idCycle
			});
		}
		
	});
});