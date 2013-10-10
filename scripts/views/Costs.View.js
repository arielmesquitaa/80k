define([
    "jquery",
    "underscore",
    "backbone",
    "text!app/templates/Cost.Template.html"
], function(
    $,
    _,
    Backbone,
    CostTemplate
) {
    return Backbone.View.extend({
        el: "#costsContainer",
        initialize: function() {
            this.collection = this.options.collection;

            this.collection.on("reset", _.bind(this.renderOne, this));
        },
        render: function() {
            this.collection.fetch();

            return this;
        },
        renderOne: function() {
            var model = this.collection.getCost()
            this.$("#costContainer").html(_.template(CostTemplate, {
                data: model.getExpenses(),
                monthly: model.get("Monthly Total"),
                annual: model.get("Annual Total")
            }));
        }
    });
});