
$(document).ready(function () {

	"use strict";

	[].slice.call(document.querySelectorAll('select.cs-select')).forEach(function (el) {
		new SelectFx(el);
	});

	jQuery('.selectpicker').selectpicker;


	$('#menuToggle').on('click', function (event) {
		$('body').toggleClass('open');
	});

	$('.search-trigger').on('click', function (event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').addClass('open');
	});

	$('.search-close').on('click', function (event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').removeClass('open');
	});

	/*------------------
		  verify 
	  --------------------*/



	const ui = {
		confirm: async (message) => createConfirm(message)
	}

	const createConfirm = (message) => {
		return new Promise((complete, failed) => {
			$('#confirmMessage').html(message);

			$('#confirmYes').off('click');
			$('#confirmNo').off('click');

			$('#confirmYes').on('click', () => { $('.confirm').hide(); complete(true); });
			$('#confirmNo').on('click', () => { $('.confirm').hide(); complete(false); });

			$('.confirm').show();
		});
	}

	const save = async (mess) => {
		const confirm = await ui.confirm(mess);
	}

	$('.btn-del').on('click', function () {
		const mess = `<p class = 'p-b-10'>Bạn có chắc muốn xoá?</p>`;
		save(mess);
	});

	$('.btn-des').on('click', function () {
		const mess = `<p class = 'p-b-10'>Bạn có chắc muốn hạ cấp?</p>`;
		save(mess);
	});

	$('.btn-argee').on('click', function () {
		const mess = `<p class = 'p-b-10'>Bạn có chắc muốn đồng ý?</p>`;
		save(mess);
	});

});