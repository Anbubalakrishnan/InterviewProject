sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"com/interview/InterviewProject/model/formatter"
], function (
	BaseController,
	JSONModel,
	History,
	formatter, MessageToast
) {
	"use strict";

	return BaseController.extend("com.interview.InterviewProject.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function () {

			var sPath = this.getView().getElementBinding().sPath;
			var modelData = this.getView().getModel().getData(sPath);

			if (this.getView().byId("productNameText").getValue() !== modelData.productName ||
				this.getView().byId("priceText").getValue() !== modelData.price + "" ||
				this.getView().byId("descriptionText").getValue() !== modelData.description ||
				this.getView().byId("isFavText").getValue() !== modelData.isFavourite + "" ||
				this.getView().byId("colourText").getValue() !== modelData.colour ||
				this.getView().byId("activeFromText").getValue() !== modelData.activeFrom + "" ||
				this.getView().byId("activeToText").getValue() !== modelData.activeTo + "") {
				sap.m.MessageToast.show("Some values has been changed");
			} else {
				this.getRouter().navTo("productlist", {}, true);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			var sProductID = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ProductSet", {
					productId: sProductID
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});

		},

		_onBindingChange: function () {

			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

		},

		onSubmitPress: function () {
			var sPath = this.getView().getElementBinding().sPath;
			var modelData = this.getView().getModel().getData(sPath);

			modelData.description = this.getView().byId("descriptionText").getValue();
			modelData.productName = this.getView().byId("productNameText").getValue();
			modelData.price = this.getView().byId("priceText").getValue();
			modelData.isFavourite = this.getView().byId("isFavText").getValue();
			modelData.colour = this.getView().byId("colourText").getValue();
			modelData.activeFrom = this.getView().byId("activeFromText").getValue();
			modelData.activeTo = this.getView().byId("activeToText").getValue();

			sap.m.MessageToast.show("Submitted Suucessfully");

		},
		onCancelPress: function () {
			var sPath = this.getView().getElementBinding().sPath;
			var modelData = this.getView().getModel().getData(sPath);
			this.getView().byId("productNameText").setValue(modelData.productName);
			this.getView().byId("priceText").setValue(modelData.price);
			this.getView().byId("descriptionText").setValue(modelData.description);
			this.getView().byId("isFavText").setValue(modelData.isFavourite);
			this.getView().byId("colourText").setValue(modelData.colour);
			this.getView().byId("activeFromText").setValue(modelData.activeFrom);
			this.getView().byId("activeToText").setValue(modelData.activeTo);
		}
	});

});