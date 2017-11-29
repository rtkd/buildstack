/**
* Isotope Pagination Button
*/

var IsotopePaginationButton = (function()
{
	var config =
	{
		'initItems'		: 4,
		'appendItems'	: 4,
		'itemClass'		: '.grid-item',
		'buttonID'		: 'load-more',
		'buttonClass'	: 'button primary hollow large',
		'buttonText'	: 'Mehr anzeigen'
	};

	var doc;
	var grid;
	var gridData;
	var gridItems;
	var gridFilter;
	var gridFilterValue;

	var initItems;
	var appendItems;
	var itemCount;
	var itemCounter;
	var itemsLoaded;
	var itemsTotal;

	var button;

	var init = function(foo, element, filter, init, append)
	{
		doc				= foo;
		grid			= element;
		gridData		= grid.data('isotope');
		gridItems		= grid.find(config.itemClass);
		gridFilter		= filter;
		gridFilterValue = filter.val();

		initItems		= init || config.initItems;
		appendItems		= append || config.appendItems;
		itemsTotal		= gridItems.length;
		itemCount		= {};

		initCatagory('*');

		countItems();

		appendButton();

		appendItemCounter();

		updateItemCounter();

		bindButtonAction();

		bindFilterAction();
	};

	// Display initial filtered items
	var initCatagory = function(filter)
	{
		var hiddenItems		= gridItems.filter('.hidden');
		var visibleItems	= gridItems.not('.hidden');
		var newItems		= [];

		gridFilterValue = filter;

		itemsLoaded = initItems;

		visibleItems.addClass('hidden');

		if (gridFilterValue === '*')
		{
			newItems = gridData.filteredItems.slice(0, initItems).map(function(item) { return item.element; }); // Get first 4 items

			newItems.map(function(item) { item.classList.remove('hidden'); }); // Show first 4 grid items
		}

		else
		{
			newItems = gridItems.filter('[data-filter="' + gridFilterValue + '"]').slice(0, initItems); // Get first 4 filtered items

			newItems.removeClass('hidden'); // Show first 4 filtered items
		}

		grid.isotope('layout'); // Redraw grid after items have been added
	};

	// Counts available items per filter
	var countItems = function ()
	{
		gridItems.each(function(i, item)
		{
			var category = item.getAttribute('data-filter');

			itemCount[category] = itemCount[category] ? itemCount[category] += 1 : 1;
		});
	};

	// Loads more items and updates the item counter
	var loadMoreItems = function()
	{
		loadItems(itemsLoaded + appendItems);

		itemsLoaded += appendItems;

		updateItemCounter();
	};

	// Displays more items
	var loadItems = function(number)
	{
		if (number > itemCount[gridFilterValue]) number = itemCount[gridFilterValue];

		var items = gridData.filteredItems.slice(0, number).map(function(item) { return item.element; });

		items.map(function(item) { item.classList.remove('hidden'); });

		grid.isotope('layout');
	};

	// Adds the pagination-button element
	var appendButton = function()
	{
		grid.after('<button id="' + config.buttonID + '" class="' + config.buttonClass + '">' + config.buttonText + '</button>');

		button = $('#' + config.buttonID);
	};

	// Adds the item-counter element
	var appendItemCounter = function()
	{
		button.after('<p id="item-counter"></p>');

		itemCounter = $('#item-counter');
	};

	// Updates the item counter element
	var updateItemCounter = function ()
	{
		var itemsInCategory = (gridFilterValue === '*') ? itemsTotal : itemCount[gridFilterValue];

		itemCounter.html('<span>' + gridItems.not('.hidden').length + ' von ' + itemsInCategory + '</<span>');
	};

	// Adds action to pagination-button
	var bindButtonAction = function()
	{
		button.on('click', loadMoreItems);
	};

	// Adds action to filter
	var bindFilterAction = function()
	{
		doc.on('change', gridFilter, applyFilter);
	};

	// Init category and update counter
	var applyFilter = function()
	{
		initCatagory(gridFilter.val());

		updateItemCounter();
	};

	return { 'init': init };
})();



/*
grid.after
(
	'<div class="text-center" style="margin: 4rem auto;"><svg class="icon icon--small" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve"><use xlink:href="files/public/themes/default/img/icons.svg#icon__checkmark"></use></svg>' +
	'<p>Alle Referenzen geladen</p>' +
	'<p>Für weitere Informationen erreichen Sie uns über Telefon und E-Mail</p>' +
	'<a href="./#section__contact" class="arrow__down">Kontaktinformationen anzeigen</a></div>'
);
*/