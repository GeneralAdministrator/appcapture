sap.ui.define([
"data/capture/for/sap/libs/moment/Moment"
],function(Moment){
	"use strict";

	var ListForms = {

		formStatus: function (oController, dEndDate) {
			if (moment(dEndDate).isSame("9999-12-31")) {
				return oController.getResourceBundle().getText("ListForms.inactive");
			} else {
				return oController.getResourceBundle().getText("ListForms.active");
			}
		}

	};

	return ListForms;

},  true);