
const Handlebars = require('handlebars');

Handlebars.registerHelper('eq', function (a, b) {
  return a == b;
});

Handlebars.registerHelper('subtract', function (a, b) {
  return parseInt(a) - parseInt(b);
});

Handlebars.registerHelper('add', function (a, b) {
  return parseInt(a) + parseInt(b);
});

module.exports = {
    helpers: Handlebars.helpers,
    subtract: Handlebars.helpers.subtract,
    add: Handlebars.helpers.add,
    eq: Handlebars.helpers.eq
  };
