/*global google:true*/
sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/EventBus",
	"data/capture/for/sap/utils/management/GoogleMaps"
	],function(BaseController, Fragment, JSONModel,EventBus, GoogleMaps){
	"use strict";

	var map,
		marker;
	var lat, 
		lng;
	var location,
		farmName,
		farmLat,
		farmLng;
	var aLocation = [];
	var aLat = [];
	var aLng = [];
	var fArea;
	var iCapacidad;
 
	return BaseController.extend("data.capture.for.sap.management.crud.productiveunit.GoogleMap",{
		
		onInit: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.subscribe("loadModelProductionsUnitsGoogleMap", this.refreshMap, this);
		},
		
		onBeforeRendering: function () {
			this.getFarm();	
		},

		onAfterRendering: function () {
			this.refreshMap();
		},
		
		refreshMap: function () {
			var sUrl = 	this.getBaseUrlMap();
			var fn = 	this.initMap.bind(this);
			this.loadMap(sUrl, fn);
		},
		
		initMap: function () {

			var sId = this.byId("googlemap").getDomRef();

			map = new google.maps.Map(sId,{
				center: location,
				zoom: 14,
				mapTypeId: 'satellite'
			});

			this.addDrawing();
			this.addMarkerFarm();
			this.addPolygon();
		},

		loadMap: function (sUrl, fnCallback) {
			var script = document.createElement('script');
				script.onload = function () {
					fnCallback();
				};
				script.src = sUrl;
				document.body.appendChild(script);
		},
		
		addDrawing: function () {
			var drawingManager = new google.maps.drawing.DrawingManager({
				drawingMode: google.maps.drawing.OverlayType.null,
				drawingControl: true,
				drawingControlOptions: {
					position: google.maps.ControlPosition.TOP_CENTER,
					drawingModes: [
						google.maps.drawing.OverlayType.POLYGON,
				        google.maps.drawing.OverlayType.MARKER 
					]
				},
				markerOptions: {
					icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
				},
				polygonOptions: {
					fillColor: "rgb(255, 255, 255)",
					strokeColor: "rgb(255, 255, 255)"
				}
			});
			
			drawingManager.setMap(map);
			
			var $this = this;
			
			google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
				var longitud = polygon.getPath().getArray();
				for (var i = 0; i < longitud.length; i++) {
					$this.extratLatLng(longitud[i].toString());
					aLat.push(lat);
					aLng.push(lng);
				}
				aLat.push(aLat[0]);
				aLng.push(aLng[0]);
				fArea = (google.maps.geometry.spherical.computeArea(polygon.getPath()).toFixed(0));
			});
			
			google.maps.event.addListener(drawingManager, 'markercomplete', function (marker) {
				$this.extratLatLng(marker.getPosition().toString());
				aLocation.push(lat);
				aLocation.push(lng);
			});
		},
		
		addMarkerFarm: function () {

			marker = new google.maps.Marker({
				position: location,
				title: farmName,
				animation: google.maps.Animation.DROP
			});
			
			marker.setMap(map);
		},
		
		loadModels: function () {
			this.loadUnitTypeModel();
			this.loadProductModel();
			this.byId("createproductiveunitgoogle_area").setValue(fArea);
		},

		loadUnitTypeModel: function () {
			var sUrl = this.getBaseUrl()+"management/productionunits_controller/getUnitTypeModel";
			var sId = "createproductiveunitgoogle_unittype";
			this.getDataFromMySQL(sUrl, sId);
		},
		
		loadProductModel: function () {
			var oItem = this.byId("createproductiveunitgoogle_unittype").getFirstItem();
			var sKey = oItem.getKey();
			var sUrl = this.getBaseUrl()+"management/productionunits_controller/getProductModel";
			var sId="createproductiveunitgoogle_product";
			var aData = [sKey];
			this.getDataFromMySQLWithData(sUrl, sId, aData);
			this.changeUnitArea(oItem);
		},
		
		changeUnitTypeModel: function (oEvent) {
			var oSource = oEvent.getSource(),
				oItem = oSource.getSelectedItem();
			var sUrl = this.getBaseUrl()+"management/productionunits_controller/getProductModel";
			var sId = "createproductiveunitgoogle_product";
			var aData = [oItem.getKey()];
			this.getDataFromMySQLWithData(sUrl, sId, aData);
			this.changeUnitArea(oItem);
		},
		
		changeUnitArea: function (oItem) {
			var oModel = this.byId("createproductiveunitgoogle_unittype").getModel();
			var sPath = oItem.getBindingContext().getPath();
			var sSymbolType = oModel.getProperty(sPath+"/Symbol/");
			this.byId("createproductiveunitgoogle_unitarea").setValue(sSymbolType);
		},
		
		openDialog: function () {
			var oView = this.getView();
			
			if (!this.byId("createproductiveunit_with_googlemap")) {
				Fragment.load({
					id: oView.getId(),
					name:"data.capture.for.sap.view.management.crud.productiveunit.CreateProductiveUnitWithGoogleMap",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("createproductiveunit_with_googlemap").open();
			}
		},
		
		closeDialog: function () {
			GoogleMaps.cleanForm(this);
			this.byId("createproductiveunit_with_googlemap").close();
		},

		extratLatLng: function (sLatLng) {
			var latlng = sLatLng.split(',');
			latlng[0] = latlng[0].slice(1);
			latlng[1] = latlng[1].slice(0,-1);
			lat = latlng[0];
			lng = latlng[1];
		},
		
		refreshModel: function () {
			this.getOwnerComponent().loadModelProductionUnits();     
		},

		onSave: function () {
			if (GoogleMaps.check(this)) {
				var aData = GoogleMaps.getData(this, aLocation, aLat, aLng);
				GoogleMaps.insertProductionUnit(this, aData);
			}
			aLocation = [];
			aLat =[];
			aLng =[];
		},
		
		getFarm: function () {
			var sUrl = this.getBaseUrl()+"management/productionunits_controller/getFarms";
           var $this = this;
            $.ajax({
                url: sUrl,
                type:"GET",
                dataType:"JSON",
                contentType:"application/json",
                async:false,
                success: function (oData) {
					$this.extratDataFromJson(oData);
                }
            });
		},
		
		extratDataFromJson: function (oJson) {
			var aData = [];
			$.each(oJson,function(level1, value1){
					for (var value2 in value1) {
						var level2 = value1[value2];
							for (var value3 in level2) {
								switch(value3){
									case "FarmName":	aData.push(level2[value3]); break;
									case "GeoLat":		aData.push(parseFloat(level2[value3])); break;
									case "GeoLng":		aData.push(parseFloat(level2[value3])); break;
								}
							}
					}
			});
			
			farmName =	aData[0];
			farmLat =	aData[1];
			farmLng =	aData[2];
			location = {lat:farmLat, lng:farmLng};
		},

		onNavToProductionUnits: function () {
			this.getRouter().navTo("productionUnitsMain");
		},
		
		changeUnitType: function (oEvent) {
			var oBinding = oEvent.getSource().getSelectedItem().getBindingContext();
			var sArea = oBinding.getProperty("Symbol"),
				sProduction = oBinding.getProperty("SymbolProduction");
		},
	
		addPolygon: function () {
			var $this = this;
			var sUrl = this.getBaseUrl()+"management/productionunits_controller/getCoordinates";

			$.ajax({
				url: sUrl,
				type: "GET",
				dataType:"JSON",
				contentType:"application/json",
				success: function (oData) {
					var aPaths = $this.extractCoordinates(oData);
					$this.addPolygonInGoogleMaps(aPaths);
				}
			});
		},
		
		extractCoordinates: function (oJSON) {
			var oCoordinates = {};
			var aCoordinates = [];
			var aAll = [];
			$.each(oJSON, function (level1, value1) {
				for (var level2 in value1) {
					var level3 = value1[level2];
					for (var value2 in level3) {
						var level4 = level3[value2];
							for (var value3 in level4) {
								switch(value3) {
									case "lat":
										oCoordinates.lat = level4[value3];
										break;
									case "lng":
										oCoordinates.lng = level4[value3];
										break;
								}
							}
						aCoordinates.push(oCoordinates);
						oCoordinates = {};
					}
					aAll.push(aCoordinates);
					aCoordinates = [];
				}

				
			});
			
			return aAll;
		},
		
		addPolygonInGoogleMaps: function (aPaths) {
			for (var i = 0; i < aPaths.length; i++) {
				var polygon = new google.maps.Polygon({
					paths: aPaths[i],
					strokeColor: "rgb(255, 255, 255)",
					fillColor: "rgb(255, 255, 255)"
				});
				polygon.setMap(map);
			}

		}

	});
});