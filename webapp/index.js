sap.ui.define([
	"sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
	"use strict";
	
	new ComponentContainer ({
		name:"data.capture.for.sap",
		settings: {
			id: "app"
		},
		async: true
	}).placeAt("content");

});