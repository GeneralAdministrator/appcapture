sap.ui.define([
    "sap/m/MessageToast",
    "data/capture/for/sap/utils/Utils"
],function (MessageToast, Utils) {
    "use strict";

    var Forms = {

        check: function (oController) {
                var getName =       oController.byId("createForm_name").getValue();

                if (getName.length === 0) {
                    MessageToast.show(oController.getResourceBundle().getText("Forms.name"));
                    return false;
                } else {
                    return true;
                }
        },

        getForm: function (oController) {
            var aData = [
            	oController.byId("createForm_name").getValue()
            ];
            return aData;
        },

		insertForm: function (oController, aData) {

            var $this = this;

            var sUrl = oController.getBaseUrl()+"management/forms_controller/insertForm";

			var jqXHR = $.post(sUrl,{
				data: aData
			});

			jqXHR.done(function(){
                $this.cleanForm(oController);
                oController.closeCreateForm();
                oController.onNavToListForms();
                oController.refreshModel();
                Utils.ok(oController);
			});

			jqXHR.fail(function () {
				Utils.failed(oController);
			});
		},

        cleanForm: function(oController){
            oController.byId("createForm_name").setValue(null);
        }

    };

    return Forms;

}, true);