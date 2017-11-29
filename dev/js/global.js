(function()
{
	/**
	* Cache Common selectors
	*/
	var win	= $(window);
	var doc	= $(document);

	/**
	* Init WebFonts
	*/

	if(document.fonts)
	{
		document.fonts.load("1rem Montserrat");
		document.fonts.load("1rem Roboto Slab");
		document.fonts.ready.then(function(fontFaceSet) { document.documentElement.classList.add('fonts-loaded'); });
	}

	else { document.documentElement.classList.add('fonts-failed'); }

	/**
	* Init Headroom
	*/
	var headroom = new Headroom(document.querySelector('#header-main'),
	{
		'offset'	: 0,
		'tolerance'	: 5,

		'classes':
		{
			'initial'	: 'headroom',
			'pinned'	: 'headroom--pinned',
			'unpinned'	: 'headroom--unpinned'
		}
	});

	headroom.init();


	/**
	* Init Responsive Background Images
	*/
	var elements = $('[data-responsive-background-image]');
	for (var i = 0; i < elements.length; i ++) { new ImageResponsiveBackground(elements[i]); }


	/**
	* Init Isotope Gallery
	*/
	var grid	= $('#image-grid');
	var filter	= $('#image-grid__filter');

	grid.isotope
	({
		itemSelector	: '.grid-item',
		percentPosition	: true,
		masonry			: { columnWidth: '.grid-sizer' }
	});

	// Redraw grid after all images have been loaded
	//grid.imagesLoaded().progress(function() { grid.isotope('layout'); });

	// Redraw grid after image has been lazy loaded
	doc.on('lazyloaded', grid.find('lazyload'), function() { grid.isotope('layout'); });

	// Bind filter event to filter element
	doc.on('change', filter, function()
	{
		var filterValue = filter.val();

		// Filter items
		grid.isotope({ filter: (filterValue === '*') ? '*' : '[data-filter="' + filterValue + '"]'});
	});


	/**
	* Init Isotope Pagination
	*/// TO DO: Bind to resize
	var initItems = window.matchMedia('(min-width: 1024px)').matches ? 8 : 4;
	var appendItems = 4;

	// Add Pagination Button
	IsotopePaginationButton.init(doc, grid, filter, initItems, appendItems);


	/**
	* Init Form
	*/
	var modalForm = $('#modal__form');

	if (modalForm.length === 1)
	{
		var form			= modalForm.find('form');
		var textarea		= form.find('textarea');
		var label			= textarea.parent().find('label');

		var modalSuccess	= $('#modal__success');
		var modalError		= $('#modal__error');

		FormFoundationContaoAJAX.init(form, modalForm, modalSuccess, modalError);

		// Add character countdown to textarea
		FormCharacterCountdown.init(textarea, label, parseInt(textarea.attr('maxlength')));
	}


	/**
	* Init Data-Equalizer
	*/
	// Redraw Data-Equalizer after page loaded to ensure equal heights
	win.on('load', function () { Foundation.reInit('equalizer'); });


	/**
	* Fire Foundation
	**/
	doc.foundation();

})();