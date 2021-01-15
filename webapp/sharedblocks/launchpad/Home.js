sap.ui.define([
    "sap/uxap/BlockBase"
],function(BlockBase){
    "use strict";

    var home = BlockBase.extend("data.capture.for.sap.sharedblocks.launchpad.Home",{
        metadata: {

            view: {

                Collapsed: {
                    viewName:"data.capture.for.sap.sharedblocks.launchpad.Home",
                    type: "XML"
                },

                Expanded: {
                    viewName:"data.capture.for.sap.sharedblocks.launchpad.Home",
                    type:"XML"
                }
            }

        }
    });

    return home;
},true);