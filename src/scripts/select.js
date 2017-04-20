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
