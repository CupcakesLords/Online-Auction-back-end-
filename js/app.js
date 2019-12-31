$(document).ready(function () {

	/*------------------
		  hide the password
	  --------------------*/
	$('.toggle-password').on('click', function () {
		$(this).toggleClass("zmdi-eye zmdi-eye-off");
		var input = $($(this).attr("toggle"));
		if (input.attr("type") == "password") {
			input.attr("type", "text");
		} else {
			input.attr("type", "password");
		}
	});

	/*------------------
		  Single Product
	  --------------------*/
	$('.product-thumbs-track > .pt').on('click', function () {
		$('.product-thumbs-track .pt').removeClass('active');
		$(this).addClass('active');
		var imgurl = $(this).data('imgbigurl');
		var bigImg = $('.product-big-img').attr('src');
		if (imgurl != bigImg) {
			$('.product-big-img').attr({ src: imgurl });
			$('.zoomImg').attr({ src: imgurl });
		}
	});

	/*------------------
		  wishbtn
	  --------------------*/
	$('.wishlist-btn').on('click', function () {
                            $(this).toggleClass('color-f151167 color-666666');
                            var element = $('.wishlist-btn > i');
                            element.toggleClass('fa-heart fa-heart-o');
                        });
	
	/*------------------
		  go to forgetpassword page button
	  --------------------*/
	$('.forget-pw-btn').on('click', function () {
		$('.login-page').css('display', 'none');
		$('.forgetpassword-page').css('display', 'flex');
	});

	/*------------------
		  back login page button
	  --------------------*/
	$('.back-login-btn').on('click', function () {
		$('.login-page').css('display', 'flex');
		$('.forgetpassword-page').css('display', 'none');
		$('.signup-page').css('display', 'none');
	});

	/*------------------
		  sign up button
	  --------------------*/
	$('.signup-btn').on('click', function () {
		$('.login-page').css('display', 'none');
		$('.forgetpassword-page').css('display', 'none');
		$('.signup-page').css('display', 'flex');
	});

	/*------------------
		  verify bid
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
	$('.btn-bid-product').on('click', function () {
		const mess = `
		<p class = 'p-b-10'>Bạn có chắc muốn ra giá?</p>
		<p>Giá hiện tại: 1,000,000 vnđ</p>
		<p> Bước giá: 10, 000 vnđ</p>
		<p>Giá đề nghị: 1,010,000 vnđ</p>
		<span>Giá của bạn</span>	
		<input type='number' step='10000' class='b-d-l'>
		`;
		save(mess);
		$.post('/getbid');
	});

	$('.btn-cancel').on('click', function () {
		const mess = `
		<p class = 'p-b-10'>Bạn có chắc muốn hủy giao dịch?</p>
		`
		save(mess);
	});

	$('.btn-del').on('click', function () {
		const mess = `
		<p class = 'p-b-10'>Bạn có chắc muốn xoá sản phẩm?</p>
		`
		save(mess);
	});

	$('.show-contact').on('click', function(){
		var numberPhone = `0936425244`;
		$(this).html(numberPhone);
	});

});
