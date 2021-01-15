sap.ui.define([
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"data/capture/for/sap/libs/moment/Moment"
], function (MessageToast, MessageBox, Moment) {
	"use strict";

	var Utils = {

		confirmation: function (oController) {
			MessageBox.confirm(oController.getResourceBundle().getText("Utils.confirm"),{
				title: oController.getResourceBundle().getText("Utils.confirm.title"),
				actions: [
					sap.m.MessageBox.Action.OK,
					sap.m.MessageBox.Action.CANCEL
				],
				initialfocus: sap.m.MessageBox.OK,
				emphasizedAction: sap.m.MessageBox.OK,
				onClose: function (sAction) {
					if (sAction === "OK") {
						$this._bFlag = true;
					} else {
						$this._bFlag = false;
					}
				}
			});
		},

		changeDateFormat: function (oDate) {
			return moment(oDate).format("YYYY-MM-DD");
		},
		
		getConfirmation: function () {
			return $this._bFlag;
		},
		
		ok: function (oController) {
			MessageToast.show(oController.getResourceBundle().getText("Utils.ok"));
		},
		
		failed: function (oController) {
			MessageToast.show(oController.getResourceBundle().getText("Utils.failed"));
		},
		
		updateOk: function (oController) {
			MessageToast.show(oController.getResourceBundle().getText("Utils.update.ok"));
		},
		
		updateFailed: function (oController) {
			MessageToast.show(oController.getResourceBundle().getText("Utils.update.failed"));
		},
		
		deleteOk: function (oController) {
			MessageToast.show(oController.getResourceBundle().getText("Utils.delete.ok"));
		},
		
		deleteFailed: function (oController) {
			MessageToast.show(oController.getResourceBundle().getText("Utils.delete.failed"));
		},
		
		synchOk: function (oController) {
			MessageToast.show(oController.getResourceBundle().getText("Generic.synchOk"));
		},
		
		synchFailed: function (oController) {
			MessageToast.show(oController.getResourceBundle().getText("Generic.synchFailed"));
		}
	};

	return Utils;

}, true);