/* global device */

$('.row__card, .row__new-payment, .row__new-credit-date, .row__newDate, .row__whatDate, .row__new-payment-date').hide();

$('input[type=radio][name=from]').change(function() {
	$('.row__schet, .row__card').toggle();
	$('.input--card .input-text').focus();
});

$('input[type=radio][name=what-change]').change(function() {
	if ($("#srok-" + device).is(':checked')) {
		$('.row__new-payment, .row__new-credit-date').hide();
		$('.row__credit-end').show();
		$('.input--sum').blur();
		$('.conditions .button-submit').removeClass('button--disable');
	} else {
		$('.row__new-payment, .row__new-credit-date').show();
		$('.row__credit-end, .row__new-payment-date, .row__whatDate').hide();
		$('.input--sum').focus();
		var conditionsInputValue = parseInt($(".input--sum").val());
		if (isNaN(conditionsInputValue)) {
			$('.conditions .button-submit').addClass('button--disable');
		}
	}
});

$('input[type=radio][name=what-change-mobile]').change(function() {
	$('.row__credit-end, .row__dates, .row__new-payment, .row__new-credit-date, .row__new-payment-date').toggle();
});

$('input[type=radio][name=from-mobile]').change(function() {
	$('.row__schet, .row__card').toggle();
});

$( '.input-text' ).focus(function() {
	$( this ).next( '.input__desc' ).addClass( 'input__desc--active' );
});

$('.overlay, .popup__close').click(function () {
	$('.popup').removeClass('popup--active');
	$('.overlay').removeClass('overlay--active');
});

$( '.input-text' ).blur(function() {
	var inputText = $(this).val();
	if (inputText.length == 0) {
		$( this ).next( '.input__desc' ).removeClass( 'input__desc--active' );
	}
});

$('.add .input--sum, .payment .input--sum').keyup(function () {
	var letters = $(this).val().length;
	if (letters > 0) {
		$('.button-submit').removeClass('button--disabled');
	} else if (letters == 0) {
		$('.button-submit').addClass('button--disabled');
	}
})
