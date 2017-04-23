var monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

function setData(value, spaces) {

	var myString = data[value];
	if (spaces) {
		return $('.'+ value).text(numberWithSpaces(myString));
	}
	return $('.'+ value).text(myString);
}

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

function calculateMonthPayment(debt, months) {
	if (months == 0) {
		return payment = debt;
	}
	var payment = Math.floor(debt / months);
	return payment;
}

function updateCreditDates() {
	var creditYearsLeft = Math.floor(data.creditDurationMonths / 12);
	var creditMonthsLeft = Math.floor(data.creditDurationMonths % 12);
	var creditYearsLeftText = creditYearsLeft + ' ' + declOfNum(
		creditYearsLeft, ['год', 'года', 'лет']
	);
	var creditMonthsLeftText = creditMonthsLeft + ' ' + declOfNum(
		creditMonthsLeft, ['месяц', 'месяца', 'месяцев']
	)
	var creditFullText = '';
	if (creditYearsLeft > 0) {
		creditFullText += creditYearsLeftText;
	}
	if (creditMonthsLeft > 0) {
		if (creditYearsLeft > 0) {
			creditFullText += ' и '
		}
		creditFullText += creditMonthsLeftText
	}
	if (creditMonthsLeft == 0) {
		if (creditYearsLeft <= 0) {
			creditFullText += creditMonthsLeftText;
		}
	}
	$('.creditDurationText').text(creditFullText);
}

function getDateText(date, plusMonths, noYears) {
	var creditRecieveDate =  new Date(date);
	var creditRecieveDateText = creditRecieveDate.getDate();
	creditRecieveDateText += ' ';
	if (plusMonths > 0) {
		var monthText = creditRecieveDate.getMonth();
		monthText += plusMonths;
		if (monthText > 12) {
			var newYears = Math.floor(monthText / 12);
			var monthText = (monthText % 12);
		}
		if (monthText == 12) { monthText = 0 }
		creditRecieveDateText += monthNames[monthText];
	} else {
		creditRecieveDateText += monthNames[creditRecieveDate.getMonth()];
	}
	if (noYears) {
		return creditRecieveDateText;
	}
	creditRecieveDateText += ' ';
	if (newYears > 0) {
		var yearsText = creditRecieveDate.getFullYear();
		yearsText += newYears;
		creditRecieveDateText += yearsText;
	} else {
		creditRecieveDateText += creditRecieveDate.getFullYear();
	}
	return creditRecieveDateText;
}

function updateData() {
	setData('creditLastPaymentDate');
	$('.creditRecieveDate').text(getDateText(data.creditRecieveDate, 0));
	$('.creditLastPaymentDate').text(getDateText(data.creditRecieveDate, 7));
	$('.creditNextPaymentDate').text(getDateText(data.creditNextPaymentDate, 0));
	setData('creditDurationMonths');
	setData('creditRate');
	setData('creditLimit', true);
	setData('creditDebt', true);
	$('.creditNextPayment').text(numberWithSpaces(
		calculateMonthPayment(data.creditDebt, data.creditDurationMonths)
	));
	$('.creditMonthPayment').text(numberWithSpaces(
		calculateMonthPayment(data.creditDebt, data.creditDurationMonths)
	));
	$('.currentAccountSum').text(numberWithSpaces(currentAccountSum));
	$('.currentAccountNumber').text(numberWithSpaces(currentAccountNumber));
	updateCreditDates();
}

function activateSmsPopup() {
	$("html, body").animate({scrollTop: 0}, 250);
	$('.popup').addClass('popup--active');
	$('.overlay').addClass('overlay--active');
	$('.input--sms').focus();
}

