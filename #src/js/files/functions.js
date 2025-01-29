var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}


testWebP(function (support) {
	if (support === true) {
		document.querySelector('html').classList.add('_webp');
	} else {
		document.querySelector('html').classList.add('_no-webp');
	}
});


//BODY_LOCK
let unlock = true;

function body_lock(delay) {
	let body = $("body");
	if (body.hasClass('_lock')) {
		body_lock_remove(delay);
	} else {
		body_lock_add(delay);
	}
}

function body_lock_remove(delay) {
	let body = $("body");
	if (unlock) {
		let lock_padding = $(".lock-padding");
		setTimeout(() => {
			lock_padding.each(function () { 
				let el = $(this);
				el.css({"padding-right": "0px"});
			});
			body.css({"padding-right": "0px"});
			body.removeClass('_lock');
		}, delay);

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}

function body_lock_add(delay) {
	let body = $("body");
	if (unlock) {
		let lock_padding = $(".lock-padding");
		lock_padding.each(function () { 
			let el = $(this);
			el.css({"padding-right": window.innerWidth - $('.wrapper').outerWidth() + 'px'});
		});
		body.css({"padding-right": window.innerWidth - $('.wrapper').outerWidth() + 'px'});
		body.addClass('_lock');
		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}



//MENU
let iconMenu = $(".icon-menu");
if (iconMenu != null) {
	let delay = 500;
	let menuBody = $(".menu__body");
	iconMenu.on("click", function (e) {
		if (unlock) {
			body_lock(delay);
			iconMenu.toggleClass("_active");
			menuBody.toggleClass("_active");
		}
	});
};

//POPUPS
let popupLinks = $('.popup-link');
if (popupLinks.length > 0) {
popupLinks.each(function () {
	let popupLink = $(this);
	popupLink.on("click", function(e) {
		let popupName = popupLink.attr('href').replace('#', '');
		let curentPopup = $('#'+popupName+'');
		popupOpen(curentPopup);
		e.preventDefault();
	});
});
}

let popupCloseIcons = $('.close-popup');
if (popupCloseIcons.length > 0) {
	popupCloseIcons.each(function () {
		let popupCloseIcon = $(this);
		popupCloseIcon.on("click", function(e) {
			popupClose(popupCloseIcon.closest('.popup'));
			e.preventDefault();
		});
	});
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		let popupActive = $('.popup._active');
		if (popupActive.length > 0) {
			popupClose(popupActive, false);
		} else {
			body_lock_add(500);
		}
		curentPopup.addClass('_active');
		curentPopup.on("click", function (e) {
			if ($(e.target).closest('.popup__content').length == 0) {
				popupClose($(e.target).closest('.popup'));
			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.removeClass('_active');
		if (doUnlock) {
			body_lock_remove(500);
		}
	}
}