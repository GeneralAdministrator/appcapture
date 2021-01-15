sap.ui.define([

], function() {
	"use strict";

	var DragDrop = {
		
		ranking: {
			Initial: 0,
			Default: 1024,
			Before: function (iRank) {
				return iRank + 1024;
			},
			Between: function(iRank1, iRank2) {
				return (iRank1 + iRank2) / 2;
			},
			After: function(iRank) {
				return iRank / 2;
			}
		},
		
		getIdVariablesTable: function (oController) {
			var id = oController.getView().getId()+"--table";
			return sap.ui.getCore().byId(id);
		},
		
		getIdFormsTable: function (oController) {
			var id = oController.getView().getId()+"--table";
			return sap.ui.getCore().byId(id);
		},
		
		getSelectedItemContext: function (oTable, fnCallback) {
			
			var aSelectedItems = oTable.getSelectedItems();
			var oSelectedItem = aSelectedItems[0];

			if (!oSelectedItem) {
				sap.m.MessageToast.show("Seleccione una fila!");
				return;
			}
			
			var oSelectedContext = oSelectedItem.getBindingContext();

			if (oSelectedContext && fnCallback) {
				var iSelectedIndex = oTable.indexOfItem(oSelectedItem);
				fnCallback(oSelectedContext, iSelectedIndex, oTable);
			}
				
			return oSelectedContext;
		}
	};

	return DragDrop;
},true);