var userData = {
	'creditDebt': 820000,
	'creditLimit': 900000,
	'creditRecieveDate': "2016-10-25T21:16:04.314Z",
	'creditNextPaymentDate': "2017-06-25T21:16:04.314Z",
	'creditMonthPayment': 68333.333,
	'creditRate': '18,99',
	'creditDurationMonths': 12,
	'accounts' : [
		{
			'accountNumber' : 4576,
			'accountSum' : 62328,
			'accountCurrent' : true,
			'accountCards' : 2
		}, {
			'accountNumber' : 2191,
			'accountSum' : 1923328,
			'accountCurrent' : false,
			'accountCards' : 1
		}
	]
};

function updateStorage() {
	data.accounts = accounts;
	localStorage.setItem('user', JSON.stringify(data));
	updateData();
}

// Если данных нет, загружаем
if (localStorage.length == 0) {
	localStorage.setItem('user', JSON.stringify(userData))
}

// Получаем данные
data = JSON.parse(localStorage.getItem('user'));

// Счета и текущий счет
accounts = data.accounts;
var currentAccount = accounts[0];
var currentAccountNumber = currentAccount.accountNumber;
var currentAccountSum = currentAccount.accountSum;

// Вбиваем данные
updateData();

// Пополнение счета
$('.add .' + device + ' .button').click(function () {
	if (!$(this).hasClass('button--disabled')) {
		var paymentAmount = parseInt($('.' + device + ' .input--sum').val().replace(/\s+/g, ''));
		var currentAccountSum = parseInt($('.' + device + ' .selectize-input .number__val').text().replace(/\s+/g, ''))
		var chosenAccount = $('.' + device + ' .selectize-input .accountNumber').text();
		var surplus = 0;

		if (paymentAmount > data.creditDebt) {
			surplus = paymentAmount - data.creditDebt;
			if (data.creditDebt !== 0) {
				paymentAmount = data.creditDebt;
			}
		}

		if ($('#card').is(':checked')) {
			if (!data.creditDebt == 0) {
				data.creditDebt -= paymentAmount;
			}
			data.accounts[0].accountSum += surplus
			activateSmsPopup();
			updateStorage();
			return;
		}

		if (currentAccountSum < paymentAmount) {
			$('.row__schet .semi-title').addClass('semi-title--error').text('На счете недостаточно средств');
			$('.selectize-input').addClass('selectize-input--error');
		} else {
			data.creditDebt -= paymentAmount;
			if (chosenAccount == 2191) {
				data.accounts[1].accountSum -= paymentAmount
				data.accounts[1].accountSum += surplus
			} else {
				data.accounts[0].accountSum -= paymentAmount
				data.accounts[0].accountSum += surplus
			}
			activateSmsPopup();
			updateStorage();
		}
	}
})

