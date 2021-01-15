sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/model/json/JSONModel"
	],function(BaseController, JSONModel){
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.management.crud.productivecycle.CycleSummary",{
		
		onInit: function () {
			var oRouter = this.getRouter();
				oRouter.getRoute("cycleSummary").attachPatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var sPath = "/ProductionCycles/Cycles/"+oArgs.index;
			var oView = this.getView();
			
				oView.bindElement({
					path: sPath,
					model:"productionCycles"
				});
			
			var oModel = this.getView().getModel("productionCycles"),
				iIdUnit = parseInt(oModel.getProperty(sPath+"/IdUnit/")),
				iIdCycle = parseInt(oModel.getProperty(sPath+"/IdCycle/"));

			var aData = [iIdUnit, iIdCycle];
			this.loadModel(aData);
		},
		
		loadModel: function (aData) {
			var sUrl = this.getBaseUrl()+"management/productioncycles_controller/getCycleActive";
       		var $this = this;
       		
			var jqXHR = $.post(sUrl,{
				data: aData,
				dataType:"JSON"
			},"JSON");
			
			jqXHR.done(function(data){
				var oJSON = JSON.parse(data);
				var oModel = new JSONModel(oJSON);
				$this.byId("cyclesummary_simpleform").setModel(oModel);
				$this.createTable(oModel);
			});
		},
		
		createTable: function (oModel) {
			
			var oTable = this.byId("cyclesummary_table");
				oTable.destroyColumns();
				oTable.removeAllItems();
				
			var cantVariables = oModel.getProperty("/CycleActive/Variables/");
				cantVariables = cantVariables.length;
			var cantValues =	oModel.getProperty("/CycleActive/Values/");
				cantValues =	cantValues.length;
			
			//AddColumn
			
			var oColumnDate = new sap.m.Column({
				hAlign:"End",
				minScreenWidth:"Small",
				demandPopin: true,
				header: new sap.m.Label({
					text:"Fecha Muestreo"
				})
			});
			
			oTable.addColumn(oColumnDate);
			
			var oColumnUser = new sap.m.Column({
				hAlign:"Center",
				minScreenWidth:"Small",
				demandPopin: true,
				header: new sap.m.Label({
					text:"Usuario"
				})
			});
			
			oTable.addColumn(oColumnUser);
			
			//AddItems
				
			for (var i = 0; i < cantVariables; i++) {
					var sVariable = oModel.getProperty("/CycleActive/Variables/"+i+"/Variable/");
					var sUnit = 	oModel.getProperty("/CycleActive/Variables/"+i+"/Unit/");
					var oColumn = new sap.m.Column({
						hAlign:"Center",
						minScreenWidth:"Small",
						demandPopin: true,
						header: new sap.m.Label({
							text: sVariable+" ("+sUnit+")"
						})
					});
					oTable.addColumn(oColumn);
			}
			
			var aCell = [];
			var aCells = [];
			var oItem;
			var oNum;
			var oObjectIdentifier;
			
			for (var x = 0; x < cantValues; x++) {

				oItem = oModel.getProperty("/CycleActive/Values/"+x+"/SampleDate/");
				oObjectIdentifier = new sap.m.ObjectIdentifier({
					title: oItem	
				});
				aCell.push(oObjectIdentifier);

				var sName = 	oModel.getProperty("/CycleActive/Values/"+x+"/Name/"),
					sSurname =	oModel.getProperty("/CycleActive/Values/"+x+"/Surname/"),
					user = sName+" "+sSurname;
				oObjectIdentifier = new sap.m.ObjectIdentifier({
					title: user	
				});
				aCell.push(oObjectIdentifier);
				
				var aValues = oModel.getProperty("/CycleActive/Values/"+x+"/Value/");
				
				
				$.each(aValues, function (index, value) {
					for (var levelOne in value) {
						var iMin = parseFloat(oModel.getProperty("/CycleActive/Variables/"+index+"/Min/")),
							iMax = parseFloat(oModel.getProperty("/CycleActive/Variables/"+index+"/Max/")),
							iValor = parseFloat(value[levelOne]),
							sStatu = "";

						if (iValor >= iMin && iValor <= iMax) {
							sStatu = "Success";
						} else {
							sStatu = "Error";
						}
						oNum = new sap.m.ObjectNumber({
							number: iValor,
							state: sStatu
						});
						aCell.push(oNum);
					}
				});

				aCells.push([aCell]);
				
				var oColumnListItem = new sap.m.ColumnListItem({
					cells: aCells
				});
				oTable.addItem(oColumnListItem);
				aCell= [];
				aCells = [];
			} // CIerre for x
			

		}
		
		
	});
});