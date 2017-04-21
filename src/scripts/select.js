function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


$('.select').selectize({
	valueField: 'id',
	labelField: 'name',
	options: [
		{id: 1, money: numberWithSpaces(accounts[0].accountSum), semi: ',10', schet: 'Текущий счёт', schetNumber: accounts[0].accountNumber},
		{id: 2, money: numberWithSpaces(accounts[1].accountSum), semi: ',51', schet: 'Другой счёт', schetNumber: accounts[1].accountNumber}
	],
	create: false,
	render: {
		option: function(item, escape) {
			return '<div>' +
				'<span class="select__money number">' +
					'<span class="number__val">' + item.money + '</span>' +
					'<span class="number__grey">' + item.semi + ' ₽</span>' +
				'</span>' +
				'<span class="description"> ' + item.schet + '··' + '<span class="accountNumber">' + item.schetNumber + '</span>' + '</span>' +
			'</div>';
		},

		item: function (item, escape) {
			return '<div>' +
				'<span class="select__money number">' +
					'<span class="number__val">' + item.money + '</span>' +
					'<span class="number__grey">' + item.semi + ' ₽</span>' +
				'</span>' +
				'<span class="description"> ' + item.schet + '··' + '<span class="accountNumber">' + item.schetNumber + '</span>' + '</span>' +
			'</div>';
		}
	}
});
