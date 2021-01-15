sap.ui.define([
    "data/capture/for/sap/controller/BaseController"
],function (BaseController) {
    return BaseController.extend("data.capture.for.sap.controller.NotFound",{

        onInit: function () {
            var oRouter, oTarget;
                oRouter = this.getRouter();
                oTarget = oRouter.getTarget("notFound");
                oTarget.attachDisplay(function (oEvent){
                    this._oData = oEvent.getParameter("data");
                }, this);
        },

        onNavBack: function () {
            if (this._oData && this._oData.fromTarget) {
                this.getRouter().getTargets().display(this._oData.fromTarget);
                delete this._oData.fromTarget;
                return;
            } 

            BaseController.prototype.onNavBack.apply(this, arguments);
        }
    });
});