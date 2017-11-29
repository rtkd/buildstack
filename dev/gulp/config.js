/* jslint node: true */
'use strict';

var config = {};

config.rootsrc = './';
config.rootdst = '../lh/www/files/public/themes/default/';
config.localhost = '';


/*
*	HTTP Tasks
*/
config.http =
{
	'sync':
	{
		'ui'		: false,
		'proxy'		: config.localhost,
		'port'		: 3000,
		'open'		: false,
		'notify'	: false,
		'online'	: false
	},
};

/*
*	HTML Tasks
*/
config.html =
{
	'src': [ config.rootsrc + 'html/build/**/*.{html5,html,htm}' ],
	'dst': config.rootdst + 'html',

	'minify':
	{
		'options':
		{
			'collapseInlineTagWhitespace'	: true,
			'collapseWhitespace'			: true,
			'html5'							: true,
			'quoteCharacter'				: '"',
			'removeComments'				: true
		}
	},

	'template':
	{
		'src': [ config.rootsrc + 'html/template/build/*.njk' ],
		'dst': config.rootsrc + 'html/build/',

		'options': { 'path' : [ config.rootsrc + 'html/template/partials/' ] },

		'partials': [ config.rootsrc + 'html/template/partials/' ],

		'watch':
		[
			config.rootsrc + 'html/template/build/*.njk',
			config.rootsrc + 'html/template/partials/**/*.{html,macro,tmpl}'
		]

	}
};


/*
*	CSS Tasks
*/
config.css =
{
	'src': [ config.rootsrc + 'css/build/app.css' ],
	'dst': config.rootdst + 'css/',

	'critical':
	{
		'src': [ config.rootdst + 'html/test.html' ],
		'dst': config.rootdst + 'css/',

		'options':
		{
			'base'		: config.rootdst,
			'css'		: config.rootdst + 'css/app.min.css',
			//'include'	: ['#header-main'],

			'minify'	: true,
			'inline'	: false,
			'height'	: 1024,
			'width'		: 1280
		}
	},

	'concat':
	{
		'filename'	: 'app.min.css',
		'newline'	: '\n'
	},

	'map':
	{
		'dst' : './map',
		'options': { 'init': { 'loadMaps': true }, 'write': {} }
	},

	'minify': { 'options': { 'level': { '1': { 'all': true }, '2': { 'all': true, 'mergeMedia': true } } } },

	'prefix':
	{
		'browsers'	: [ 'last 2 versions', 'ie >= 9', 'and_chr >= 2.3' ],
		'cascade'	: false,
		'grid'		: true
	}
};


/*
*	SASS Tasks
*/
config.sass =
{
	'src': [ config.rootsrc + 'css/sass/app.scss' ],
	'dst': config.rootsrc + 'css/build/',

	'watch': [ config.rootsrc + 'css/sass/**/*.{sass,scss}' ],

	'options':
	{
		'includePaths':
		[
			config.rootsrc + 'node_modules/foundation-sites/scss/',
			config.rootsrc + 'node_modules/motion-ui/src/'
		],
		'indentType'		: 'tab',
		'indentWidth'		: 1
	},

	'map':
	{
		'dst' : './map',
		'options': { 'init': {}, 'write': {} }
	}
};


/*
*	JS Tasks
*/
config.js =
{
	'src':
	[
		config.rootsrc + 'node_modules/jquery/dist/jquery.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.core.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.util.box.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.util.keyboard.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.util.mediaQuery.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.util.motion.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.util.triggers.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.util.timerAndImageLoader.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.util.touch.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.responsiveToggle.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.smoothScroll.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.abide.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.equalizer.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.interchange.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.magellan.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.orbit.js',
		config.rootsrc + 'node_modules/foundation-sites/dist/js/plugins/foundation.reveal.js',
		config.rootsrc + 'node_modules/imagesloaded/imagesloaded.pkgd.js',
		config.rootsrc + 'node_modules/svgxuse/svgxuse.js',
		config.rootsrc + 'node_modules/lazysizes/lazysizes.js',
		config.rootsrc + 'node_modules/isotope-layout/dist/isotope.pkgd.js',
		config.rootsrc + 'js/vendor/headroom/headroom.js@0.9.4.js',
		config.rootsrc + 'js/modules/image.background.cover.js',
		config.rootsrc + 'js/modules/isotope.pagination.button.js',
		config.rootsrc + 'js/modules/form.character.countdown.js',
		config.rootsrc + 'js/modules/form.foundation.contao.ajax.js',
		config.rootsrc + 'js/global.js'
	],

	'dst': config.rootdst + 'js/',

	'babel'	: { 'presets': ['env'] },

	'concat': { 'filename': 'app.min.js' },

	'map':
	{
		'dst' : './map',
		'options': { 'init': {}, 'write': {} }
	},

	'minify': {}
};

