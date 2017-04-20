var $ = require('jquery');
var selectize = require('selectize');
var FastClick = require('fastclick');
var insdpu = require('jquery-mask-plugin');

FastClick.attach(document.body);

$(document).ready(function() {

    $('.row__card, .row__new-payment, .row__new-credit-date').hide();
    // $('.input--sum').focus();
    // $('.input--sum').trigger('touchstart');
    // $( ".input__desc" ).addClass( "input__desc--active" );

    $('input[type=radio][name=from]').change(function(event) {
        $('.row__schet, .row__card').toggle();
        $('.input--card .input-text').focus();
    });

    $('input[type=radio][name=what-change]').change(function(event) {
        $('.row__credit-end, .row__new-payment, .row__new-credit-date').toggle();
        $('.input--sum').focus();
    });

    $('input[type=radio][name=what-change-mobile]').change(function(event) {
        $('.row__credit-end, .row__new-payment, .row__new-credit-date').toggle();
    });

    $('input[type=radio][name=from-mobile]').change(function(event) {
        $('.row__schet, .row__card').toggle();
    });

    $( ".input-text" ).focus(function() {
        $( this ).next( ".input__desc" ).addClass( "input__desc--active" );
    });

    $('.button-submit').click(function () {
        var submitDisabled = $(this).hasClass('button--disabled');
        if (!submitDisabled) {
            $("html, body").animate({scrollTop: 0}, 250);
            $('.popup').addClass('popup--active');
            $('.overlay').addClass('overlay--active');
            $('.input--sms').focus();
        }
    })

    $('.overlay, .popup__close').click(function () {
        $('.popup').removeClass('popup--active');
        $('.overlay').removeClass('overlay--active');
    })

    $( ".input-text" ).blur(function() {
        var inputText = $(this).val();
        if (inputText.length == 0) {
            $( this ).next( ".input__desc" ).removeClass( "input__desc--active" );
        }
    });

    $(".input--sum").keyup(function () {
        var letters = $(this).val().length;
        if (letters > 0) {
            $('.button-submit').removeClass('button--disabled')
        } else if (letters == 0) {
            $('.button-submit').addClass('button--disabled')
        }
    })

    $(".input--sms").keyup(function () {
        var letters = $(this).val().length;
        if (letters == 4) {
            window.location.href = 'notification.html';
        }
    })

    $('.notification').addClass('notification--active');
    $('.notification__close').click(function () {
        $('.notification').removeClass('notification--active');
    })

    $('.input--card .input-text').mask('0000 0000 0000 0000');
    $('.input--date .input-text').mask('00/00');
    $('.input--cvc .input-text').mask('000');
    $('.input--sms').mask('0000');
    $('.input--sum').mask('0 000 000 000 000 000', {reverse: true});

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
});
