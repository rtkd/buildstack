/**
* Form Contao AJAX
*/

var FormFoundationContaoAJAX = (function()
{
	var config =
	{
		'method'				: 'POST',
		'alphaExtended'			: /^[a-zäöüßA-ZÄÖÜ ]+$/,
		'alphaNumericExtended'	: /^[a-zäöüßA-ZÄÖÜ0-9\.,;\-\+\*\/\\_ ]+$/
	};

	var doc;
	var form;
	var patternAlphaExtended;
	var patternAlphaNumericExtended;
	var patternEmail;
	var patternInteger;
	var modalForm;
	var modalSuccess;
	var modalError;
	var submitButton;

	var init = function(element, modal1, modal2, modal3)
	{
		doc 			= $(document);
		form			= element;
		modalForm		= modal1;
		modalSuccess	= modal2;
		modalError		= modal3;

		patternAlphaExtended			= form.find('.pattern__alpha--extended');
		patternAlphaNumericExtended		= form.find('.pattern__alpha-numeric--extended');
		patternEmail					= form.find('.pattern__email');
		patternInteger					= form.find('.pattern__integer');

		submitButton					= form.find('.submit');

		// Extend Foundation default patterns
		Foundation.Abide.defaults.patterns['alpha--extended'] = config.alphaExtended;
		Foundation.Abide.defaults.patterns['alpha_numeric--extended'] = config.alphaNumericExtended;

		// Add pattern attribute to fields
		patternAlphaExtended.attr('pattern', 'alpha--extended');
		patternAlphaNumericExtended.attr('pattern', 'alpha_numeric--extended');
		patternEmail.attr('pattern', 'email');
		patternInteger.attr('pattern', 'integer');

		bindValidationAction();
		bindSubmitAction();

	};

	var bindValidationAction = function() { doc.on('formvalid.zf.abide', form, function(ev, el) { submitForm(); }); };

	var bindSubmitAction = function() { doc.on('submit', form, function(ev) { ev.preventDefault(); }); };

	var submitForm = function()
	{
		$.ajax(
		{
			type: config.method,
			data: form.serializeArray(),

			success: function(response) { var foo = response ? injectResponse($(response)) : triggerModal('success'); },

			error: function() { triggerModal('error'); }
		});

	};

	var injectResponse = function(response)
	{
		var id			= response.find('input.error').attr('id');
		var parent		= response.find('#' + id).parent();
		var offending	= form.find('#' + id).parent();

		offending.replaceWith(parent);
	};

	var triggerModal = function(status)
	{
		if (status === 'success')
		{
			// Reset form
			resetForm();

			// Close form-modal
			modalForm.foundation('close');

			// Open success-modal
			modalForm.on('closed.zf.reveal', function ()
			{
				modalSuccess.foundation('open');

				// Remove closed event from form-modal, so this is not triggert again
				modalSuccess.on('closed.zf.reveal', function () { modalForm.off('closed.zf.reveal'); });
			});
		}

		else
		{
			// Close form-modal
			modalForm.foundation('close');

			// Open error-modal
			modalForm.on('closed.zf.reveal', function ()
			{
				modalError.foundation('open');

				// Remove closed event from form-modal, so this is not triggert again
				modalSuccess.on('closed.zf.reveal', function () { modalForm.off('closed.zf.reveal'); });
			});
		}
	};

	var resetForm = function()
	{
		form.foundation('resetForm');
		form.find('p.error').remove();
		form.find('.error').removeClass('error');
	};

	return { 'init': init };
})();