/**
 * Created by I335301 on 12/22/2016.
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
], function (Controller, History ,JSONModel) {
    "use strict";

    return Controller.extend("visualization.controller.PersonalView", {


        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("personalView").attachPatternMatched(this._onObjectMatched, this);

            /*alert(this.getView().getModel("PersonalViewModel"));*/


        },

        _onObjectMatched: function (oEvent) {

            var oPersonalViewModel = new JSONModel({
                BPID: oEvent.getParameter("arguments").BPIDPath
            });
            this.getView().setModel(oPersonalViewModel, "PersonalViewModel");
            /*alert(this.getView().getModel("PersonalViewModel").getData());*/


        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("overView");
            }
        },

        onBeforeRendering: function() {

        },

        onAfterRendering:function () {

        }

    });
});