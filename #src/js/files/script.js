//MENU ASIDE BURGER 
let menuPageBurger = $('.menu-page__burger');
let menuPageBody = $('.menu-page__body');
menuPageBurger.on("click", function (e) {
    menuPageBurger.toggleClass('_active');
    menuPageBody.slideToggle();
});


//MENU ASIDE
if (isMobile.any()) {
	let menuParents = $('.menu-page__parent > a');
	menuParents.each(function () {
		let menuParent = $(this);
		menuParent.on("click", function(e) {
			menuParent.parent().toggleClass('_active');
			e.preventDefault();
		});
	});
} else {
	let menuParents = $('.menu-page__parent');
	menuParents.each(function () {
		let menuParent = $(this);
		menuParent.on("mouseenter", function(e) {
			menuParent.addClass('_active');
		});
		menuParent.on("mouseleave", function(e) {
			menuParent.removeClass('_active');
		});
	});
}


//SEARCH
let searchTitle = $('.search-page__title');
let categoriesSearch = $('.categories-search');
searchTitle.on("click", function (e) {
    searchTitle.toggleClass('_active');
    categoriesSearch.slideToggle();
});

let searchSelect = $('.search-page__title');
let checkboxCategories = $('.categories-search__checkbox');

checkboxCategories.each(function () { 
	let checkboxCategory = $(this);
	checkboxCategory.on("change", function () {
		checkboxCategory.toggleClass('_active');
		checkboxActiveCategories = $('.categories-search__checkbox._active');
		if (checkboxActiveCategories.length > 0) {
			searchSelect.addClass('_categories');
			let searchQuantity = $('.search-page__quantity', searchSelect);
			searchQuantity.html(searchQuantity.attr('data-text') + ' ' + checkboxActiveCategories.length);
		}else {
			searchSelect.removeClass('_categories');
		}
	});
});


//RANGE
if (document.querySelector('.price-filter__slider')) {
	const priceFilter = document.querySelector('.price-filter__slider');
	if (priceFilter) {
		noUiSlider.create(priceFilter, {
			start: [0, 200000],
			connect: true,
			tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
			range: {
				'min': [0],
				'max': [200000]
			}
		});
	}
	const priceStart = document.getElementById('price-start');
	const priceEnd = document.getElementById('price-end');
	priceStart.addEventListener('change', function () {
		priceFilter.noUiSlider.set([priceStart.value, null]);
	}); 
	priceEnd.addEventListener('change', function () {
		priceFilter.noUiSlider.set([null, priceEnd.value]);
	}); 
}


//SPOLLERS
let spollers = $('._spoller');
$(spollers).each(function () {
	let spoller = $(this);
	spoller.on("click", function(e) {
		spoller.toggleClass('_active');
		spoller.next().slideToggle();
	});
});


//FILTER
if (isMobile.any()) { 
let filterTitle= $('.filter__title');
filterTitle.on("click", function (e) {
    filterTitle.toggleClass("_active");
	filterTitle.next().slideToggle();
});
}


//QUANTITY
let quantityButtons = $('.quantity__button');
if (quantityButtons.length > 0) {
	quantityButtons.each(function() {
		let quantityButton = $(this);
		quantityButton.on("click", function (e) {
			let value = parseInt(quantityButton.closest('.quantity').find('input').val());
			if (quantityButton.hasClass('quantity__button_plus')) {
				value++;
			} else {
				value = value - 1;
				if (value < 1) {
					value = 1
				}
			}
			quantityButton.closest('.quantity').find('input').val(value);
		});
	});
}

//TABS
let tabs = $("._tabs");
tabs.each(function() {
	tab = $(this);
	let tabs_items = $("._tabs-item", tab);
	let tabs_blocks = $("._tabs-block", tab);
	tabs_items.each(function (index) { 
		let tabs_item = $(this);
		tabs_item.on("click", function(e) {
			tabs_items.each(function (index) { 
				let tabs_item = $(this);
				tabs_item.removeClass('_active');
				tabs_blocks.eq(index).removeClass('_active');
			});
			tabs_item.addClass('_active');
			tabs_blocks.eq(index).addClass('_active');
			e.preventDefault();
		});
	});
});


//CUSTOM SELECT
let customSelects = $('.custom-select');
customSelects.each(function () { 
	customSelect = $(this);
	customSelect.on('click', function(e) {
		$(e.currentTarget).toggleClass('_active');
		$(e.currentTarget).find('.custom-select__dropdown').slideToggle(100);
		if ($(e.target).hasClass('custom-select__item')) {
			let text = $(e.target).text();
			$(e.currentTarget).find('.custom-select__title').text(text);
		}
	});	
});


//FORM
$('#form').submit(function(event) {
	event.preventDefault();
	let self = $(this);
	let data = $(self).serialize();
	let error = 0;

	$('._req', self).each(function () {
		if ($(this).val() == "") {
			$(this).css({"border": "1px solid red"});
			error++;
		}
		else {
			$(this).css({"border": "1px solid #e5e5e5"});
		}
	});
	if (error == 0) {
		$.ajax({
			url: 'php/send.php',
			type: 'POST',
			data: data,
		})
		.done(function(data) {
			console.log(data);
			$(self).trigger("reset");
			$(self).find('.form__success').html('Заявка отправлена');
		});
	}
}); 



