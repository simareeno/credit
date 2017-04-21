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
		creditFullText += ' и ' + creditMonthsLeftText
	}
	$('.creditDurationText').text(creditFullText);
}

function updateData() {
	setData('creditLastPaymentDate');
	setData('creditRecieveDate');
	setData('creditDurationMonths');
	setData('creditRate');
	setData('creditLimit', true);
	setData('creditDebt', true);
	setData('creditNextPaymentDate', true);
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
	'creditNextPaymentDate': '25 сентября',
	'creditDebt': 820000,
	'creditLimit': 900000,
	'creditRecieveDate': '29 сентября 2016',
	'creditLastPaymentDate': '29 сентября 2049',
	'creditMonthPayment': 6253,
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

// Изменение условий кредита
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
	if (payment < minimalPayment) { return false; }
	var months = getConditionMonths(payment);

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

$('.conditions .' + device + ' .button').click(function () {
	if (!$(this).hasClass('button--disabled')) {
		var payment = getConditionPayment();
		var months = getConditionMonths(payment);
		data.creditDurationMonths = months;
		activateSmsPopup();
		updateStorage();
	}
})
