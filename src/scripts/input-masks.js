$('.input--card .input-text').mask('0000 0000 0000 0000');
$('.input--date .input-text').mask('01/23', {translation: {
	'0': {
		pattern: /[1-3]/, optional: false
	},
	'1': {
		pattern: /[1-9]/, optional: false
	},
	'2': {
		pattern: /[0-9]/, optional: false
	},
	'3': {
		pattern: /[1-9]/, optional: false
	}
}
});
$('.input--cvc .input-text').mask('000');
$('.input--sms').mask('0000');
$('.input--sum').mask('0 000 000 000 000 000', {reverse: true});
$('.input--whatDate').mask('01', {translation: {
	'0': {
		pattern: /[1-9]/, optional: false
	},
	'1': {
		pattern: /[0-9]/, optional: false
	}
}
});
$('.input--newDate').mask('01', {translation: {
	'0': {
		pattern: /[1-9]/, optional: false
	},
	'1': {
		pattern: /[0-9]/, optional: false
	}
}
});
