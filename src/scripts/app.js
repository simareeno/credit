var $ = require('jquery');
var selectize = require('selectize');
var Inputmask = require('inputmask');


$(document).ready(function() {

    $('.row__card').hide();

    $('input[type=radio][name=from]').change(function(event) {
        $('.row__schet, .row__card').toggle();
        $('.input--card .input-text').focus();
    });

    $('input[type=radio][name=from-mobile]').change(function(event) {
        $('.row__schet, .row__card').toggle();
    });

    $( ".input-text" ).focus(function() {
        $( this ).next( ".input__desc" ).addClass( "input__desc--active" );
    });

    $( ".input-text" ).blur(function() {
        var inputText = $(this).val();
        if (inputText.length == 0) {
            $( this ).next( ".input__desc" ).removeClass( "input__desc--active" );
        }
    });

    var cardMask = new Inputmask("9999 9999 9999 9999", { placeholder: " ", autoclear: false });
    var dateMask = new Inputmask("99/99", { placeholder: " ", autoclear: false });
    var cvcMask = new Inputmask("999", { placeholder: " ", autoclear: false });
    cardMask.mask('.input--card .input-text');
    dateMask.mask('.input--date .input-text');
    cvcMask.mask('.input--cvc .input-text');

	$('.select').selectize({
		valueField: 'id',
		labelField: 'name',
		options: [
			{id: 1, money: '9 586', semi: ',10', schet: 'Текущий счёт', schetNumber: '5522'},
			{id: 2, money: '56 273', semi: ',51', schet: 'Другой счёт', schetNumber: '1216'}
		],
		create: false,
	    render: {
	        option: function(item, escape) {
	            return '<div>' +
	                '<span class="select__money number">' + item.money +
						'<span class="number__grey">' + item.semi + ' ₽</span>' +
					'</span>' +
	                '<span class="description"> ' + item.schet + '··' + item.schetNumber + '</span>' +
	            '</div>';
	        },

			item: function (item, escape) {
				return '<div>' +
					'<span class="select__money number">' + item.money +
						'<span class="number__grey">' + item.semi + ' ₽</span>' +
					'</span>' +
					'<span class="description"> ' + item.schet + '··' + item.schetNumber + '</span>' +
				'</div>';
			}
		}
	});

    $('body').click(function () {
            document.getElementById('example-modal').visible = true;
    })



});