// Уменьшение платежа
var currentMonthPaymentBlock = $('.payment .from-to__from');
var futureMonthPaymentBlock = $('.payment .from-to__to');
currentMonthPaymentBlock.text(numberWithSpaces(calculateMonthPayment(data.creditDebt, data.creditDurationMonths) + ' ₽'))
futureMonthPaymentBlock.text(numberWithSpaces(calculateMonthPayment(data.creditDebt, data.creditDurationMonths) + ' ₽'))
function getPayment() {
	var inputSum = parseInt($('.payment .' + device + ' .input--sum').val().replace(/\s+/g, ''));
	var payment = Math.floor((data.creditDebt - inputSum) / 12);
	if (payment < 0) {
		return 0;
	}
	return payment;
}
$('.payment .' + device + ' .input--sum').keyup(function () {
	var thisInput = $(this);
	var newPayment = getPayment();
	setTimeout(function () {
		if (thisInput.val().length > 0) {
			$('.payment .from-to').addClass('from-to--active');
			futureMonthPaymentBlock.text(numberWithSpaces(
				newPayment + ' ₽'
			));
		} else {
			$('.payment .from-to').removeClass('from-to--active');
		}
	}, 200);
});
$('.payment .' + device + ' .button').click(function () {
	if (!$(this).hasClass('button--disabled')) {
		var paymentAmount = parseInt($('.' + device + ' .input--sum').val().replace(/\s+/g, ''));
		var currentAccountSum = parseInt($('.' + device + ' .selectize-input .number__val').text().replace(/\s+/g, ''))
		var chosenAccount = $('.' + device + ' .selectize-input .accountNumber').text();
		var surplus = 0;

		if (paymentAmount > data.creditDebt) {
			surplus = paymentAmount - data.creditDebt;
			if (data.creditDebt !== 0) {
				paymentAmount = data.creditDebt;
			}
		}


		if ($('#card').is(':checked')) {
			if (!data.creditDebt == 0) {
				data.creditDebt -= paymentAmount;
			}
			data.accounts[0].accountSum += surplus
			activateSmsPopup();
			updateStorage();
			return;
		}

		if (currentAccountSum < paymentAmount) {
			$('.row__schet .semi-title').addClass('semi-title--error').text('На счете недостаточно средств');
			$('.selectize-input').addClass('selectize-input--error');
		} else {
			if (!data.creditDebt == 0) {
				data.creditDebt -= paymentAmount;
			}
			if (chosenAccount == 2191) {
				data.accounts[1].accountSum -= paymentAmount
				data.accounts[1].accountSum += surplus
			} else {
				data.accounts[0].accountSum -= paymentAmount
				data.accounts[0].accountSum += surplus
			}
			activateSmsPopup();
			updateStorage();
		}
	}
})

// Закрыть кредит
$('.close .button-submit').removeClass('button--disabled');
$('.close .' + device + ' .button').click(function () {
	if (!$(this).hasClass('button--disabled')) {
		var paymentAmount = data.creditDebt;
		var currentAccountSum = parseInt($('.' + device + ' .selectize-input .number__val').text().replace(/\s+/g, ''))
		var chosenAccount = $('.' + device + ' .selectize-input .accountNumber').text();

		if ($('#card').is(':checked')) {
			data.creditDebt -= paymentAmount;
			activateSmsPopup();
			updateStorage();
			return;
		}

		if (currentAccountSum < paymentAmount) {
			$('.row__schet .semi-title').addClass('semi-title--error').text('На счете недостаточно средств');
			$('.selectize-input').addClass('selectize-input--error');
		} else {
			data.creditDebt -= paymentAmount;
			if (chosenAccount == 4576) {
				data.accounts[0].accountSum -= paymentAmount
			} else {
				data.accounts[1].accountSum -= paymentAmount
			}
			activateSmsPopup();
			updateStorage();
		}
	}
})

// Изменение условий кредита. Платеж
var currentMonthConditionsBlock = $('.conditions .from-to__from');
var futureMonthConditionsBlock = $('.conditions .from-to__to');
var minimalPayment = Math.floor(data.creditDebt / 60);
$('.creditMonthMinPayment').text(numberWithSpaces(minimalPayment));
currentMonthConditionsBlock.text(data.creditDurationMonths + ' ' + declOfNum(
	data.creditDurationMonths, ['месяц', 'месяца', 'месяцев']
));
futureMonthConditionsBlock.text(data.creditDurationMonths + ' ' + declOfNum(
	data.creditDurationMonths, ['месяц', 'месяца', 'месяцев']
));
function getConditionPayment() {
	var thisInput = $('.conditions .' + device + ' .input--sum');
	var payment = parseInt(thisInput.val().replace(/\s+/g, ''));
	return payment;
}
function getConditionMonths(payment) {
	var months = Math.floor(data.creditDebt / payment);
	if (payment == data.creditDebt) { months = 0; }
	if (isNaN(months)) { months = data.creditDurationMonths; }
	return months
}
$('.conditions .' + device + ' .input--sum').keyup(function () {
	var thisInput = $(this);
	var payment = getConditionPayment();
	if (payment < minimalPayment) {
		$('.button-submit').addClass('button--disabled');
		$('.conditions .from-to').removeClass('from-to--active');
		return false;
	}

	if (payment > data.creditDebt) {
		$('.input--sum').val(numberWithSpaces(data.creditDebt));
	}
	var months = getConditionMonths(payment);
	$('.button-submit').removeClass('button--disabled');

	$('.conditions .from-to__to').text(months + ' ' + declOfNum(
		months, ['месяц', 'месяца', 'месяцев']
	));

	setTimeout(function () {
		if (thisInput.val().length > 0) {
			$('.conditions .from-to').addClass('from-to--active');
		} else {
			$('.conditions .from-to').removeClass('from-to--active');
		}
	}, 200);
});


