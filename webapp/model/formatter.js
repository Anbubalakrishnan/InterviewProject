sap.ui.define([
	"sap/ui/core/library"
], function (coreLibrary) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	return {

		priceState: function (iValue) {
			if (iValue < 100) {
				return ValueState.Success;
			} else {
				return ValueState.Error;
			}
		}
	};
});