/*
*	JSON Tasks
*/
config.json =
{
	'src': [ config.rootsrc + 'js/manifest.json' ],
	'dst': config.rootdst + 'js/'
};

/*
*	Image Tasks
*/
config.img =
{
	'minify':
	{
		'src' : config.rootsrc + 'img/build/**/*.svg',
		'dst' : config.rootdst + 'img/',

		'svgo':
		{
			'plugins':
			[
				{ 'removeViewBox'				: false },
				{ 'removeUselessStrokeAndFill'	: false },
				{ 'removeEmptyAttrs'			: false },
				{ 'cleanupIDs'					: false }
			]
		}
	},

	'resize':
	{
		'src' : config.rootsrc + 'img/resize/**/*.{jpg,jpeg,png,gif}',
		'dst' : config.rootsrc + 'img/build/',

		'options':
		{
			'errorOnEnlargement'	: false,
			'errorOnUnusedConfig'	: false,
			'progressive'			: true,
			'quality'				: 80,
			//'rotate'				: true,
			'strictMatchConfig'		: false,
			'strictMatchImages'		: false,
			'withMetadata'			: false
		},

		'buildFormats': function()
		{
			var formats = {};
			var resolutions = [1];

			var globs =
			[
				{ 'glob': 'bg-full/**/*.jpg', 'format': 'jpeg', 'width': [640, 1024, 1200, 1440] },
				{ 'glob': 'bg-half/**/*.jpg', 'format': 'jpeg', 'width': [640, 1024] },
				{ 'glob': 'gallery/**/intro__*.jpg', 'format': 'jpeg', 'width': [320, 640], 'ratio': { 'x': 4, 'y': 3 } },
				{ 'glob': 'gallery/**/slide__*.jpg', 'format': 'jpeg', 'width': [320, 640, 1024, 1280, 1440], 'ratio': { 'x': 19, 'y': 9 } }
			];

			globs.map(function(v, i)
			{
				formats[globs[i].glob] = [];

				globs[i].width.map(function(vv, ii)
				{
					resolutions.map(function(vvv, iii)
					{
						formats[globs[i].glob].push(
						{
							'format': globs[i].format,
							'rename': { 'suffix': '--' + vv + '@' + vvv },
							'width': vv * vvv,
							'height': (typeof globs[i].ratio !== 'undefined') ? ((globs[i].width[ii] / globs[i].ratio.x) * globs[i].ratio.y) * vvv : null
						});
					});
				});
			});

			return formats;
		}()
	}
};


/*
*	Copy Tasks
*/

config.copy =
[
	{ 'src': config.rootsrc + 'node_modules/fontfaceobserver/fontfaceobserver.standalone.js', 'dst': config.rootdst + 'js/', 'rename': 'fontfaceobserver.min.js' },
	{ 'src': config.rootsrc + 'node_modules/pwacompat/pwacompat.min.js', 'dst': config.rootdst + 'js/', 'rename': 'pwacompat.min.js' }
];

/*
*	Utility Tasks
*/
config.utils =
{
	'cache': { 'optimizeMemory': false },

	'del':
	{
		'src': config.rootdst + '*',
		'options': { 'force': true }
	},

	'notify':
	{
		'onLast'			: false,
		'emitError'			: false,
		'message'			: '<%= error.message %>',
		'title'				: 'ERROR',
		'templateOptions'	: {}
	}
};

module.exports = config;