// Изменение условий кредита. Срок кредита
var monthsRadio = $('.' + device + ' .radio-months--conditions .radio__wrapper');

for (var i = 1; i < 5; i++) {
	var currentMonth = data.creditDurationMonths - i;
	if (currentMonth <= 0) {
		break;
	}
	var currentSum = numberWithSpaces(Math.floor(data.creditDebt / currentMonth));
	var tab = '<div class="radio-tab">';
	var anotherTab = '';
	tab += ('<input form="main-form-mobile" value="month' + i + '-' + device + '" id="month' + i + '-' + device +'" name="month-' + device + '" type="radio" class="input-radio"');
	if (i == 1) {
		tab += ('checked="true"');
	}
	tab += ('>')
	tab += ('<label for="month' + i + '-' + device +'">');
	tab += ('<span class="radio-tab__title">'+ currentMonth + ' ' + declOfNum(currentMonth, ['месяц', 'месяца', 'месяцев']) + '</span>');
	tab += ('<span class="radio-tab__desc">'+ currentSum +' ₽</span>');
	tab += ('</label>');
	tab += ('</div>');
	monthsRadio.append(tab);
}

var anotherTab = ('<div class="radio-tab">');
anotherTab += ('<input form="main-form-mobile" id="anotherTab-' + device +'" name="month-' + device + '" type="radio" class="input-radio" value="anotherTab-' + device + '">');
anotherTab += ('<label class="anotherTabLabel" for="anotherTab-' + device +'">');
anotherTab += ('<span class="radio-tab__title">Другой</br>срок</span>');
anotherTab += ('<span class="radio-tab__desc"> </span>');
anotherTab += ('</label>');
anotherTab += ('</div>');
monthsRadio.append(anotherTab);

$('.button-submit').removeClass('button--disabled');
var firstTab = $('.radio-months--conditions .radio-tab:first-child');
var conditionsMonths = parseInt(firstTab.find('.radio-tab__title').text());
var conditionsPayment = parseInt(firstTab.find('.radio-tab__desc').text().replace(/\s+/g, ''));

$('input[type=radio][name=month-' + device + ']').change(function() {
	inputValue = $(this).val();
	if (inputValue == 'anotherTab-desktop' || inputValue == 'anotherTab-mobile') {
		$('.row__whatDate').show();
		$('.input--whatDate').focus();
		$('.button-submit').addClass('button--disabled');
		return;
	} else {
		$('.row__whatDate').hide();
		$('.input--whatDate').blur();
		$('.button-submit').removeClass('button--disabled');
		conditionsMonths = parseInt($(this).parent().find('.radio-tab__title').text());
		conditionsPayment = parseInt($(this).parent().find('.radio-tab__desc').text().replace(/\s+/g, ''));
	}
});

$('.input--whatDate').keyup(function () {
	var thisInput = $(this);
	conditionsMonths = thisInput.val();
	if (conditionsMonths.length > 0) {
		$('.row__new-payment-date').show();
		$('.button-submit').removeClass('button--disabled');
	} else {
		$('.row__new-payment-date').hide();
		$('.button-submit').addClass('button--disabled');
	}
	if (conditionsMonths >= 61) {
		$(this).val(60);
	}
	conditionsPayment = Math.floor(data.creditDebt / conditionsMonths);
	var conditionsNewPayment = numberWithSpaces(conditionsPayment) + ' ₽';
	$('.row__new-payment-date .row__text').text(conditionsNewPayment);
})

