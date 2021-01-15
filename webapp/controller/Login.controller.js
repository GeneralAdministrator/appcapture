sap.ui.define([
    "data/capture/for/sap/controller/BaseController",
    "sap/ui/core/Fragment"
],function(BaseController, Fragment){
    "use strict";

    return BaseController.extend("data.capture.for.sap.controller.login",{

        onDisplayNotFound: function () {
            this.getRouter().getTargets().display("notFound",{
                fromTarget: "login"
            });
        },

        onNavToLaunchpad: function () {
            this.getRouter().navTo("launchpad");
        },

        onOpenDialog: function () {
            var oView = this.getView();

                if (!this.byId("self_management")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "data.capture.for.sap.view.SelfManagement",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else {
                    this.byId("self_management").open();
                }
        },

        onCloseDialog: function () {
            this.byId("self_management").close();
        }
    });

});