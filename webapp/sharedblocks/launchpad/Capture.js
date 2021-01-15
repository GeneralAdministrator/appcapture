sap.ui.define([
    "sap/uxap/BlockBase"
],function(BlockBase){
    "use strict";

    var capture = BlockBase.extend("data.capture.for.sap.sharedblocks.launchpad.Capture",{

        metadata: {
            views: {
                Collapsed: {
                    viewName:"data.capture.for.sap.sharedblocks.launchpad.Capture",
                    type:"XML"
                },
                Expanded: {
                    viewName:"data.capture.for.sap.sharedblocks.launchpad.Capture",
                    type:"XML"
                }
            }
        }

    });
    
    return capture;
},true);