$('.conditions .' + device + ' .button').click(function () {
	if (!$(this).hasClass('button--disabled')) {
		if ($("#srok").is(':checked')) {
			data.creditDurationMonths = conditionsMonths
			data.creditMonthPayment = Math.floor(data.creditDebt / conditionsMonths)
			activateSmsPopup();
			updateStorage();
		} else {
			payment = getConditionPayment();
			var months = getConditionMonths(payment);
			data.creditDurationMonths = months;
			data.creditMonthPayment = payment;
			activateSmsPopup();
			updateStorage();
		}
	}
})


// Уменьшение срока кредита

var monthsRadio = $('.' + device + ' .radio-months--date .radio__wrapper');
var anotherTab = '';

for (var i = 1; i < 5; i++) {
	var currentMonth;
	if (i == 1) { currentMonth = 1}
	else if (i == 2 ) {currentMonth = 2}
	else if (i == 3 ) {currentMonth = 6}
	else if (i == 4) {currentMonth = 12}
	if (currentMonth > data.creditDurationMonths) {
		break;
	}
	var currentSum = numberWithSpaces(Math.ceil(data.creditMonthPayment * currentMonth));
	var tab = '<div class="radio-tab">';
	tab += ('<input form="main-form-mobile" value="month' + i + '-' + device + '" id="month' + i + '-' + device +'" name="month-' + device + '" type="radio" class="input-radio"');
	if (i == 1) {
		tab += ('checked="true"');
	}
	tab += ('>')
	tab += ('<label for="month' + i + '-' + device +'">');
	if (currentMonth == 12) {
		tab += ('<span class="radio-tab__title"> 1 год </span>');
	} else {
		tab += ('<span class="radio-tab__title">'+ currentMonth + ' ' + declOfNum(currentMonth, ['месяц', 'месяца', 'месяцев']) + '</span>');
	}
	tab += ('<span class="radio-tab__desc">'+ currentSum +' ₽</span>');
	tab += ('</label>');
	tab += ('</div>');
	monthsRadio.append(tab);
}

anotherTab += ('<div class="radio-tab">');
anotherTab += ('<input form="main-form-mobile" id="anotherTab-' + device +'" name="month-' + device + '" type="radio" class="input-radio" value="anotherTab-' + device + '">');
anotherTab += ('<label class="anotherTabLabel" for="anotherTab-' + device +'">');
anotherTab += ('<span class="radio-tab__title">Другой</br>срок</span>');
anotherTab += ('<span class="radio-tab__desc"> </span>');
anotherTab += ('</label>');
anotherTab += ('</div>');
monthsRadio.append(anotherTab);

var firstTab = $('.radio-months--conditions .radio-tab:first-child');
var conditionsMonths = parseInt(firstTab.find('.radio-tab__title').text());
var conditionsPayment = parseInt(firstTab.find('.radio-tab__desc').text().replace(/\s+/g, ''));

$('input[type=radio][name=month-' + device + ']').change(function() {
	inputValue = $(this).val();
	if (inputValue == 'anotherTab-desktop' || inputValue == 'anotherTab-mobile') {
		$('.row__newDate').show();
		$('.input--newDate').focus();
		$('.button-submit').addClass('button--disabled');
		return;
	} else {
		$('.row__newDate').hide();
		$('.input--newDate').blur();
		$('.button-submit').removeClass('button--disabled');
		var currentTab = $(this).parent().find('.radio-tab__title').text();
		if (currentTab == ' 1 год ') {
			conditionsMonths = 12;
		} else {
			conditionsMonths = parseInt(currentTab);
		}
		conditionsPayment = parseInt($(this).parent().find('.radio-tab__desc').text().replace(/\s+/g, ''));
	}
});

