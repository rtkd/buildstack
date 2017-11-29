/**
* Form Character Counter
*/

var FormCharacterCountdown = (function()
{
	var config =
	{
		'formInputMaxLength'	: 512,
		'formCountdownTextPre'	: '(',
		'formCountdownTextPost'	: ' Zeichen übrig)',
		'formCountdownClass'	: 'form__characters-left',
		'notPrintableKeyCodes'	: [8, 37, 38, 39, 40, 46]
	};

	var formInputElement;
	var formOutputElement;
	var formInputMaxLength;
	var formCountdownTextPre;
	var formCountdownTextPost;

	var init = function(input, output, maxLength)
	{
		formInputElement		= input;
		formOutputElement		= output;
		formInputMaxLength		= maxLength || config.formInputMaxLength;
		formCountdownTextPre	= output.html().trim() || config.formCountdownTextPre;
		formCountdownTextPost	= config.formCountdownTextPost;

		bindKeyAction();
	};

	var bindKeyAction = function()
	{
		formInputElement.on('keyup', function(key) { checkInputLength(this, key); });
	};

	var checkInputLength = function(input, key)
	{
		var currentTextLength = input.value.length;

		if (isPrintableKey(key))
		{
			if (currentTextLength >= (formInputMaxLength)) input.value = input.value.substring(0, formInputMaxLength);
		}

		formOutputElement.html(formCountdownTextPre + ' <span class="' + config.formCountdownClass + '">' + config.formCountdownTextPre + (formInputMaxLength - currentTextLength) + formCountdownTextPost + '</span>');
	};

	var isPrintableKey = function(key)
	{
		if (config.notPrintableKeyCodes.indexOf(key.keyCode) !== -1) return false;

		else return true;
	};

	return { 'init': init };
})();