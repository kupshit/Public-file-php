/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-file-document': '&#xe90f;',
		'icon-file-text': '&#xe910;',
		'icon-file-code': '&#xe909;',
		'icon-file-video': '&#xe90a;',
		'icon-file-audio': '&#xe90c;',
		'icon-file-archive': '&#xe90d;',
		'icon-file-image': '&#xe90e;',
		'icon-file': '&#xe90b;',
		'icon-folder-open': '&#xe907;',
		'icon-folder': '&#xe908;',
		'icon-user': '&#xe904;',
		'icon-exit': '&#xe902;',
		'icon-key': '&#xe906;',
		'icon-setting': '&#xe905;',
		'icon-database': '&#xe903;',
		'icon-about': '&#xe901;',
		'icon-home': '&#xe900;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
