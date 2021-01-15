sap.ui.define([
    "sap/uxap/BlockBase"
],function(BlockBase){
    "use strict";

    var launchpad = BlockBase.extend("data.capture.for.sap.sharedblocks.launchpad.Management",{
        metadata: {
            views: {
                Collapsed: {
                    viewName: "data.capture.for.sap.sharedblocks.launchpad.Management",
                    type: "XML"
                },
                Expanded: {
                    viewName: "data.capture.for.sap.sharedblocks.launchpad.Management",
                    type: "XML"
                }
            }
        }

    });

    return launchpad;

},true);