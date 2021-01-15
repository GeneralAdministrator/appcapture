sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"data/capture/for/sap/model/formatter",
	"sap/ui/core/EventBus",
	"sap/m/MessageBox"
	],function(BaseController, formatter, EventBus, MessageBox){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.config.SowingDensity",{
			
			formatter: formatter,
			
			onInit: function () {
				var oEventBus = this.getOwnerComponent().getEventBus();
					oEventBus.subscribe("loadModelSowingDensity",this.loadModel, this);
				this.loadModel();	
			},
			
			loadModel: function () {
				var sUrl = this.getBaseUrl()+"/config/sowingdensity_controller/getDensitys";
				var sId ="sowingdensity_grid";
				this.getDataFromMySQL(sUrl, sId);
			},
		
			navCreateSowingDensity: function () {
				this.getRouter().navTo("createSowingDensity");
			},
			
			onUpdate: function (oEvent) {
				
				var oBinding = oEvent.getSource().getBindingContext();
				var sPath = oBinding.getPath(),
					index = sPath.split("/").slice(-1).pop();
					
				var sIdDensity = oBinding.getProperty("/ListDensitys/"+index+"/IdDensity/"),
					sIdProduct = oBinding.getProperty("/ListDensitys/"+index+"/IdProduct/");
				
				var sStation = oBinding.getProperty("/ListDensitys/"+index+"/Station/");
				var sUrl = this.getBaseUrl()+"config/sowingdensity_controller/updateStandar";
				var aData = [parseInt(sIdDensity), parseInt(sIdProduct)];
				var $this = this;
				
				MessageBox.confirm(this.getResourceBundle().getText("SowingDensity.confirm.update")+sStation+" como valor de referencia?",{
					actions:[MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (sAction) {
						if (sAction === "OK") {
							$this.updateDataIntoDatabase(sUrl, aData, $this);
						}
					}
				});
			}
			
	});
});