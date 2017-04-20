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


var userData = {
	'name': 'Дмитрий Маслов',
	'accountNumber': '4081 7810 7044 4000 1693',
	'creditNextPaymentDate': '25 сентября',
	'creditNextPayment': 6253,
	'creditDebt': 1882838,
	'creditLimit': 70000,
	'creditRecieveDate': '29 сентября 2016',
	'creditLastPaymentDate': '29 сентября 2049',
	'creditMonthPayment': 6253,
	'creditRate': '18,99',
	'creditDurationMonths': 62,
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

// Если данных нет, загружаем
if (localStorage.length == 0) {
	localStorage.setItem('user', JSON.stringify(userData))
}

// Получаем данные
var data = JSON.parse(localStorage.getItem('user'));

// Счета и текущий счет
var accounts = data.accounts;
var currentAccount = accounts[0];
var currentAccountNumber = currentAccount.accountNumber;
var currentAccountSum = currentAccount.accountSum;

// Длительность кредита
var creditYearsLeft = Math.floor(data.creditDurationMonths / 12);
var creditMonthsLeft = Math.floor(data.creditDurationMonths % 12);
var creditYearsLeftText = creditYearsLeft + ' ' + declOfNum(
	creditYearsLeft, ['год', 'года', 'лет']
)
var creditMonthsLeftText = creditMonthsLeft + ' ' + declOfNum(
	creditMonthsLeft, ['месяц', 'месяца', 'месяцев']
)
var creditFullText = ''
if (creditYearsLeft > 0) {
	creditFullText += creditYearsLeftText + ' и ';
}
creditFullText += creditMonthsLeftText;

// Вбиваем данные
setData('creditLastPaymentDate');
setData('creditRecieveDate');
setData('creditDurationMonths');
setData('creditRate');
setData('creditMonthPayment', true); // если нужно сделать пробел в цифре
setData('creditLimit', true);
setData('creditDebt', true);
setData('creditNextPayment', true);
setData('creditNextPaymentDate', true);
$('.creditDurationText').text(creditFullText);
$('.currentAccountSum').text(numberWithSpaces(currentAccountSum));
$('.currentAccountNumber').text(numberWithSpaces(currentAccountNumber));
