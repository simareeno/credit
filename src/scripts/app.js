$ = require('jquery');
selectize = require('selectize');
var FastClick = require('fastclick');
inputMask = require('jquery-mask-plugin');

FastClick.attach(document.body);

$(document).ready(function() {
	var logicScript = require('./logic.js');
	var inputMaskScript = require('./input-masks.js');
	var selectScript = require('./select.js');
	var realDataScript = require('./realData.js');
});
