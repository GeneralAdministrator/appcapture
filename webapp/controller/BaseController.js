/*global moment:true*/
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "data/capture/for/sap/utils/Utils",
    "data/capture/for/sap/libs/moment/Moment"
],function(Controller, History, UIComponent, JSONModel, Utils, Moment){
    "use strict";
    
    var jsonData;
    
    return Controller.extend("data.capture.for.sap.controller.BaseController",{
 
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        getToday: function () {
            return moment().format("YYYY-MM-DD");
        },
        
        getTodayStandar: function () {
        	return moment();
        },
        
        calculateDays: function (dStart, dEnd) {
        	return moment(dEnd).diff(moment(dStart), 'days');
        },
        
        addDays: function (dStart, dEnd, dDate) {
        	
        	var days = this.calculateDays(dStart, dEnd);
        	var date = moment(dDate).add(days, 'days');
        	var newDate = moment(date).format('YYYY-MM-DD');
        	return 	newDate;
        },
        
        between: function (dStart, dEnd, dDate) {
        	var bBoolean = moment(dDate).isBetween(dStart, dEnd);
        	return bBoolean;
        },

        getBaseUrl: function () {
            return this.getOwnerComponent().getManifest().base_url;
        },

        getBaseUrlMap: function () {
            return this.getOwnerComponent().getManifest().base_url_map;
        },

        onNavBack: function () {
            var oHistory, sPreviousHash;
                oHistory = History.getInstance();
                sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getRouter().navTo("launchpad", {}, true);
                }
        },
        
		lockInput: function (sId) {
			var oInput = this.byId(sId);
			
			oInput.addDelegate({
				onAfterRendering: function () {
					oInput.$().find("input").attr("readonly",true);
				}
			}, oInput);
		},
		
        getDataFromMySQLShowView: function (sUrl, oController) {
            var $this = this;
            $.ajax({
                url: sUrl,
                type:"GET",
                dataType:"JSON",
                contentType:"application/json",
                async:false,
                success: function (oData) {
                	var oModel = new JSONModel(oData);
                		oController.setModel(oModel);
                }
            });
        },

        getDataFromMySQL: function (sUrl, sId) {
            var $this = this;
            $.ajax({
                url: sUrl,
                type:"GET",
                dataType:"JSON",
                contentType:"application/json",
                async:false,
                success: function (oData) {
                	var oModel = new JSONModel(oData);
                		$this.byId(sId).setModel(oModel);
                }
            });
        },
        
       getDataFromMySQLWithData: function (sUrl, sId, aData) {
       		var $this = this;
       		
			var jqXHR = $.post(sUrl,{
				data: aData,
				dataType:"JSON"
			},"JSON");
			
			jqXHR.done(function(data){
				var oJSON = JSON.parse(data);
				var oModel = new JSONModel(oJSON);
				$this.byId(sId).setModel(oModel);
			});
			
			jqXHR.fail(function(){
				Utils.failed($this);	
			});
        },

        insertDataIntoDatabase: function (sUrl, aData, oController) {
        	var $this = this;
        	
        	var jqXHR = $.post(sUrl,{
        		data: aData
        	});
        	
        	jqXHR.done(function(){
        		oController.loadModel();
        		Utils.ok($this);
        	});
        	
        	jqXHR.fail(function(){
        		Utils.failed($this);
        	});
        },
        
        updateDataIntoDatabase: function (sUrl, aData, oController) {
       	var $this = this;
        	
        	var jqXHR = $.post(sUrl,{
        		data: aData
        	});
        	
        	jqXHR.done(function(){
        		oController.loadModel();
        		Utils.updateOk($this);
        	});
        	
        	jqXHR.fail(function(){
        		Utils.updateFailed($this);
        	});
        },
        
        deleteDataFromDataBase: function (sUrl, aData, oController) {
       	var $this = this;
        	
        	var jqXHR = $.post(sUrl,{
        		data: aData
        	});
        	
        	jqXHR.done(function(){
        		oController.loadModel();
        		Utils.deleteOk($this);
        	});
        	
        	jqXHR.fail(function(){
        		Utils.deleteFailed($this);
        	});
        }

    });
});