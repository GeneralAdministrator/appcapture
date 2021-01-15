sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"data/capture/for/sap/utils/management/ListForms",
	"data/capture/for/sap/model/formatter"
	],function(BaseController, JSONModel, ListForms, formatter){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.management.ListForms",{

		formatter: formatter,

		onBeforeRendering: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.subscribe("loadModelForms",this.loadModel, this);
			this.loadModel();
		},
		
		onNavToFormsVariables: function () {
			this.getRouter().navTo("formsVariables");
		},

		addStatus: function (oData) {
			var $this = this;
			var dEndDate;

			$.each(oData, function (oLevel1, oValue1) {
					for (var oValue2 in oValue1) {
						var oValue3 = oValue1[oValue2];
						for (var oValue4 in oValue3) {
							switch(oValue4) {
								case "EndDate": 
									dEndDate = oValue3[oValue4];
									break;
							}
						}
						var sStatus = ListForms.formStatus($this, dEndDate);
						oValue3.Status = sStatus;
					}
			});

			return oData;
		},

		loadModel: function () {

			var sUrl = this.getBaseUrl()+"management/forms_controller/getForms";
			var $this = this;

			$.ajax({
				url: sUrl,
				type: "GET",
				dataType:"JSON",
				contentType:"application/json",
				async: false,
				success: function (oData) {
					var newData = $this.addStatus(oData);
					$this.byId("listforms_gridlist").setModel(new JSONModel(newData));
				}
			});
		}
		
	});
});