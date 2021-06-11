sap.ui.require(
	[
		"com/interview/InterviewProject/model/formatter"
	],
	function (formatter) {
		"use strict";

		QUnit.module("Price State");

		function priceStateTestCase(oOptions) {
			// Act
			var sState = formatter.priceState(oOptions.price);
			// Assert
			oOptions.assert.strictEqual(sState, oOptions.expected, "The price state was correct");
		}
		QUnit.test("Should format the products with a price lower than 100 to Success", function (assert) {
			priceStateTestCase.call(this, {
				assert: assert,
				price: 80,
				expected: "Success"
			});
		});

		QUnit.test("Should format the products with a price greate or equal to 100 to Error", function (assert) {
			priceStateTestCase.call(this, {
				assert: assert,
				price: 100,
				expected: "Error"
			});
		});

		QUnit.test("Should format the products with a price higher than 100 to Error", function (assert) {
			priceStateTestCase.call(this, {
				assert: assert,
				price: 200,
				expected: "Error"
			});
		});

	}
);