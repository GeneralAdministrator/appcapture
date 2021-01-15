/*global moment: true*/
sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/core/EventBus",
	"sap/ui/model/json/JSONModel",
	"data/capture/for/sap/utils/management/SamplingPlanning",
	"data/capture/for/sap/libs/moment/Moment"
	],function (BaseController, Fragment, EventBus, JSONModel, SamplingPlanning, Moment) {
	"use strict";
	
	return BaseController.extend("data.capture.for.sap.controller.management.SamplingPlanning",{
		
		onInit: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.subscribe("loadModelSamplingPlanning",this.loadModel, this);
			this.loadModel();
		},
	
		loadModel: function () {
			
			var sUrl = this.getBaseUrl()+"management/samplingplanning_controller";
			var $this = this;
			
            $.ajax({
                url: sUrl,
                type:"GET",
                dataType:"JSON",
                contentType:"application/json",
                async:false,
                success: function (oData) {
					$this.setOData(oData);
                }
            });
            
		},

	
		loadDialogModels: function () {
			this.loadUsers();
			this.setDatePicker();
			
			this.lockDatePicker();
			this.lockComboBox();
		},
		
		openDialog: function () {
			var oView = this.getView();

			if (!this.byId("create_sample")) {
				Fragment.load({
					id: oView.getId(),
					name:"data.capture.for.sap.view.management.crud.samplingplanning.CreateSample",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("create_sample").open();
			}
		},
		
		closeDialog: function () {
			SamplingPlanning.cleanForm(this);
			this.byId("create_sample").close();
		},
		
		loadProductionUnits: function () {
			var sUrl = this.getBaseUrl()+"management/samplingplanning_controller/getProductionUnits";
			var sId = "createsample_productionunits";
			this.getDataFromMySQL(sUrl, sId);
		},
		
		loadUsers: function () {
			var sUrl = this.getBaseUrl()+"management/samplingplanning_controller/getUsers";
			var sId = "createsample_users";
			this.getDataFromMySQL(sUrl, sId);
		},
		
		lockDatePicker: function () {
			var oDatePicker = this.byId("createsample_date");
			
				oDatePicker.addDelegate({
					onAfterRendering: function() {
						oDatePicker.$().find('INPUT').attr('readonly',true);
					}
				}, oDatePicker);
		},
		
		lockComboBox: function () {
			var oComboBox = this.byId("createsample_productionunits");
			
				oComboBox.addDelegate({
					onAfterRendering: function () {
						oComboBox.$().find("input").attr("readonly",true);
					}
				},oComboBox);
				
			var oComboBoxUsers = this.byId("createsample_users");
			
				oComboBoxUsers.addDelegate({
					onAfterRendering: function () {
						oComboBoxUsers.$().find("input").attr("readonly",true);
					}
				},oComboBoxUsers);
		},
		
		setDatePicker: function () {
			var startToday = moment();
			var endDate = moment().add(1,'M');

			var oDatePicker = this.byId("createsample_date");
				oDatePicker.setMinDate(new Date(startToday));
				oDatePicker.setMaxDate(new Date(endDate));
				oDatePicker.setValue(this.getResourceBundle().getText("CreateSample.placeholder.label1"));
		},
		
		changeDay: function (oEvent) {
			var oSource = oEvent.getSource();
			var dDate = oSource.getValue();
			var sUrl = this.getBaseUrl()+"management/samplingplanning_controller/getProductionUnits";
			var sId = "createsample_productionunits";
			var aData = [dDate];
			
			this.getDataFromMySQLWithData(sUrl, sId, aData);
		},
		
		onSave: function () {
			var sUrl = this.getBaseUrl()+"management/samplingplanning_controller/insertSample";
			var aData = SamplingPlanning.getData(this);
			this.insertDataIntoDatabase(sUrl, aData, this);
			this.closeDialog();
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.publish("loadModelSample");
		},
		
		setOData: function (oData) {
			
			var $this = this;
			var oModel = new JSONModel(oData);

			$.each(oData, function (index, value) {
				for (var level1 in value) {
					var index2 = value[level1];
					for (var level3 in index2) {
						var index3 = index2[level3];
							for (var level4 in index3) {
								var index4 = index3[level4];
									for (var level5 in index4) {
										
										switch(level5){
											case 'StartDate': 
												var sStartDate = index4[level5];
												var oStartDate = $this.createDate(sStartDate, "Start");
												oModel.setProperty("/"+index+"/"+level1+"/Appointments"+"/"+level4+"/StartDate",oStartDate);
												break;
											case 'EndDate': 
												var sEndDate = index4[level5];
												var oEndDate= $this.createDate(sEndDate, "End");
												oModel.setProperty("/"+index+"/"+level1+"/Appointments"+"/"+level4+"/EndDate", oEndDate);
												break;
										}
									}
							}
					}
				}
			});
			this.byId("samplingplanning").setModel(oModel);
		},
		
		createDate: function (sDate, sType) {
			var aSplit = [];
			aSplit = sDate.split("-");
			var month = parseInt(aSplit[1])-1;
			switch(sType) {
				case "Start": 
					return new Date(aSplit[0], month, aSplit[2], "00", "00");
				
				case "End":
					return new Date( aSplit[0], month, aSplit[2], "23", "59");
			}
			
		}
		
	});
});