$('.input--newDate').keyup(function () {
	var thisInput = $(this);
	conditionsMonths = parseInt(thisInput.val());
	if (conditionsMonths > data.creditDurationMonths) {
		$(this).val(data.creditDurationMonths);
	}
	console.log(conditionsMonths);
	if (thisInput.val() > 0) {
		$('.row__new-credit-sum').show();
		$('.button-submit').removeClass('button--disabled');
	} else {
		$('.row__new-credit-sum').hide();
		$('.button-submit').addClass('button--disabled');
	}
	currentSum = Math.ceil(data.creditMonthPayment * conditionsMonths);
	var conditionsNewPayment = numberWithSpaces(currentSum) + ' ₽';
	$('.row__new-credit-sum .row__text').text(conditionsNewPayment);
})

$('.date .' + device + ' .button').click(function () {
	if (!$(this).hasClass('button--disabled')) {
		paymentAmount = parseInt(currentSum.replace(/\s+/g, ''));
		var currentAccountSum = parseInt($('.' + device + ' .selectize-input .number__val').text().replace(/\s+/g, ''))
		var chosenAccount = $('.' + device + ' .selectize-input .accountNumber').text();

		console.log(paymentAmount);
		console.log(currentAccountSum);

		if ($('#card').is(':checked')) {
			if (!data.creditDebt == 0) {
				data.creditDurationMonths -= conditionsMonths;
				data.creditDebt -= paymentAmount;
			}
			activateSmsPopup();
			updateStorage();
			return;
		}

		if (currentAccountSum < paymentAmount) {
			$('.row__schet .semi-title').addClass('semi-title--error').text('На счете недостаточно средств');
			$('.selectize-input').addClass('selectize-input--error');
		} else {
			if (!data.creditDebt == 0) {
				data.creditDebt -= paymentAmount;
				data.creditDurationMonths -= conditionsMonths;
			}
			if (chosenAccount == 2191) {
				data.accounts[1].accountSum -= paymentAmount
			} else {
				data.accounts[0].accountSum -= paymentAmount
			}
			activateSmsPopup();
			updateStorage();
		}
	}
})


// Каникулы
var monthsRadio = $('.' + device + ' .radio-months--vacations .radio__wrapper');
var currentMonthAmount = 1;

for (var i = 1; i < 7; i++) {
	var currentMonth;
	var tab = '<div class="radio-tab">';
	tab += ('<input form="main-form-mobile" value="month' + i + '-' + device + '" id="month' + i + '-' + device +'" name="month-' + device + '" type="radio" class="input-radio"');
	if (i == 1) {
		tab += ('checked="true"');
	}
	tab += ('>')
	tab += ('<label for="month' + i + '-' + device +'">');
	tab += ('<span class="radio-tab__title">' + i + ' ' + declOfNum(i, ['месяц', 'месяца', 'месяцев']) + '</span>');
	tab += ('<span class="radio-tab__desc"> до '+ getDateText(data.creditNextPaymentDate, i, true) +'</span>');
	tab += ('</label>');
	tab += ('</div>');
	monthsRadio.append(tab);
}

$('input[type=radio][name=month-' + device + ']').change(function() {
	currentMonthAmount = parseInt($(this).parent().find('.radio-tab__title').text());
});

$('.vacation .' + device + ' .button').click(function () {
	var currentDate =  new Date(data.creditNextPaymentDate);
	var currentDateMonth = currentDate.getMonth();
	var neededMonths = currentDateMonth + currentMonthAmount; // готовый месяц
	var newVacationDate = new Date();
	newVacationDate.setYear(2017);
	newVacationDate.setMonth(neededMonths, 26);
	data.creditNextPaymentDate = newVacationDate;
	activateSmsPopup();
	updateStorage();
})
