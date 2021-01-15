/*global google:true*/
sap.ui.define([
	"data/capture/for/sap/controller/BaseController",
	"sap/ui/core/EventBus",
	"sap/ui/core/Fragment",
	"data/capture/for/sap/utils/config/Farm",
	"data/capture/for/sap/utils/Utils"
	],function(BaseController,EventBus, Fragment, Farm, Utils){
	"use strict";
	
	var map,
		infoWindow;
	var lat,
		lng;
	
	return BaseController.extend("data.capture.for.sap.controller.config.Farm",{
		
		onAfterRendering: function () {
			this.refreshMap();
		},
		
		refreshMap: function () {
			var sUrl = 	this.getBaseUrlMap();
			var fn = 	this.initMap.bind(this);
			this.loadMap(sUrl, fn);
		},
		
		initMap: function () {
			var sId = this.byId("farm_googlemap").getDomRef();

			map = new google.maps.Map(sId,{
				zoom: 5,
				mapTypeId: 'satellite'
			});

			this.geoLocation();
			this.getLatLng();
			this.addMarkers();
		},

		loadMap: function (sUrl, fnCallback) {
			var script = document.createElement('script');
				script.onload = function () {
					fnCallback();
				};
				script.src = sUrl;
				document.body.appendChild(script);
		},

		geoLocation: function () {
			var $this = this;
			infoWindow = new google.maps.InfoWindow();

			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(
					(position)=>{
						const pos = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};
						lat = pos.lat;
						lng = pos.lng;
						infoWindow.setPosition(pos);
						infoWindow.setContent("Latitud: "+pos.lat+" Longitud: "+pos.lng);
						infoWindow.open(map);
						map.setZoom(18);
						map.setCenter(pos);
					},
					()=>{
						$this.handleLocationError(true, infoWindow, map.getCenter());
					}
				);
			} else {
				$this.handleLocationError(false, infoWindow, map.getCenter());
			}
		},

		handleLocationError: function (boolean, infoWindow, pos) {
			infoWindow.setPosition(pos);
			infoWindow.setContent(
				boolean
				? this.getResourceBundle().getText("GoogleMap.error1")
				: this.getResourceBundle().getText("GoogleMap.error2")
			);
			infoWindow.open(map);
		},

		getLatLng: function () {
			var $this = this;

			map.addListener('click', function(mapsMouseEvent) {
				infoWindow.close();

				infoWindow = new google.maps.InfoWindow({
					position: mapsMouseEvent.latLng
				});
				$this.extratLatLng(mapsMouseEvent.latLng.toString());
				infoWindow.setContent("Latitud: "+lat+" Longitud: "+lng);
				infoWindow.open(map);
			});
		},
		
		extratLatLng: function (sLatLng) {
			var latlng = sLatLng.split(',');
			latlng[0] = latlng[0].slice(1);
			latlng[1] = latlng[1].slice(0,-1);
			lat = latlng[0];
			lng = latlng[1];
			return latlng;
		},
		
		openCreateFarm: function () {
			var oView = this.getView();
			
			if (!this.byId("create_farm")) {
				Fragment.load({
					id: oView.getId(),
					name: "data.capture.for.sap.view.config.CreateFarm",
					controller: this
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					this.setLatLng();
					oDialog.open();
				}.bind(this));	
			} else {
				this.setLatLng();
				this.byId("create_farm").open();
			}
		},
		
		closeCreateFarm: function () {
			Farm.cleanForm(this);
			this.byId("create_farm").close();
		},
		
		setLatLng: function () {
			this.byId("createfarm_lat").setValue(lat);
			this.byId("createfarm_lng").setValue(lng);
		},
		
		loadModel: function () {
			var oEventBus = this.getOwnerComponent().getEventBus();
			oEventBus.publish("loadModelFarm");
		},
		
		onSave: function () {
			
			var sUrl = this.getBaseUrl()+"/config/farm_controller/insertFarm";
			if (Farm.check(this)) {
				var aData = Farm.getData(this);
		       	var $this = this;
		        	
		        	var jqXHR = $.post(sUrl,{
		        		data: aData
		        	});
		        	
		        	jqXHR.done(function(){
						$this.closeCreateFarm();
						$this.getRouter().navTo("listFarms");
		        		$this.loadModel();
		        		Utils.ok($this);
		        		$this.refreshMap();
		        	});
		        	
		        	jqXHR.fail(function(){
		        		Utils.failed($this);
		        	});
			}
		},
		
		addMarkers: function () {
			var sUrl = this.getBaseUrl()+"config/farm_controller/getLocation";
			var $this = this;
			
			$.ajax({
				url: sUrl,
				type:"GET",
				dataType:"JSON",
				contentType:"application/json",
				async: false,
				success: function (oJSON) {
					$this.extractGeoLocation(oJSON);
				}
			});
		},
		
		extractGeoLocation: function (oJSON) {
			var aName = [];
			var oCoord = {};
			var aCoord = [];
			var aAll = [];
			$.each(oJSON, function (level1, value1) {
				for (var level2 in value1) {
					aName.push(level2);
					var value2 = value1[level2];
						for (var level3 in value2) {
							switch(level3) {
								case "lat":
									oCoord.lat = value2[level3];
									break;
								case "lng":
									oCoord.lng = value2[level3];
									break;
							}
						}
					aCoord.push(oCoord);
					oCoord = {};
				}
			});

			aAll.push(aCoord, aName);
			this.addMarkersInGoogleMap(aAll);
		},
		
		addMarkersInGoogleMap: function (aArray) {
			var aCoord = aArray[0];
			var aName = aArray[1];
			
			for (var i = 0; i < aCoord.length; i++) {
				var marker = new google.maps.Marker({
					position: aCoord[i],
					title: aName[i]
				});
				
				marker.setMap(map);
			}

		}
		
	});
});