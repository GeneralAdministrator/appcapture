/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["jquery.sap.global", "sap/ui/core/Control", "google.maps", "./MapUtils"], function(t, e, o, i) {
	"use strict";
	var l = e.extend("openui5.googlemaps.Polygon", {
		metadata: {
			properties: {
				strokeColor: {
					type: "sap.ui.core.CSSColor",
					group: "Appearance",
					defaultValue: null
				},
				strokeOpacity: {
					type: "float",
					bindable: "bindable"
				},
				strokeWeight: {
					type: "float",
					bindable: "bindable"
				},
				fillColor: {
					type: "string",
					bindable: "bindable"
				},
				fillOpacity: {
					type: "float",
					bindable: "bindable"
				},
				paths: {
					type: "object",
					bindable: "bindable"
				},
				visible: {
					type: "boolean",
					bindable: "bindable",
					defaultValue: !0
				},
				draggable: {
					type: "boolean"
				}
			},
			renderer: {}
		}
	});
	return l.prototype.setVisible = function(t) {
		this.setProperty("visible", t, !0), this.polygon && this.polygon.setVisible(this.getVisible())
	}, l.prototype.parsePaths = function() {
		var t = [];
		return this.getPaths() && this.getPaths().forEach(function(e) {
			t.push(i.objToLatLng(e))
		}), t
	}, l.prototype.createPolygon = function() {
		this.polygon || (this.polygon = new o.Polygon), this.polygon.setMap(this.map), this.polygon.setOptions(this.getOptions())
	}, l.prototype.getOptions = function() {
		var t = {};
		return t.paths = this.parsePaths(), t.strokeColor = this.getStrokeColor(), t.strokeOpacity = this.getStrokeOpacity(), t.strokeWeight =
			this.getStrokeWeight(), t.fillOpacity = this.getFillOpacity(), t.fillColor = this.getFillColor(), t.visible = this.getVisible(), t.draggable =
			this.getDraggable(), t
	}, l.prototype._mapRendered = function(t) {
		this.map = t, this.createPolygon()
	}, l.prototype.reset = function() {
		this.map = void 0, this.polygon && this.polygon.setMap(null)
	}, l.prototype.exit = function() {
		this.reset()
	}, l
}, !0);