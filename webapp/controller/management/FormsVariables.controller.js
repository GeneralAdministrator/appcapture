sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"data/capture/for/sap/utils/Utils",
	"sap/ui/core/EventBus",
	"data/capture/for/sap/utils/DragDrop",
	],function (BaseController, Utils, EventBus, DragDrop) {
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.management.FormsVariables",{

		onBeforeRendering: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.subscribe("loadModelVariables",this.loadModel, this);
			this.loadModel(this);
		},

		loadModel: function () {

			var oView = 	this.getView(),
				sBaseUrl = 	this.getBaseUrl()+"management/variables_controller",
				oModel = 	new sap.ui.model.json.JSONModel(),
				$this = 	this;

			$.ajax({
				url: sBaseUrl,
				type: "GET",
				dataType: "JSON",
				contentType:"application/json",
				async: false,
				success: function (oData) {
					oModel.setData($this.addRank(oData));
					oView.setModel(oModel);
				},
				error: function (oError) {
					console.log(oError);
				}
			});

		},

		addRank: function (oData) {
			$.each(oData, function (json, level1) {
				for (var obj in level1) {
					level1[obj].Rank = DragDrop.ranking.Initial;
				}
			});	

			return oData;
		},
		
		moveToForms: function() {
			this.byId("variables").getController().moveToForms();
		},
		
		moveToVariables: function() {
			this.byId("forms").getController().moveToVariables();
		}
		
	});
});