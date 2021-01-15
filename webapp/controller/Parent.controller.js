sap.ui.define([
    "data/capture/for/sap/controller/BaseController",
    "sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel" 
],function(BaseController, Fragment, JSONModel){
    "use strict";

    return BaseController.extend("data.capture.for.sap.controller.Parent",{

        onInit: function () {
			//this.loadNavigation();
        },  
        
        loadNavigation: function () {
            var oJSON = sap.ui.require.toUrl("data/capture/for/sap/model/Config.json");
                this.getView().setModel(new JSONModel(oJSON));
        },

        openConfig: function (oEvent) {
            var oButton = oEvent.getSource();
            var oView = this.getView();
            var $this = this;

            if (!this._oPopover) {
                Fragment.load({
                	id:"config_popover",
                    name: "data.capture.for.sap.view.Config",
                    controller: this
                }).then(function(oPopover){
                    this._oPopover = oPopover;
                    oView.addDependent(this._oPopover);
                    this._oPopover.openBy(oButton);
                }.bind(this));
            } else {
                this._oPopover.openBy(oButton);
            }
        },
        
        onPressList: function (oEvent) {
        	var oListItem = oEvent.getSource(),
        		sTitle = oListItem.getTitle();
        		
        	switch (sTitle) {
        		case "Finca(s)": 
        			this.getRouter().navTo("listFarms");
        			break;
        		case "Tipos de unidades productivas":
        			this.getRouter().navTo("unitTypes");
        			break;
        		case "Variables y formularios":
        			this.getRouter().navTo("listForms");
        			break;
        		case "Valores normales":
        			this.getRouter().navTo("normalValues");
        			break;
        		case "Tabla de equivalencias":
        			break;
        		case "Temporadas":
        			this.getRouter().navTo("seasons");
        			break;
        		case "Productos":
        			this.getRouter().navTo("products");
        			break;
        		case "Densidad de siembra":
        			this.getRouter().navTo("sowingDensity");
        			break;
        		case "Usuarios":
        			this.getRouter().navTo("users");
        			break;
        	}
        },
        
		onSideNavButtonPress: function () {
			var oToolPage = this.byId("parent");
			var bSideExpanded = oToolPage.getSideExpanded();

			this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		_setToggleButtonTooltip: function (bLarge) {
			var oToggleButton = this.byId('sideNavigationToggleButton');
			if (bLarge) {
				oToggleButton.setTooltip('Large Size Navigation');
			} else {
				oToggleButton.setTooltip('Small Size Navigation');
			}
		}

    });
});