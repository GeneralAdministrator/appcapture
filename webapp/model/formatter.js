sap.ui.define([],function(){
	"use strict";

	return  {

		formStatus: function (sStatus) {
			if (sStatus === this.getResourceBundle().getText("ListForms.active")) {
				return this.getResourceBundle().getText("ListForms.success");
			} else {
				return this.getResourceBundle().getText("ListForms.error");
			}
		},
		
		defaultStatus: function (sStatus) {
			if (sStatus === this.getResourceBundle().getText("ListFarms.default")) {
				return this.getResourceBundle().getText("ListFarms.success");
			} else {
				return this.getResourceBundle().getText("ListFarms.error");
			}
		},
		
		iconDefault: function (sStatus) {
			if (sStatus === this.getResourceBundle().getText("ListFarms.default")) {
				return "sap-icon://decline";
			} else {
				return "sap-icon://accept";
			}
		},
		
		visibleButtonCycle: function (sStatus) {
			if (sStatus === 'En produccion' || sStatus === 'Mantenimiento') {
				return false;
			} else {
				return true;
			}
		},
		
		visibleButtonCloseCycle: function (sStatus) {
			if (sStatus === 'En espera') {
				return false;
			} else {
				return true;
			}
		},
		
		visibleButtonDefault: function (sStatus) {
			if (sStatus === this.getResourceBundle().getText("ListFarms.default")) {
				return false;
			} else {
				return true;
			}
		},

		userStatus: function (sStatus) {
			if (sStatus === this.getResourceBundle().getText("Users.active")) {
				return this.getResourceBundle().getText("Users.success");
			} else if (sStatus === this.getResourceBundle().getText("Users.lock")) {
				return this.getResourceBundle().getText("Users.warning");
			} else if (sStatus === this.getResourceBundle().getText("Users.inactive")) {
				return this.getResourceBundle().getText("Users.error");
			}
		},
		
		densityStatus: function (sStatus) {
			if (sStatus === this.getResourceBundle().getText("SowingDensity.standar")) {
				return this.getResourceBundle().getText("SowingDensity.success");
			} else {
				return this.getResourceBundle().getText("SowingDensity.error");
			}
		},
		
		densityStatusIcon: function (sStatus) {
			if (sStatus === this.getResourceBundle().getText("SowingDensity.standar")) {
				return "sap-icon://decline";
			} else {
				return "sap-icon://accept";
			}
		},
		
		productionUnitsStatus: function (sStatu) {
			switch(sStatu){
				case 'Activo':			return 'Success';
				case 'Mantenimiento':	return 'Warning';
				case 'Inactivo':		return 'Error';
				default:				return 'Information';
			}
		},
		
		modifyStartDate: function (sDate) {
			var aSplit = [];
			aSplit = sDate.split("-");
			var month = parseInt(aSplit[1])-1;
			return new Date(aSplit[0], month, aSplit[2], "00", "00");
		},
		
		modifyEndDate: function (sDate) {
			var aSplit = [];
			aSplit = sDate.split("-");
			var month = parseInt(aSplit[1])-1;
			return new Date(aSplit[0], month, aSplit[2], "23", "59");
		}

	};
});