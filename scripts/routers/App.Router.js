define([
	"jquery",
	"underscore",
	"backbone"
], function(
	$,
	_,
	Backbone
) {
	var cities = {
		"SF": "San Francisco",
		"OF": "Oakland, Fremont",
		"SSS": "San Jose, Sunnyvale, Santa Clara",
		"VF": "Vallejo/Fairfield"
	},
	invertedCities = _.invert(cities);
	return Backbone.Router.extend({
		initialize: function(options) {
			this.chart = options.chart; // chartView
			this.chart.costs.on("change", _.bind(this.update, this));
			this.chart.proposals.on("change", _.bind(this.update, this));
			this.chart.positions.on("change", _.bind(this.update, this));
		},
		update: function() {
			var type = this.chart.costs.getShowingType(),
				city = invertedCities[this.chart.costs.getShowingCity()],
				month = this.chart.proposals.getMonth(),
				position = this.chart.positions.getPos(),
				kv = {type: type, city: city, month: month, position: position},
				length = _.keys(kv).length,
				str = "",
				i = 0,
				kind = "",
				that = this;

			_.each(kv, function(val, key) {
				if (val === "Custom") {
					if (kind) {
						kind = "custom/all/";
					} else if (key === "city") {
						kind = "custom/costs/";

					} else if (key === "month") {
						kind = "custom/proposals/"
						str += that.chart.proposals.getCustomURL();
					}
				} else {
					str += val;	
				}
				if (i < length - 1) {
					str += "/";
				}

				i += 1;
			});

			console.log(kind + str);
			this.navigate(kind + str, {replace: true});
		},
		routes: {
			":type/:city/:month/:position": "defaultRoute",
			"custom/proposals/:type/:city/:proposal/:position": "customProposal"
		},
		defaultRoute: function(type, city, month, position) {
			var that = this;
			this.chart.on("rendered", function() {
				$("#householdSelect").val(type);
				$("#citySelect").val(cities[city]);
				$("#monthSelect").val(month);
				that.chart.costs.setShowingCity(cities[city]);
				that.chart.costs.setShowingType(type);
				that.chart.proposals.setMonth(month);
				that.chart.positions.setPosition(position);
			});
		},
		customProposal: function(type, city, proposal, position) {
			var that = this;
			this.chart.on("rendered", function() {
				$("#householdSelect").val(type);
				$("#citySelect").val(cities[city]);
				$("#monthSelect").val("Custom");
				that.chart.costs.setShowingCity(cities[city]);
				that.chart.costs.setShowingType(type);
				that.chart.positions.setPosition(position);

				that.chart.proposals.setMonth("Custom", {silent: true});
				that.chart.proposals.setCustomURL(proposal);

			});
		}
	});
});