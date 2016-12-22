/**
 * Created by I335301 on 11/25/2016.
 */
sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/mvc/Controller',
    'sap/m/Popover',
    'sap/m/Button',
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History"
], function(jQuery, Controller, Popover, Button ,JSONModel,DateFormat ,Filter ,FilterOperator) {
    "use strict";

    var Controller = Controller.extend("visualization.controller.OverView", {


        onInit : function() {
            // set explored app's demo model on this sample
            var oView = this.getView();
            oView.byId("multiheader").setHeaderSpan([3,1]);

           /*section1 List*/
            var oViewModel = new JSONModel({
                currency: "EUR"
            });
            this.getView().setModel(oViewModel, "view");

            /*Risk OverView Table*/
            this.getView().setModel(new JSONModel);
            this.initSampleDataModel();
        },

        initSampleDataModel : function() {
            /*var oModel = new JSONModel();*/
            var that =this;
            var oDateFormat = DateFormat.getDateInstance({source: {pattern: "timestamp"}, pattern: "dd/MM/yyyy"});
            var oModel2 = this.getOwnerComponent().getModel();
            oModel2.read("/Meetups",{
                success: function(oData){
                    for (var i=0; i<oData.results.length; i++) {
                        var oProduct = oData.results[i];
                        oProduct.ApplyDateStr = oDateFormat.format(new Date(oProduct.ApplyDate));
                    }
                    that.getView().getModel().setData(oData);
                }
            });
        },

        onBeforeRendering: function() {

        },

        onAfterRendering:function () {

            var oView = this.getView();
            var oModel = this.getOwnerComponent().getModel();
            var oTable = this.byId("table");
            var that =this;
            oModel.read("/Usamapdatas",{
                oModel: oModel,
                oView: oView,
                oTable: oTable,
                this: that,
                success: function(data) {

                    var oDataModel = oModel;
                    var usaData = data.results;
                    // Make codes uppercase to match the map data
                    $.each(usaData, function () {
                        this.code = this.code.toUpperCase();
                    });

                    // Instanciate the map
                    var chart = Highcharts.mapChart('__component0---OverView--containerUSA', {
                        chart: {
                            backgroundColor: 'rgba(0,0,0,0)',
                            style:{
                                 /*cursor: 'pointer'*/
                            },
                            /*borderWidth: 1,*/
                            events: {
                                click: function (event) {
                                    alert("test at chart")
                                }
                            }
                        },
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: '',
                            floating: true,
                            align: 'right',
                            y: 50,
                            style: {
                                fontSize: '16px'
                            }
                        },
                        /*现在的图例 start*/
                        legend: {
                            title: {
                                text: 'premium income',
                                style: {
                                    color: '#333',
                                    fontWeight: 500
                                }
                            },
                            align: 'right',
                            verticalAlign: 'bottom',
                            floating: false,
                            layout: 'vertical',
                            valueDecimals: 0,
                            backgroundColor:  'rgba(255, 255, 255, 0.1)',
                            symbolRadius: 1,
                            symbolHeight: 10
                        },
                        colorAxis: {
                            min: 0,
                            dataClasses: [{
                                to: 3,
                                color: "rgb(145, 133, 204)"
                            }, {
                                from: 3,
                                to: 10,
                                color: "rgb(28, 76, 152)"
                            }, {
                                from: 10,
                                to: 30,
                                color: "rgb(156, 197, 118)"
                            }, {
                                from: 30,
                                to: 100,
                                color: "rgb(116, 140, 179)"
                            }, {
                                from: 100,
                                color: "rgb(231, 192, 134)"
                            }]
                        },
                        /*现在的图例 end*/
                        mapNavigation: {
                            enabled: true,
                            buttonOptions: {
                                verticalAlign: 'bottom'
                            }
                        },
                        plotOptions: {
                            series: {
                                point: {
                                    /*important start*/
                                    events: {
                                        select: function () {
                                            var sKey = this.code;
                                            functionRedrawTable(sKey,oTable,that);
                                        },
                                        unselect: function () {
                                            /*write this function here*/
                                        }
                                    }
                                    /*important end*/
                                }
                            }
                        },
                        credits: {
                            enabled: false  /*屏蔽版权信息*/
                        },
                        navigation: {
                            buttonOptions: {
                                verticalAlign: 'top',
                                enabled: false, /*去掉打印按钮*/
                                y: -20
                            }
                        },
                        series: [{
                            animation: {
                                duration: 1000
                            },
                            mapData: Highcharts.maps['countries/us/us-all'],
                            joinBy: ['postal-code', 'code'],
                            data: usaData,
                            dataLabels: {
                                enabled: true,
                                color: '#FFFFFF',
                                format: '{point.code}'
                            },
                            allowPointSelect: true,
                            cursor: 'pointer',
                            name: 'To be determined',
                            states: {
                                hover: {
                                    color: 'rgba(238, 221, 102,0.1)'
                                },
                                select: {
                                    color: '#EFFFEF',
                                    borderColor: 'black',
                                    dashStyle: 'dot'
                                }
                            },
                            tooltip: {
                                valueSuffix: '10 thousand',
                                pointFormat: '{point.code}: {point.value}/km²'
                            },
                            style: {
                                color: '#333',
                                fontWeight: 200
                            }
                        }]


                    });

                    /*！add external function start*/
                    $('#__component0---OverView--getselectedpoints').click(function () {
                        var selectedPoints = chart.getSelectedPoints();
                        alert('You selected ' + selectedPoints.length + ' points');
                    });
                    /*！add external function end*/

                    /*select action trigger the function start*/
                    function functionRedrawTable(sKey,oTable,that){
                        /*alert(oDataModel);*/
                        var oFilter = that._mFilters[sKey];
                        var oBinding = oTable.getBinding("rows");
                        if (oFilter) {
                            oBinding.filter(oFilter);
                        } else {
                            oBinding.filter([]);
                        }

                     }
                    /*select action trigger the function end*/
                }
            });

        },

        handleUserNamePress: function (event) {
            var popover = new Popover({
                showHeader: false,
                placement: sap.m.PlacementType.Bottom,
                content:[
                    new Button({
                        text: 'Feedback',
                        type: sap.m.ButtonType.Transparent
                    }),
                    new Button({
                        text: 'Help',
                        type: sap.m.ButtonType.Transparent
                    }),
                    new Button({
                        text: 'Logout',
                        type: sap.m.ButtonType.Transparent
                    })
                ]
            }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

            popover.openBy(event.getSource());
        },

        onPressBPID: function (oEvent) {
            /*var oItem = oEvent.getSource();*/
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("personalView", {
                BPIDPath: sap.ui.getCore().byId(oEvent.mParameters.id).getText()
            });
        },

        _mFilters: {
            NJ: [new sap.ui.model.Filter("Branch", "EQ", "NJ" )],
            RI: [new sap.ui.model.Filter("Branch", "EQ", "RI" )],
            MA: [new sap.ui.model.Filter("Branch", "EQ", "MA" )],
            CT: [new sap.ui.model.Filter("Branch", "EQ", "CT" )],
            MD: [new sap.ui.model.Filter("Branch", "EQ", "MD" )],
            NY: [new sap.ui.model.Filter("Branch", "EQ", "NY" )],
            DE: [new sap.ui.model.Filter("Branch", "EQ", "DE" )],
            FL: [new sap.ui.model.Filter("Branch", "EQ", "FL" )],
            OH: [new sap.ui.model.Filter("Branch", "EQ", "OH" )],
            PA: [new sap.ui.model.Filter("Branch", "EQ", "PA" )],

            IL: [new sap.ui.model.Filter("Branch", "EQ", "IL" )],
            CA: [new sap.ui.model.Filter("Branch", "EQ", "CA" )],
            HI: [new sap.ui.model.Filter("Branch", "EQ", "HI" )],
            VA: [new sap.ui.model.Filter("Branch", "EQ", "VA" )],
            MI: [new sap.ui.model.Filter("Branch", "EQ", "MI" )],
            IN: [new sap.ui.model.Filter("Branch", "EQ", "IN" )],
            NC: [new sap.ui.model.Filter("Branch", "EQ", "NC" )],
            GA: [new sap.ui.model.Filter("Branch", "EQ", "GA" )],
            TN: [new sap.ui.model.Filter("Branch", "EQ", "TN" )],
            NH: [new sap.ui.model.Filter("Branch", "EQ", "NH" )],

            SC: [new sap.ui.model.Filter("Branch", "EQ", "SC" )],
            LA: [new sap.ui.model.Filter("Branch", "EQ", "LA" )],
            KY: [new sap.ui.model.Filter("Branch", "EQ", "KY" )],
            WI: [new sap.ui.model.Filter("Branch", "EQ", "WI" )],
            WA: [new sap.ui.model.Filter("Branch", "EQ", "WA" )],
            AL: [new sap.ui.model.Filter("Branch", "EQ", "AL" )],
            MO: [new sap.ui.model.Filter("Branch", "EQ", "MO" )],
            TX: [new sap.ui.model.Filter("Branch", "EQ", "TX" )],
            WV: [new sap.ui.model.Filter("Branch", "EQ", "WV" )],
            VT: [new sap.ui.model.Filter("Branch", "EQ", "VT" )],

            MN: [new sap.ui.model.Filter("Branch", "EQ", "MN" )],
            MS: [new sap.ui.model.Filter("Branch", "EQ", "MS" )],
            IA: [new sap.ui.model.Filter("Branch", "EQ", "IA" )],
            AR: [new sap.ui.model.Filter("Branch", "EQ", "AR" )],
            OK: [new sap.ui.model.Filter("Branch", "EQ", "OK" )],
            AZ: [new sap.ui.model.Filter("Branch", "EQ", "AZ" )],
            CO: [new sap.ui.model.Filter("Branch", "EQ", "CO" )],
            ME: [new sap.ui.model.Filter("Branch", "EQ", "ME" )],
            OR: [new sap.ui.model.Filter("Branch", "EQ", "OR" )],
            KS: [new sap.ui.model.Filter("Branch", "EQ", "KS" )],

            UT: [new sap.ui.model.Filter("Branch", "EQ", "UT" )],
            NE: [new sap.ui.model.Filter("Branch", "EQ", "NE" )],
            NV: [new sap.ui.model.Filter("Branch", "EQ", "NV" )],
            ID: [new sap.ui.model.Filter("Branch", "EQ", "ID" )],
            NM: [new sap.ui.model.Filter("Branch", "EQ", "NM" )],
            SD: [new sap.ui.model.Filter("Branch", "EQ", "SD" )],
            ND: [new sap.ui.model.Filter("Branch", "EQ", "ND" )],
            MT: [new sap.ui.model.Filter("Branch", "EQ", "MT" )],
            WY: [new sap.ui.model.Filter("Branch", "EQ", "WY" )],
            AK: [new sap.ui.model.Filter("Branch", "EQ", "AK" )]
        }

    });


    return Controller;

});
