sap.ui.define([
    "sap/m/MessageToast",
    "data/capture/for/sap/utils/Utils"
], function(MessageToast, Utils) {
    "use strict";

    var GoogleMaps = {
    	
    	checkCoordinates: function (oController, aLocation, aCoordinates) {
    		if (aCoordinates.length === 0 && aLocation.length === 0) {
    			MessageToast.show(oController.getResourceBundle().getText("GoogleMaps.check.all"));
    			return false;
    		} else if (aCoordinates.length === 0) {
    			MessageToast.show(oController.getResourceBundle().getText("GoogleMaps.check.coordinates"));
    			return false;
    		} else if (aLocation.length === 0) {
    			MessageToast.show(oController.getResourceBundle().getText("GoogleMaps.check.location"));
    			return false;
    		} else {
    			return true;
    		}
    	},

        check: function (oController) {
            var iArea=      	oController.byId("createproductiveunitgoogle_unitname").getValue().length,
                iProduction=	oController.byId("createproductiveunitgoogle_area").getValue().length;
                
                if (iArea === 0 && iProduction === 0) {
                    MessageToast.show(oController.getResourceBundle().getText("GoogleMap.all"));
                    return false;
                } if (iArea === 0 && iProduction > 0) {
                    MessageToast.show(oController.getResourceBundle().getText("GoogleMap.area"));
                    return false;
                } if(iArea > 0 && iProduction === 0) {
                    MessageToast.show(oController.getResourceBundle().getText("GoogleMap.capacity"));
                    return false;
                } else {
                	return true;
                }

        },
        
        getData: function (oController, aLocation, aLat, aLng) {

            var aData = [
            	oController.byId("createproductiveunitgoogle_unittype").getSelectedKey(),
            	oController.byId("createproductiveunitgoogle_unitname").getValue(),
                parseFloat(aLocation[0]),
                parseFloat(aLocation[1]),
            	parseInt(oController.byId("createproductiveunitgoogle_area").getValue()),
            	aLat,
                aLng
            ];
            
        	var aInsert =[aData];
            
            return aInsert;
        },

		insertProductionUnit: function (oController, aData) {
            var sUrl = oController.getBaseUrl()+"management/productionunits_controller/insertProductionUnitWtihGoogleMap";
            
            var jqXHR = $.post(sUrl,{
                data: aData
            });

            jqXHR.done(function(){
                oController.closeDialog();
                oController.refreshMap();
                oController.onNavToProductionUnits();
                oController.refreshModel();
                Utils.ok(oController);
            });

            jqXHR.fail(function(){
                Utils.failed(oController);
            });
		},

        cleanForm: function (oController) {
            oController.byId("createproductiveunitgoogle_unitname").setSelectedKey("");
            oController.byId("createproductiveunitgoogle_area").setValue(null);
        }

        
    };

    return GoogleMaps;

},true);