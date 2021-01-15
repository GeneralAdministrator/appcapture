/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["sap/ui/base/ManagedObject", "google.maps"], function(e, t) {
	"use strict";
	return e.extend("openui5.googlemaps.MapsApi", {
		constructor: function(t, i) {
			e.apply(this, arguments)
		},
		metadata: {
			properties: {
				mapsUrl: {
					type: "string",
					defaultValue: ""
				},
				apiKey: {
					type: "string",
					defaultValue: ""
				},
				clientId: {
					type: "string",
					defaultValue: ""
				},
				version: {
					type: "string",
					defaultValue: "3.exp"
				},
				language: {
					type: "string",
					defaultValue: ""
				},
				signedIn: {
					type: "boolean",
					defaultValue: !1
				}
			}
		},
		getLibraryURL: function() {
			var e = this.getMapsUrl();
			e || (e = location.protocol.replace("file", "https") + "//maps.google.com/maps/api/js?"), jQuery.sap.endsWith(e, "?") || (e += "?");
			var t = e + "&v=" + this.getVersion();
			if (t += "&libraries=drawing,geometry,places,visualization", t += "&callback=google.maps.callBack", this.getApiKey() && !this.getClientId() &&
				(t += "&key=" + this.getApiKey()), this.getClientId() && (t += "&client=" + this.getClientId()), !this.getApiKey() && !this.getClientId()
			) {
				jQuery.sap.log.warning(
					"No Google Maps API Key or Client ID specified. See https://developers.google.com/maps/documentation/javascript/get-api-key for instructions to get started with a key or client id."
				)
			}
			return this.getLanguage() && (t += "&language=" + this.getLanguage()), this.getSignedIn() && (t += "&signed_in=" + this.getSignedIn()),
				t
		},
		load: function() {
			t.loadFromMapsApi(this)
		}
	})
}, !0);