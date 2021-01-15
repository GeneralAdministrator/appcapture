sap.ui.define([
    "sap/m/MessageToast",
    "data/capture/for/sap/utils/Utils"
], function (MessageToast, Utils) {
    "use strict";
    
    var Variables = {

        check: function (oController) {

            var sVariable   = oController.byId("createVariable_variable").getValue(),
                sUnit       = oController.byId("createVariable_unit").getValue();

            if (sVariable.length === 0 && sUnit.length > 0) {
                MessageToast.show(oController.getResourceBundle().getText("Variables.variable"));
                return false;
            } else if (sVariable.length > 0 && sUnit.length === 0) {
                MessageToast.show(oController.getResourceBundle().getText("Variables.unit"));
                return false;
            } else if (sVariable.length === 0 && sUnit.length === 0) {
                MessageToast.show(oController.getResourceBundle().getText("Variables.all"));
                return false;
            } else {
                return true;
            }
        },

        getData: function (oController) {
                var aData = [
                	oController.byId("createVariable_variable").getValue(), 
                	oController.byId("createVariable_unit").getValue(),
                	oController.byId("createVariable_min").getValue(),
                	oController.byId("createVariable_max").getValue()
                ];
            return aData;
        },

        insertVariable: function (oController, aData) {

            var sUrl = oController.getBaseUrl()+"management/variables_controller/insertVariables";
            var jqXHR = $.post(sUrl,{
                data: aData
            });
                jqXHR.done(function () {
                    oController.closeCreateVariable();
                    oController.loadModel();
                    Utils.ok(oController);
                });
                jqXHR.fail(function(){
                    Utils.failed(oController);
                });
        },

        cleanForm: function (oController) {
            oController.byId("createVariable_variable").setValue(null);
            oController.byId("createVariable_unit").setValue(null);
            oController.byId("createVariable_min").setValue(null);
            oController.byId("createVariable_max").setValue(null);
        }


    };

    return Variables;
},true);