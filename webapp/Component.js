sap.ui.define([
    "sap/ui/core/UIComponent",
    "data/capture/for/sap/controller/BaseController"
],function(UIComponent, BaseController, CreateProductionUnit){
    "use strict";
    return UIComponent.extend("data.capture.for.sap.Component",{
        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        },
        
        exit: function () {
        	this._createProductionUnit.destroy();
        	delete this._createProductionUnit;
        },
        
        getBaseUrl: function () {
        	return "http://localhost:8081/http://localhost/codeigniter/index.php/";
        },
        
        getDataFromMySQLShowView: function (sUrl, sModelName) {
            var $this = this;
            $.ajax({
                url: sUrl,
                type:"GET",
                dataType:"JSON",
                contentType:"application/json",
                async:false,
                success: function (oData) {
                	var oModel = new sap.ui.model.json.JSONModel(oData);
                		$this.setModel(oModel, sModelName);
                }
            });
        },
        
        loadModelNormalValues: function () {
        	var sUrl = this.getBaseUrl()+"config/normalvalues_controller";
        	this.getDataFromMySQLShowView(sUrl, "normalValues");     
        },
        
        loadModelProductionUnits: function () {
        	var sUrl = this.getBaseUrl()+"management/productionunits_controller";
        	this.getDataFromMySQLShowView(sUrl, "productionUnits");          
        },
        
        loadModelProductionCycles: function () {
        	var sUrl = this.getBaseUrl()+"management/productioncycles_controller/getListProductionCycles";
        	this.getDataFromMySQLShowView(sUrl, "productionCycles"); 
        },
        
        loadModelPlannedCycles: function () {
        	var sUrl = this.getBaseUrl()+"management/cycleplanning_controller";	
        	this.getDataFromMySQLShowView(sUrl, "plannedCycles"); 
        },
        
        loadModelSampling: function () {
        	var sUrl = this.getBaseUrl()+"datacapture/sampling_controller";
        	this.getDataFromMySQLShowView(sUrl, "sampling"); 
        }
    });
});