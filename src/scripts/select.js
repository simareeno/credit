function numberWithSpace(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

$('.select').selectize({
	valueField: 'id',
	labelField: 'name',
	options: [
		{id: 1, money: numberWithSpace(accounts[0].accountSum), semi: ',10', cards: '2', schet: 'Текущий счёт', schetNumber: accounts[0].accountNumber},
		{id: 2, money: numberWithSpace(accounts[1].accountSum), semi: ',51', cards: '0', schet: 'Другой счёт', schetNumber: accounts[1].accountNumber}
	],
	create: false,
	render: {
		option: function(item, escape) {
			var newItem = '';
			newItem += '<div>';
			newItem += '<span class="select__money number">';
			newItem += '<span class="number__val">' + item.money + '</span>';
			newItem += '<span class="number__grey">' + item.semi + ' ₽</span>';
			if (item.cards > 0) {
				newItem += '<span class="number__cards">×' + item.cards + '</span>';
			}
			newItem += '</span>';
			newItem += '<span class="description"> ' + item.schet + '··' + '<span class="accountNumber">' + item.schetNumber + '</span>' + '</span>';
			newItem += '</div>';

			return newItem;
		},

		item: function (item, escape) {
			var newItem = '';
			newItem += '<div>';
			newItem += '<span class="select__money number">';
			newItem += '<span class="number__val">' + item.money + '</span>';
			newItem += '<span class="number__grey">' + item.semi + ' ₽</span>';
			if (item.cards > 0) {
				newItem += '<span class="number__cards">×' + item.cards + '</span>';
			}
			newItem += '</span>';
			newItem += '<span class="description"> ' + item.schet + '··' + '<span class="accountNumber">' + item.schetNumber + '</span>' + '</span>';
			newItem += '</div>';

			return newItem;
		}
	}
});
