sap.ui.define([
    "sap/m/MessageToast",
    "data/capture/for/sap/utils/Utils"
], function(MessageToast, Utils) {
    "use strict";
    
    var Users = {

        check: function (oController) {
            var iName =         oController.byId("createUser_name").getValue().length,
                iSurname =      oController.byId("createUser_surname").getValue().length,
                iType =         oController.byId("createUser_type").getSelectedKey().length,
                iUser =         oController.byId("createUser_user").getValue().length,
                iPassword =     oController.byId("createUser_password").getValue().length,
                iEmail =        oController.byId("createUser_email").getValue().length,
                iStatu =        oController.byId("createUser_status").getSelectedKey().length;

                if (iName === 0 || iSurname === 0 || iType === 0 || iUser === 0 || iPassword === 0 || iEmail === 0 || iStatu === 0) {
                    MessageToast.show(oController.getResourceBundle().getText("Users.form.all"));
                    return false;
                } else if (iName > 0 && iSurname > 0 && iType > 0 && iUser >  0 && iPassword > 0  && iEmail > 0 && iStatu > 0) {
                    return true;
                } 
        },

        generatePassword: function () {
            var charts = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
            var sPassword = "";
            for (var i = 0; i < 8; i++) {
                sPassword += charts.charAt( Math.floor (Math.random() * charts.length) );
            }
            return sPassword;
        },

        getData: function (oController) {
            var getName =       oController.byId("createUser_name").getValue(),
                getSurname =    oController.byId("createUser_surname").getValue(),
                getType =       oController.byId("createUser_type").getSelectedKey(),
                getUser =       oController.byId("createUser_user").getValue(),
                getPassword =   oController.byId("createUser_password").getValue(),
                getEmail =      oController.byId("createUser_email").getValue(),
                getStatu =      oController.byId("createUser_status").getSelectedKey();
            var aData  = [getName, getSurname, getType, getUser, getPassword, getEmail, getStatu];
            return aData;
        },

        insertUser: function (oController, aData) {
            var sUrl = oController.getBaseUrl()+"management/users_controller/insertUser";

            var jqXHR = $.post(sUrl,{
                data: aData
            });

            jqXHR.done(function(){
                Utils.ok(oController);
                oController.closeCreateUser();
                oController.loadUsers();
            });

            jqXHR.fail(function(){
                Utils.failed(oController);
            });
        },

        cleanForm: function (oController) {

            var sAdministrator =    oController.getResourceBundle().getText("Users.accesstype.administrator"),
                sActive =           oController.getResourceBundle().getText("Users.status.active");

            oController.byId("createUser_name").setValue(null);
            oController.byId("createUser_surname").setValue(null);
            oController.byId("createUser_type").setSelectedKey(sAdministrator);
            oController.byId("createUser_user").setValue(null);
            oController.byId("createUser_password").setValue(null);
            oController.byId("createUser_email").setValue(null);
            oController.byId("createUser_status").setSelectedKey(sActive);
        }

    };

    return Users;
},this);