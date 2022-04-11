/*
Name: 			Theme Base
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version:	9.3.0
*/

// Theme
window.theme = {};

// Theme Common Functions
window.theme.fn = {

	getOptions: function(opts) {

		if (typeof(opts) == 'object') {

			return opts;

		} else if (typeof(opts) == 'string') {

			try {
				return JSON.parse(opts.replace(/'/g,'"').replace(';',''));
			} catch(e) {
				return {};
			}

		} else {

			return {};

		}

	},

	execPluginFunction: function( functionName, context ) {
		var args = Array.prototype.slice.call(arguments, 2);
		var namespaces = functionName.split(".");
		var func = namespaces.pop();
		
		for(var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}

		return context[func].apply(context, args);
	},

	intObs: function(selector, functionName, intObsOptions, alwaysObserve) {
		var $el = document.querySelectorAll( selector );
		var intersectionObserverOptions = {
			rootMargin: '0px 0px 200px 0px'
		}

		if( Object.keys(intObsOptions).length ) {
			intersectionObserverOptions = $.extend(intersectionObserverOptions, intObsOptions);
		}

		var observer = new IntersectionObserver(function(entries) {
			for(var i=0; i < entries.length; i++) {
				var entry = entries[i];

				if (entry.intersectionRatio > 0 ) {
					if( typeof functionName === 'string' ) {
						var func = Function( 'return ' + functionName )();
					} else {
						var callback = functionName;

						callback.call( $(entry.target) );
					}

					// Unobserve
					if( !alwaysObserve ) {
						observer.unobserve(entry.target);   
					}

				}
			}
		}, intersectionObserverOptions);
		
		$( $el ).each(function(){
			observer.observe( $(this)[0] );
		});
	},

	intObsInit: function(selector, functionName) {
		var $el = document.querySelectorAll( selector );
		var intersectionObserverOptions = {
			rootMargin: '200px'
		}

		var observer = new IntersectionObserver(function(entries) {
			for(var i=0; i < entries.length; i++) {
				var entry = entries[i];
				if (entry.intersectionRatio > 0) {
				  
					var $this = $(entry.target),
						opts;

					var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
					if (pluginOptions)
						opts = pluginOptions;

					theme.fn.execPluginFunction(functionName, $this, opts);	

					// Unobserve
					observer.unobserve(entry.target);              
				}
			}
		}, intersectionObserverOptions);
		
		$( $el ).each(function(){
			observer.observe( $(this)[0] );
		});
	},

	dynIntObsInit: function(selector, functionName, pluginDefaults) {
		var $el = document.querySelectorAll( selector );

		$( $el ).each(function(){
			var $this = $(this),
				opts;

			var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
			if (pluginOptions)
				opts = pluginOptions;

			var mergedPluginDefaults = theme.fn.mergeOptions( pluginDefaults, opts )

			var intersectionObserverOptions = {
				rootMargin: theme.fn.getRootMargin( functionName, mergedPluginDefaults ),
				threshold: 0
			}

			if(!mergedPluginDefaults.forceInit) {

				var observer = new IntersectionObserver(function(entries) {
					for(var i=0; i < entries.length; i++) {
						var entry = entries[i];
						
						if (entry.intersectionRatio > 0) {
							theme.fn.execPluginFunction(functionName, $this, mergedPluginDefaults);	

							// Unobserve
							observer.unobserve(entry.target);              
						}
					}
				}, intersectionObserverOptions);

				observer.observe( $this[0] );

			} else {
				theme.fn.execPluginFunction(functionName, $this, mergedPluginDefaults);	
			}
		});
	},

	getRootMargin: function(plugin, pluginDefaults) {
		switch ( plugin ) {
			case 'themePluginCounter':
				return pluginDefaults.accY ? '0px 0px ' + pluginDefaults.accY + 'px 0px' : '0px 0px 200px 0px';
				break;

			case 'themePluginAnimate':
				return pluginDefaults.accY ? '0px 0px ' + pluginDefaults.accY + 'px 0px' : '0px 0px 200px 0px';
				break;
			
			case 'themePluginIcon':
				return pluginDefaults.accY ? '0px 0px ' + pluginDefaults.accY + 'px 0px' : '0px 0px 200px 0px';
				break;

			case 'themePluginRandomImages':
				return pluginDefaults.accY ? '0px 0px ' + pluginDefaults.accY + 'px 0px' : '0px 0px 200px 0px';
				break;

			default:
				return '0px 0px 200px 0px';
				break;
		}
	},

	mergeOptions: function(obj1, obj2){
		var obj3 = {};
	
		for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
		for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
		
		return obj3;
	},

	execOnceTroughEvent: function( $el, event, callback ) {
		var self = this,
			dataName = self.formatDataName( event );

		$($el).on(event, function(){
			if(!$(this).data(dataName) ) {
				
				// Exec Callback Function
				callback.call($(this));

				// Add data name 
				$(this).data( dataName, true );

				// Unbind event
				$(this).off( event );
			}
		});

		return this;
	},

	execOnceTroughWindowEvent: function( $el, event, callback ) {
		var self = this,
			dataName = self.formatDataName( event );

		$($el).on(event, function(){
			if(!$(this).data(dataName) ) {
				
				// Exec Callback Function
				callback();

				// Add data name 
				$(this).data( dataName, true );

				// Unbind event
				$(this).off( event );
			}
		});

		return this;
	},

	formatDataName: function( name ) {
		name = name.replace('.', '');
		return name;
	},

	isElementInView: function( $el ) {
		var rect = $el[0].getBoundingClientRect();

		return (
			rect.top <= ( window.innerHeight / 3 )
		);
	}

};

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
!function(){"use strict";if("object"==typeof window)if("IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype)"isIntersecting"in window.IntersectionObserverEntry.prototype||Object.defineProperty(window.IntersectionObserverEntry.prototype,"isIntersecting",{get:function(){return this.intersectionRatio>0}});else{var t=function(t){for(var e=window.document,o=i(e);o;)o=i(e=o.ownerDocument);return e}(),e=[],o=null,n=null;s.prototype.THROTTLE_TIMEOUT=100,s.prototype.POLL_INTERVAL=null,s.prototype.USE_MUTATION_OBSERVER=!0,s._setupCrossOriginUpdater=function(){return o||(o=function(t,o){n=t&&o?l(t,o):{top:0,bottom:0,left:0,right:0,width:0,height:0},e.forEach(function(t){t._checkForIntersections()})}),o},s._resetCrossOriginUpdater=function(){o=null,n=null},s.prototype.observe=function(t){if(!this._observationTargets.some(function(e){return e.element==t})){if(!t||1!=t.nodeType)throw new Error("target must be an Element");this._registerInstance(),this._observationTargets.push({element:t,entry:null}),this._monitorIntersections(t.ownerDocument),this._checkForIntersections()}},s.prototype.unobserve=function(t){this._observationTargets=this._observationTargets.filter(function(e){return e.element!=t}),this._unmonitorIntersections(t.ownerDocument),0==this._observationTargets.length&&this._unregisterInstance()},s.prototype.disconnect=function(){this._observationTargets=[],this._unmonitorAllIntersections(),this._unregisterInstance()},s.prototype.takeRecords=function(){var t=this._queuedEntries.slice();return this._queuedEntries=[],t},s.prototype._initThresholds=function(t){var e=t||[0];return Array.isArray(e)||(e=[e]),e.sort().filter(function(t,e,o){if("number"!=typeof t||isNaN(t)||t<0||t>1)throw new Error("threshold must be a number between 0 and 1 inclusively");return t!==o[e-1]})},s.prototype._parseRootMargin=function(t){var e=(t||"0px").split(/\s+/).map(function(t){var e=/^(-?\d*\.?\d+)(px|%)$/.exec(t);if(!e)throw new Error("rootMargin must be specified in pixels or percent");return{value:parseFloat(e[1]),unit:e[2]}});return e[1]=e[1]||e[0],e[2]=e[2]||e[0],e[3]=e[3]||e[1],e},s.prototype._monitorIntersections=function(e){var o=e.defaultView;if(o&&-1==this._monitoringDocuments.indexOf(e)){var n=this._checkForIntersections,r=null,s=null;this.POLL_INTERVAL?r=o.setInterval(n,this.POLL_INTERVAL):(h(o,"resize",n,!0),h(e,"scroll",n,!0),this.USE_MUTATION_OBSERVER&&"MutationObserver"in o&&(s=new o.MutationObserver(n)).observe(e,{attributes:!0,childList:!0,characterData:!0,subtree:!0})),this._monitoringDocuments.push(e),this._monitoringUnsubscribes.push(function(){var t=e.defaultView;t&&(r&&t.clearInterval(r),c(t,"resize",n,!0)),c(e,"scroll",n,!0),s&&s.disconnect()});var u=this.root&&(this.root.ownerDocument||this.root)||t;if(e!=u){var a=i(e);a&&this._monitorIntersections(a.ownerDocument)}}},s.prototype._unmonitorIntersections=function(e){var o=this._monitoringDocuments.indexOf(e);if(-1!=o){var n=this.root&&(this.root.ownerDocument||this.root)||t;if(!this._observationTargets.some(function(t){var o=t.element.ownerDocument;if(o==e)return!0;for(;o&&o!=n;){var r=i(o);if((o=r&&r.ownerDocument)==e)return!0}return!1})){var r=this._monitoringUnsubscribes[o];if(this._monitoringDocuments.splice(o,1),this._monitoringUnsubscribes.splice(o,1),r(),e!=n){var s=i(e);s&&this._unmonitorIntersections(s.ownerDocument)}}}},s.prototype._unmonitorAllIntersections=function(){var t=this._monitoringUnsubscribes.slice(0);this._monitoringDocuments.length=0,this._monitoringUnsubscribes.length=0;for(var e=0;e<t.length;e++)t[e]()},s.prototype._checkForIntersections=function(){if(this.root||!o||n){var t=this._rootIsInDom(),e=t?this._getRootRect():{top:0,bottom:0,left:0,right:0,width:0,height:0};this._observationTargets.forEach(function(n){var i=n.element,s=u(i),h=this._rootContainsTarget(i),c=n.entry,a=t&&h&&this._computeTargetAndRootIntersection(i,s,e),l=null;this._rootContainsTarget(i)?o&&!this.root||(l=e):l={top:0,bottom:0,left:0,right:0,width:0,height:0};var f=n.entry=new r({time:window.performance&&performance.now&&performance.now(),target:i,boundingClientRect:s,rootBounds:l,intersectionRect:a});c?t&&h?this._hasCrossedThreshold(c,f)&&this._queuedEntries.push(f):c&&c.isIntersecting&&this._queuedEntries.push(f):this._queuedEntries.push(f)},this),this._queuedEntries.length&&this._callback(this.takeRecords(),this)}},s.prototype._computeTargetAndRootIntersection=function(e,i,r){if("none"!=window.getComputedStyle(e).display){for(var s,h,c,a,f,d,g,m,v=i,_=p(e),b=!1;!b&&_;){var w=null,y=1==_.nodeType?window.getComputedStyle(_):{};if("none"==y.display)return null;if(_==this.root||9==_.nodeType)if(b=!0,_==this.root||_==t)o&&!this.root?!n||0==n.width&&0==n.height?(_=null,w=null,v=null):w=n:w=r;else{var I=p(_),E=I&&u(I),T=I&&this._computeTargetAndRootIntersection(I,E,r);E&&T?(_=I,w=l(E,T)):(_=null,v=null)}else{var R=_.ownerDocument;_!=R.body&&_!=R.documentElement&&"visible"!=y.overflow&&(w=u(_))}if(w&&(s=w,h=v,c=void 0,a=void 0,f=void 0,d=void 0,g=void 0,m=void 0,c=Math.max(s.top,h.top),a=Math.min(s.bottom,h.bottom),f=Math.max(s.left,h.left),d=Math.min(s.right,h.right),m=a-c,v=(g=d-f)>=0&&m>=0&&{top:c,bottom:a,left:f,right:d,width:g,height:m}||null),!v)break;_=_&&p(_)}return v}},s.prototype._getRootRect=function(){var e;if(this.root&&!d(this.root))e=u(this.root);else{var o=d(this.root)?this.root:t,n=o.documentElement,i=o.body;e={top:0,left:0,right:n.clientWidth||i.clientWidth,width:n.clientWidth||i.clientWidth,bottom:n.clientHeight||i.clientHeight,height:n.clientHeight||i.clientHeight}}return this._expandRectByRootMargin(e)},s.prototype._expandRectByRootMargin=function(t){var e=this._rootMarginValues.map(function(e,o){return"px"==e.unit?e.value:e.value*(o%2?t.width:t.height)/100}),o={top:t.top-e[0],right:t.right+e[1],bottom:t.bottom+e[2],left:t.left-e[3]};return o.width=o.right-o.left,o.height=o.bottom-o.top,o},s.prototype._hasCrossedThreshold=function(t,e){var o=t&&t.isIntersecting?t.intersectionRatio||0:-1,n=e.isIntersecting?e.intersectionRatio||0:-1;if(o!==n)for(var i=0;i<this.thresholds.length;i++){var r=this.thresholds[i];if(r==o||r==n||r<o!=r<n)return!0}},s.prototype._rootIsInDom=function(){return!this.root||f(t,this.root)},s.prototype._rootContainsTarget=function(e){var o=this.root&&(this.root.ownerDocument||this.root)||t;return f(o,e)&&(!this.root||o==e.ownerDocument)},s.prototype._registerInstance=function(){e.indexOf(this)<0&&e.push(this)},s.prototype._unregisterInstance=function(){var t=e.indexOf(this);-1!=t&&e.splice(t,1)},window.IntersectionObserver=s,window.IntersectionObserverEntry=r}function i(t){try{return t.defaultView&&t.defaultView.frameElement||null}catch(t){return null}}function r(t){this.time=t.time,this.target=t.target,this.rootBounds=a(t.rootBounds),this.boundingClientRect=a(t.boundingClientRect),this.intersectionRect=a(t.intersectionRect||{top:0,bottom:0,left:0,right:0,width:0,height:0}),this.isIntersecting=!!t.intersectionRect;var e=this.boundingClientRect,o=e.width*e.height,n=this.intersectionRect,i=n.width*n.height;this.intersectionRatio=o?Number((i/o).toFixed(4)):this.isIntersecting?1:0}function s(t,e){var o,n,i,r=e||{};if("function"!=typeof t)throw new Error("callback must be a function");if(r.root&&1!=r.root.nodeType&&9!=r.root.nodeType)throw new Error("root must be a Document or Element");this._checkForIntersections=(o=this._checkForIntersections.bind(this),n=this.THROTTLE_TIMEOUT,i=null,function(){i||(i=setTimeout(function(){o(),i=null},n))}),this._callback=t,this._observationTargets=[],this._queuedEntries=[],this._rootMarginValues=this._parseRootMargin(r.rootMargin),this.thresholds=this._initThresholds(r.threshold),this.root=r.root||null,this.rootMargin=this._rootMarginValues.map(function(t){return t.value+t.unit}).join(" "),this._monitoringDocuments=[],this._monitoringUnsubscribes=[]}function h(t,e,o,n){"function"==typeof t.addEventListener?t.addEventListener(e,o,n||!1):"function"==typeof t.attachEvent&&t.attachEvent("on"+e,o)}function c(t,e,o,n){"function"==typeof t.removeEventListener?t.removeEventListener(e,o,n||!1):"function"==typeof t.detatchEvent&&t.detatchEvent("on"+e,o)}function u(t){var e;try{e=t.getBoundingClientRect()}catch(t){}return e?(e.width&&e.height||(e={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.right-e.left,height:e.bottom-e.top}),e):{top:0,bottom:0,left:0,right:0,width:0,height:0}}function a(t){return!t||"x"in t?t:{top:t.top,y:t.top,bottom:t.bottom,left:t.left,x:t.left,right:t.right,width:t.width,height:t.height}}function l(t,e){var o=e.top-t.top,n=e.left-t.left;return{top:o,left:n,height:e.height,width:e.width,bottom:o+e.height,right:n+e.width}}function f(t,e){for(var o=e;o;){if(o==t)return!0;o=p(o)}return!1}function p(e){var o=e.parentNode;return 9==e.nodeType&&e!=t?i(e):(o&&o.assignedSlot&&(o=o.assignedSlot.parentNode),o&&11==o.nodeType&&o.host?o.host:o)}function d(t){return t&&9===t.nodeType}}();

/*
Plugin Name: 	BrowserSelector
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version:	8.0.0
*/

(function($) { $.extend({

	browserSelector: function() {

		// jQuery.browser.mobile (http://detectmobilebrowser.com/)
		(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

		// Touch
		var hasTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

		var u = navigator.userAgent,
			ua = u.toLowerCase(),
			is = function (t) {
				return ua.indexOf(t) > -1;
			},
			g = 'gecko',
			w = 'webkit',
			s = 'safari',
			o = 'opera',
			h = document.documentElement,
			b = [(!(/opera|webtv/i.test(ua)) && /msie\s(\d)/.test(ua)) ? ('ie ie' + parseFloat(navigator.appVersion.split("MSIE")[1])) : is('firefox/2') ? g + ' ff2' : is('firefox/3.5') ? g + ' ff3 ff3_5' : is('firefox/3') ? g + ' ff3' : is('gecko/') ? g : is('opera') ? o + (/version\/(\d+)/.test(ua) ? ' ' + o + RegExp.jQuery1 : (/opera(\s|\/)(\d+)/.test(ua) ? ' ' + o + RegExp.jQuery2 : '')) : is('konqueror') ? 'konqueror' : is('chrome') ? w + ' chrome' : is('iron') ? w + ' iron' : is('applewebkit/') ? w + ' ' + s + (/version\/(\d+)/.test(ua) ? ' ' + s + RegExp.jQuery1 : '') : is('mozilla/') ? g : '', is('j2me') ? 'mobile' : is('iphone') ? 'iphone' : is('ipod') ? 'ipod' : is('mac') ? 'mac' : is('darwin') ? 'mac' : is('webtv') ? 'webtv' : is('win') ? 'win' : is('freebsd') ? 'freebsd' : (is('x11') || is('linux')) ? 'linux' : '', 'js'];

		c = b.join(' ');

		if ($.browser.mobile) {
			c += ' mobile';
		}

		if (hasTouch) {
			c += ' touch';
		}

		h.className += ' ' + c;

		// Edge Detect
		var isEdge = /Edge/.test(navigator.userAgent);

		if(isEdge) {
			$('html').removeClass('chrome').addClass('edge');
		}

		// IE11 Detect
		var isIE11 = !(window.ActiveXObject) && "ActiveXObject" in window;

		if (isIE11) {
			$('html').removeClass('gecko').addClass('ie ie11');
			return;
		}

		// Dark and Boxed Compatibility
		if($('body').hasClass('dark')) {
			$('html').addClass('dark');
		}

		if($('body').hasClass('boxed')) {
			$('html').addClass('boxed');
		}

	}

});

$.browserSelector();

/*
Global Variable For Screen Size
*/
theme.globalWindowWidth = $(window).width();
var globalWindowWidth = $(window).width();
window.onresize = function() {
	theme.globalWindowWidth = $(window).width();
}

/*
Browser Workarounds
*/
if (/iPad|iPhone|iPod/.test(navigator.platform)) {

	// iPad/Iphone/iPod Hover Workaround
	$(document).ready(function($) {
		$('.thumb-info').attr('onclick', 'return true');
	});
}

/*
Tabs
*/
if( $('a[data-bs-toggle="tab"]').length ) {
	$('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
		var $tabPane = $($(e.target).attr('href'));

		// Carousel Refresh
		if($tabPane.length) {
			$tabPane.find('.owl-carousel').trigger('refresh.owl.carousel');
		}

		// Change Active Class
		$(this).parents('.nav-tabs').find('.active').removeClass('active');
		$(this).addClass('active').parent().addClass('active');
	});	

	if( window.location.hash ) {
		$(window).on('load', function(){
			if( window.location.hash !== '*' && $( window.location.hash ).get(0) ) {
				new bootstrap.Tab( $('a.nav-link[href="'+ window.location.hash +'"]:not([data-hash])')[0] ).show();
			}
		});
	}
}

/*
On Load Scroll
*/
if( !$('html').hasClass('disable-onload-scroll') && window.location.hash && !['#*'].includes( window.location.hash ) ) {

	window.scrollTo(0, 0);

	$(window).on('load', function() {
		setTimeout(function() {

			var target = window.location.hash,
				offset = ( $(window).width() < 768 ) ? 180 : 90;

			if (!$(target).length) {
				return;
			}

			if ( $("a[href$='" + window.location.hash + "']").is('[data-hash-offset]') ) {
				offset = parseInt( $("a[href$='" + window.location.hash + "']").first().attr('data-hash-offset') );
			} else if ( $("html").is('[data-hash-offset]') ) {
				offset = parseInt( $("html").attr('data-hash-offset') );
			}

			if (isNaN(offset)) {
				offset = 0;
			}

			$('body').addClass('scrolling');

			$('html, body').animate({
				scrollTop: $(target).offset().top - offset
			}, 600, 'easeOutQuad', function() {
				$('body').removeClass('scrolling');
			});

		}, 1);
	});
}

/*
* Text Rotator
*/
$.fn.extend({
	textRotator: function(options) {

		var defaults = {
			fadeSpeed: 500,
			pauseSpeed: 100,
			child: null
		};

		var options = $.extend(defaults, options);

		return this.each(function() {
			var o = options;
			var obj = $(this);
			var items = $(obj.children(), obj);
			items.each(function() {
				$(this).hide();
			})
			if (!o.child) {
				var next = $(obj).children(':first');
			} else {
				var next = o.child;
			}
			$(next).fadeIn(o.fadeSpeed, function() {
				$(next).delay(o.pauseSpeed).fadeOut(o.fadeSpeed, function() {
					var next = $(this).next();
					if (next.length == 0) {
						next = $(obj).children(':first');
					}
					$(obj).textRotator({
						child: next,
						fadeSpeed: o.fadeSpeed,
						pauseSpeed: o.pauseSpeed
					});
				})
			});
		});
	}
});

/*
* Notice Top bar
*/
var $noticeTopBar = {
	$wrapper: $('.notice-top-bar'),
	$closeBtn: $('.notice-top-bar-close'),
	$header: $('#header'),
	$body: $('.body'),
	init: function() {
		var self = this;

		if( !$.cookie('portoNoticeTopBarClose') ) {
			self
				.build()
				.events();
		} else {
			self.$wrapper.parent().prepend( '<!-- Notice Top Bar removed by cookie -->' );
			self.$wrapper.remove();
		}

		return this;
	},
	build: function(){
		var self = this;

		$(window).on('load', function(){
			setTimeout(function(){
				self.$body.css({
					'margin-top': self.$wrapper.outerHeight(),
					'transition': 'ease margin 300ms'
				});

				$('#noticeTopBarContent').textRotator({
					fadeSpeed: 500,
					pauseSpeed: 5000
				});

				if( ['absolute', 'fixed'].includes( self.$header.css('position') ) ) {
					self.$header.css({
						'top': self.$wrapper.outerHeight(),
						'transition': 'ease top 300ms'
					});
				}

				$(window).trigger('notice.top.bar.opened');

			}, 1000);
		});

		return this;
	},
	events: function() {
		var self = this;

		self.$closeBtn.on('click', function(e){
			e.preventDefault();

			self.$body.animate({
				'margin-top': 0,
			}, 300, function(){
				self.$wrapper.remove();
				self.saveCookie();
			});

			if( ['absolute', 'fixed'].includes( self.$header.css('position') ) ) {
				self.$header.animate({
					top: 0
				}, 300);
			}

			// When header has shrink effect
			if( self.$header.hasClass('header-effect-shrink') ) {
				self.$header.find('.header-body').animate({
					top: 0
				}, 300);
			}

			$(window).trigger('notice.top.bar.closed');
		});

		return this;
	},
	checkCookie: function(){
		var self = this;

		if( $.cookie('portoNoticeTopBarClose') ) {
			return true;
		} else {
			return false;
		}

		return this;
	},
	saveCookie: function() {
		var self = this;

		$.cookie('portoNoticeTopBarClose', true);

		return this;
	}
}

if( $('.notice-top-bar').length ) {
	$noticeTopBar.init();
}

/*
* Image Hotspots
*/
if( $('.image-hotspot').length ) {
	$('.image-hotspot')
		.append('<span class="ring"></span>')
		.append('<span class="circle"></span>');
}

/*
* Page Transition
*/
if( $('body[data-plugin-page-transition]').length ) {
	
	var link_click = false;

	$(document).on('click', 'a', function(e){
		link_click = $(this);
	});

	$(window).on("beforeunload", function(e) {
		if( typeof link_click === 'object' ) {
			var href = link_click.attr('href');

			if( href.indexOf('mailto:') != 0 && href.indexOf('tel:') != 0 && !link_click.data('rm-from-transition') ) {
				$('body').addClass('page-transition-active');
			}
		}
	});

	$(window).on("pageshow", function(e){
		if( e.persisted ) {
			if( $('html').hasClass('safari') ) {
				window.location.reload();
			}
			
	        $('body').removeClass('page-transition-active');
	    }
	});
}

/*
* Thumb Info Floating Caption
*/
if( $('.thumb-info-floating-caption').length ) {

	$('.thumb-info-floating-caption').on('mouseenter', function(){
		if( !$('.thumb-info-floating-caption-title').length ) {
			$('.body').append( '<div class="thumb-info-floating-caption-title">'+ $(this).data('title') +'</div>' );

			if( $(this).data('type') ) {
				$('.thumb-info-floating-caption-title')
					.append( '<div class="thumb-info-floating-caption-type">'+ $(this).data('type') +'</div>' )
					.css({
						'padding-bottom' : 22
					});
			}

			if( $(this).hasClass('thumb-info-floating-caption-clean') ) {
				$('.thumb-info-floating-caption-title').addClass('bg-transparent');
			}
		}
	}).on('mouseout', function(){
		$('.thumb-info-floating-caption-title').remove();
	});

	$(document).on('mousemove', function(e){
		$('.thumb-info-floating-caption-title').css({
			position: 'fixed',
			left: e.clientX - 20,
			top: e.clientY + 20
		});
	});

}

/*
* Toggle Text Click
*/
$('[data-toggle-text-click]').on('click', function () {
	$(this).text(function(i, text){
		return text === $(this).attr('data-toggle-text-click') ? $(this).attr('data-toggle-text-click-alt') : $(this).attr('data-toggle-text-click');
	});
});

/*
* Shape Divider Aspect Ratio
*/
if( $('.shape-divider').length ) {
	aspectRatioSVG();
	$(window).on('resize', function(){
		aspectRatioSVG();
	});
}

/*
* Shape Divider Animated
*/
if( $('.shape-divider-horizontal-animation').length ) {
	theme.fn.intObs('.shape-divider-horizontal-animation', function(){
		for( var i = 0; i <= 1; i++ ) {
			var svgClone = $(this).find('svg:nth-child(1)').clone();

			$(this).append( svgClone )
		}

		$(this).addClass('start');
	}, {});
}

/*
* Toggle Class
*/
$('[data-porto-toggle-class]').on('click', function (e) {
	e.preventDefault();

	$(this).toggleClass( $(this).data('porto-toggle-class') );
});

/*
* Dynamic Height
*/
var $window = $(window);
$window.on('resize dynamic.height.resize', function(){
	$('[data-dynamic-height]').each(function(){
		var $this = $(this),
			values = JSON.parse($this.data('dynamic-height').replace(/'/g,'"').replace(';',''))

		// XS
		if( $window.width() < 576 ) {
			$this.height( values[4] );
		}

		// SM
		if( $window.width() > 575 && $window.width() < 768 ) {
			$this.height( values[3] );
		}

		// MD
		if( $window.width() > 767 && $window.width() < 992 ) {
			$this.height( values[2] );
		}

		// LG
		if( $window.width() > 991 && $window.width() < 1200 ) {
			$this.height( values[1] );
		}

		// XS
		if( $window.width() > 1199 ) {
			$this.height( values[0] );
		}
	});
});

// Mobile First Load
if( $window.width() < 992 ) {
	$window.trigger('dynamic.height.resize');
}

/* Video - Trigger Play */
if( $('[data-trigger-play-video]').length ) {
	theme.fn.execOnceTroughEvent( '[data-trigger-play-video]', 'mouseover.trigger.play.video', function(){
		var $video = $( $(this).data('trigger-play-video') );

		$(this).on('click', function(e){
			e.preventDefault();

			if( $(this).data('trigger-play-video-remove') == 'yes' ) {
				$(this).animate({
					opacity: 0
				}, 300, function(){
					$video[0].play();

					$(this).remove();
				});
			} else {
				setTimeout(function(){
					$video[0].play();
				},300);
			}
		});
	});
}

/* Video - Custom Auto Play */
if( $('video[data-auto-play]').length ) {
	$(window).on('load', function(){
		$('video[data-auto-play]').each(function(){
			var $video = $(this);

			setTimeout(function(){
				if( $( '#' + $video.attr('id') ).length ) {
					if( $( '[data-trigger-play-video="#' + $video.attr('id') + '"]' ).data('trigger-play-video-remove') == 'yes' ) {
						$( '[data-trigger-play-video="#' + $video.attr('id') + '"]' ).animate({
							opacity: 0
						}, 300, function(){
							$video[0].play();

							$( '[data-trigger-play-video="#' + $video.attr('id') + '"]' ).remove();
						});
					} else {
						setTimeout(function(){
							$video[0].play();
						},300);
					}
				}
			}, 100);

		});
	});
}

/*
* Remove min height after the load of page
*/
if( $('[data-remove-min-height]').length ) {
	$(window).on('load', function(){
		$('[data-remove-min-height]').each(function(){
			$(this).css({
				'min-height': 0
			});
		});
	});
}

/*
* Style Switcher Open Loader Button
*/
if( $('.style-switcher-open-loader').length ) {

	$('.style-switcher-open-loader').on('click', function(e){
		e.preventDefault();

		var $this = $(this);

		// Add Spinner to icon
		$this.addClass('style-switcher-open-loader-loading');

		var	basePath = $(this).data('base-path'),
			skinSrc = $(this).data('skin-src');

		var script1 = document.createElement("script");
	  	script1.src = basePath + "master/style-switcher/style.switcher.localstorage.js";

	  	var script2 = document.createElement("script");
	  	script2.src = basePath + "master/style-switcher/style.switcher.js";
	  	script2.id = "styleSwitcherScript";
	  	script2.setAttribute('data-base-path', basePath);
	  	script2.setAttribute('data-skin-src', skinSrc);

	  	script2.onload = function() {
	  		setTimeout(function(){
	  			// Trigger a click to open the style switcher sidebar
		  		function checkIfReady() {
				    if( !$('.style-switcher-open').length ) {
				       window.setTimeout(checkIfReady, 100);
				    } else {
				      $('.style-switcher-open').trigger('click');
				    }
				}
				checkIfReady();

	  		}, 500);
	  	}

	  	document.body.appendChild(script1);
	  	document.body.appendChild(script2);	

	});

}

})(jQuery);

/*
* Scroll and Focus
*/
function scrollAndFocus($this, scrollTarget, focusTarget, scrollOffset, scrollAgain) {
	(function($) {

		$('body').addClass('scrolling');

		// if it's inside a header menu
		if( $($this).closest('#mainNav').length ) {
			$($this).parents('.collapse.show').collapse('hide');
		}

		$('html, body').animate({
			scrollTop: $(scrollTarget).offset().top - (scrollOffset ? scrollOffset : 0)
		}, 300, function() {
			$('body').removeClass('scrolling');

			setTimeout(function(){
				$(focusTarget).focus();
			}, 500);

			if( scrollAgain ) {
				$('html, body').animate({
					scrollTop: $(scrollTarget).offset().top - (scrollOffset ? scrollOffset : 0)
				});
			}
		});
	})(jQuery);
}

/*
* Shape Divider - SVG Aspect Ratio
*/
function aspectRatioSVG() {
	if( $(window).width() < 1950 ) {
		$('.shape-divider svg[preserveAspectRatio]').each(function(){
			if( !$(this).parent().hasClass('shape-divider-horizontal-animation') ) {
				$(this).attr('preserveAspectRatio', 'xMinYMin');
			} else {
				$(this).attr('preserveAspectRatio', 'none');
			}
		});
	} else {
		$('.shape-divider svg[preserveAspectRatio]').each(function(){
			$(this).attr('preserveAspectRatio', 'none');
		});
	}
}

/*
* Lazy Load Background Images (with lazySizes plugin)
*/
document.addEventListener('lazybeforeunveil', function(e){
    var bg = e.target.getAttribute('data-bg-src');
    if(bg) {
        e.target.style.backgroundImage = 'url(' + bg + ')';
    }
});

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
  var CountTo = function (element, options) {
    this.$element = $(element);
    this.options  = $.extend({}, CountTo.DEFAULTS, this.dataOptions(), options);
    this.init();
  };

  CountTo.DEFAULTS = {
    from: 0,               // the number the element should start at
    to: 0,                 // the number the element should end at
    speed: 1000,           // how long it should take to count between the target numbers
    refreshInterval: 100,  // how often the element should be updated
    decimals: 0,           // the number of decimal places to show
    formatter: formatter,  // handler for formatting the value before rendering
    onUpdate: null,        // callback method for every time the element is updated
    onComplete: null       // callback method for when the element finishes updating
  };

  CountTo.prototype.init = function () {
    this.value     = this.options.from;
    this.loops     = Math.ceil(this.options.speed / this.options.refreshInterval);
    this.loopCount = 0;
    this.increment = (this.options.to - this.options.from) / this.loops;
  };

  CountTo.prototype.dataOptions = function () {
    var options = {
      from:            this.$element.data('from'),
      to:              this.$element.data('to'),
      speed:           this.$element.data('speed'),
      refreshInterval: this.$element.data('refresh-interval'),
      decimals:        this.$element.data('decimals')
    };

    var keys = Object.keys(options);

    for (var i in keys) {
      var key = keys[i];

      if (typeof(options[key]) === 'undefined') {
        delete options[key];
      }
    }

    return options;
  };

  CountTo.prototype.update = function () {
    this.value += this.increment;
    this.loopCount++;

    this.render();

    if (typeof(this.options.onUpdate) == 'function') {
      this.options.onUpdate.call(this.$element, this.value);
    }

    if (this.loopCount >= this.loops) {
      clearInterval(this.interval);
      this.value = this.options.to;

      if (typeof(this.options.onComplete) == 'function') {
        this.options.onComplete.call(this.$element, this.value);
      }
    }
  };

  CountTo.prototype.render = function () {
    var formattedValue = this.options.formatter.call(this.$element, this.value, this.options);
    this.$element.text(formattedValue);
  };

  CountTo.prototype.restart = function () {
    this.stop();
    this.init();
    this.start();
  };

  CountTo.prototype.start = function () {
    this.stop();
    this.render();
    this.interval = setInterval(this.update.bind(this), this.options.refreshInterval);
  };

  CountTo.prototype.stop = function () {
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  CountTo.prototype.toggle = function () {
    if (this.interval) {
      this.stop();
    } else {
      this.start();
    }
  };

  function formatter(value, options) {
    return value.toFixed(options.decimals);
  }

  $.fn.countTo = function (option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('countTo');
      var init    = !data || typeof(option) === 'object';
      var options = typeof(option) === 'object' ? option : {};
      var method  = typeof(option) === 'string' ? option : 'start';

      if (init) {
        if (data) data.stop();
        $this.data('countTo', data = new CountTo(this, options));
      }

      data[method].call(data);
    });
  };
}));


(function($){

    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *       the user visible viewport of a web browser.
     *       only accounts for vertical position, not horizontal.
     */
    $.fn.visible = function(partial,hidden,direction,container){

        if (this.length < 1)
            return;

        var $t          = this.length > 1 ? this.eq(0) : this,
						isContained = typeof container !== 'undefined' && container !== null,
						$w				  = isContained ? $(container) : $(window),
						wPosition        = isContained ? $w.position() : 0,
            t           = $t.get(0),
            vpWidth     = $w.outerWidth(),
            vpHeight    = $w.outerHeight(),
            direction   = (direction) ? direction : 'both',
            clientSize  = hidden === true ? t.offsetWidth * t.offsetHeight : true;

        if (typeof t.getBoundingClientRect === 'function'){

            // Use this native browser method, if available.
            var rec = t.getBoundingClientRect(),
                tViz = isContained ?
												rec.top - wPosition.top >= 0 && rec.top < vpHeight + wPosition.top :
												rec.top >= 0 && rec.top < vpHeight,
                bViz = isContained ?
												rec.bottom - wPosition.top > 0 && rec.bottom <= vpHeight + wPosition.top :
												rec.bottom > 0 && rec.bottom <= vpHeight,
                lViz = isContained ?
												rec.left - wPosition.left >= 0 && rec.left < vpWidth + wPosition.left :
												rec.left >= 0 && rec.left <  vpWidth,
                rViz = isContained ?
												rec.right - wPosition.left > 0  && rec.right < vpWidth + wPosition.left  :
												rec.right > 0 && rec.right <= vpWidth,
                vVisible   = partial ? tViz || bViz : tViz && bViz,
                hVisible   = partial ? lViz || rViz : lViz && rViz;

            if(direction === 'both')
                return clientSize && vVisible && hVisible;
            else if(direction === 'vertical')
                return clientSize && vVisible;
            else if(direction === 'horizontal')
                return clientSize && hVisible;
        } else {

            var viewTop 				= isContained ? 0 : wPosition,
                viewBottom      = viewTop + vpHeight,
                viewLeft        = $w.scrollLeft(),
                viewRight       = viewLeft + vpWidth,
                position          = $t.position(),
                _top            = position.top,
                _bottom         = _top + $t.height(),
                _left           = position.left,
                _right          = _left + $t.width(),
                compareTop      = partial === true ? _bottom : _top,
                compareBottom   = partial === true ? _top : _bottom,
                compareLeft     = partial === true ? _right : _left,
                compareRight    = partial === true ? _left : _right;

            if(direction === 'both')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop)) && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
            else if(direction === 'vertical')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
            else if(direction === 'horizontal')
                return !!clientSize && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
        }
    };

})(jQuery);


/**
* jquery-match-height 0.7.2 by @liabru
* http://brm.io/jquery-match-height/
* License: MIT
*/

;(function(factory) { // eslint-disable-line no-extra-semi
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Global
        factory(jQuery);
    }
})(function($) {
    /*
    *  internal
    */

    var _previousResizeWidth = -1,
        _updateTimeout = -1;

    /*
    *  _parse
    *  value parse utility function
    */

    var _parse = function(value) {
        // parse value and convert NaN to 0
        return parseFloat(value) || 0;
    };

    /*
    *  _rows
    *  utility function returns array of jQuery selections representing each row
    *  (as displayed after float wrapping applied by browser)
    */

    var _rows = function(elements) {
        var tolerance = 1,
            $elements = $(elements),
            lastTop = null,
            rows = [];

        // group elements by their top position
        $elements.each(function(){
            var $that = $(this),
                top = $that.offset().top - _parse($that.css('margin-top')),
                lastRow = rows.length > 0 ? rows[rows.length - 1] : null;

            if (lastRow === null) {
                // first item on the row, so just push it
                rows.push($that);
            } else {
                // if the row top is the same, add to the row group
                if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
                    rows[rows.length - 1] = lastRow.add($that);
                } else {
                    // otherwise start a new row group
                    rows.push($that);
                }
            }

            // keep track of the last row top
            lastTop = top;
        });

        return rows;
    };

    /*
    *  _parseOptions
    *  handle plugin options
    */

    var _parseOptions = function(options) {
        var opts = {
            byRow: true,
            property: 'height',
            target: null,
            remove: false
        };

        if (typeof options === 'object') {
            return $.extend(opts, options);
        }

        if (typeof options === 'boolean') {
            opts.byRow = options;
        } else if (options === 'remove') {
            opts.remove = true;
        }

        return opts;
    };

    /*
    *  matchHeight
    *  plugin definition
    */

    var matchHeight = $.fn.matchHeight = function(options) {
        var opts = _parseOptions(options);

        // handle remove
        if (opts.remove) {
            var that = this;

            // remove fixed height from all selected elements
            this.css(opts.property, '');

            // remove selected elements from all groups
            $.each(matchHeight._groups, function(key, group) {
                group.elements = group.elements.not(that);
            });

            // TODO: cleanup empty groups

            return this;
        }

        if (this.length <= 1 && !opts.target) {
            return this;
        }

        // keep track of this group so we can re-apply later on load and resize events
        matchHeight._groups.push({
            elements: this,
            options: opts
        });

        // match each element's height to the tallest element in the selection
        matchHeight._apply(this, opts);

        return this;
    };

    /*
    *  plugin global options
    */

    matchHeight.version = '0.7.2';
    matchHeight._groups = [];
    matchHeight._throttle = 80;
    matchHeight._maintainScroll = false;
    matchHeight._beforeUpdate = null;
    matchHeight._afterUpdate = null;
    matchHeight._rows = _rows;
    matchHeight._parse = _parse;
    matchHeight._parseOptions = _parseOptions;

    /*
    *  matchHeight._apply
    *  apply matchHeight to given elements
    */

    matchHeight._apply = function(elements, options) {
        var opts = _parseOptions(options),
            $elements = $(elements),
            rows = [$elements];

        // take note of scroll position
        var scrollTop = $(window).scrollTop(),
            htmlHeight = $('html').outerHeight(true);

        // get hidden parents
        var $hiddenParents = $elements.parents().filter(':hidden');

        // cache the original inline style
        $hiddenParents.each(function() {
            var $that = $(this);
            $that.data('style-cache', $that.attr('style'));
        });

        // temporarily must force hidden parents visible
        $hiddenParents.css('display', 'block');

        // get rows if using byRow, otherwise assume one row
        if (opts.byRow && !opts.target) {

            // must first force an arbitrary equal height so floating elements break evenly
            $elements.each(function() {
                var $that = $(this),
                    display = $that.css('display');

                // temporarily force a usable display value
                if (display !== 'inline-block' && display !== 'flex' && display !== 'inline-flex') {
                    display = 'block';
                }

                // cache the original inline style
                $that.data('style-cache', $that.attr('style'));

                $that.css({
                    'display': display,
                    'padding-top': '0',
                    'padding-bottom': '0',
                    'margin-top': '0',
                    'margin-bottom': '0',
                    'border-top-width': '0',
                    'border-bottom-width': '0',
                    'height': '100px',
                    'overflow': 'hidden'
                });
            });

            // get the array of rows (based on element top position)
            rows = _rows($elements);

            // revert original inline styles
            $elements.each(function() {
                var $that = $(this);
                $that.attr('style', $that.data('style-cache') || '');
            });
        }

        $.each(rows, function(key, row) {
            var $row = $(row),
                targetHeight = 0;

            if (!opts.target) {
                // skip apply to rows with only one item
                if (opts.byRow && $row.length <= 1) {
                    $row.css(opts.property, '');
                    return;
                }

                // iterate the row and find the max height
                $row.each(function(){
                    var $that = $(this),
                        style = $that.attr('style'),
                        display = $that.css('display');

                    // temporarily force a usable display value
                    if (display !== 'inline-block' && display !== 'flex' && display !== 'inline-flex') {
                        display = 'block';
                    }

                    // ensure we get the correct actual height (and not a previously set height value)
                    var css = { 'display': display };
                    css[opts.property] = '';
                    $that.css(css);

                    // find the max height (including padding, but not margin)
                    if ($that.outerHeight(false) > targetHeight) {
                        targetHeight = $that.outerHeight(false);
                    }

                    // revert styles
                    if (style) {
                        $that.attr('style', style);
                    } else {
                        $that.css('display', '');
                    }
                });
            } else {
                // if target set, use the height of the target element
                targetHeight = opts.target.outerHeight(false);
            }

            // iterate the row and apply the height to all elements
            $row.each(function(){
                var $that = $(this),
                    verticalPadding = 0;

                // don't apply to a target
                if (opts.target && $that.is(opts.target)) {
                    return;
                }

                // handle padding and border correctly (required when not using border-box)
                if ($that.css('box-sizing') !== 'border-box') {
                    verticalPadding += _parse($that.css('border-top-width')) + _parse($that.css('border-bottom-width'));
                    verticalPadding += _parse($that.css('padding-top')) + _parse($that.css('padding-bottom'));
                }

                // set the height (accounting for padding and border)
                $that.css(opts.property, (targetHeight - verticalPadding) + 'px');
            });
        });

        // revert hidden parents
        $hiddenParents.each(function() {
            var $that = $(this);
            $that.attr('style', $that.data('style-cache') || null);
        });

        // restore scroll position if enabled
        if (matchHeight._maintainScroll) {
            $(window).scrollTop((scrollTop / htmlHeight) * $('html').outerHeight(true));
        }

        return this;
    };

    /*
    *  matchHeight._applyDataApi
    *  applies matchHeight to all elements with a data-match-height attribute
    */

    matchHeight._applyDataApi = function() {
        var groups = {};

        // generate groups by their groupId set by elements using data-match-height
        $('[data-match-height], [data-mh]').each(function() {
            var $this = $(this),
                groupId = $this.attr('data-mh') || $this.attr('data-match-height');

            if (groupId in groups) {
                groups[groupId] = groups[groupId].add($this);
            } else {
                groups[groupId] = $this;
            }
        });

        // apply matchHeight to each group
        $.each(groups, function() {
            this.matchHeight(true);
        });
    };

    /*
    *  matchHeight._update
    *  updates matchHeight on all current groups with their correct options
    */

    var _update = function(event) {
        if (matchHeight._beforeUpdate) {
            matchHeight._beforeUpdate(event, matchHeight._groups);
        }

        $.each(matchHeight._groups, function() {
            matchHeight._apply(this.elements, this.options);
        });

        if (matchHeight._afterUpdate) {
            matchHeight._afterUpdate(event, matchHeight._groups);
        }
    };

    matchHeight._update = function(throttle, event) {
        // prevent update if fired from a resize event
        // where the viewport width hasn't actually changed
        // fixes an event looping bug in IE8
        if (event && event.type === 'resize') {
            var windowWidth = $(window).width();
            if (windowWidth === _previousResizeWidth) {
                return;
            }
            _previousResizeWidth = windowWidth;
        }

        // throttle updates
        if (!throttle) {
            _update(event);
        } else if (_updateTimeout === -1) {
            _updateTimeout = setTimeout(function() {
                _update(event);
                _updateTimeout = -1;
            }, matchHeight._throttle);
        }
    };

    /*
    *  bind events
    */

    // apply on DOM ready event
    $(matchHeight._applyDataApi);

    // use on or bind where supported
    var on = $.fn.on ? 'on' : 'bind';

    // update heights on load and resize events
    $(window)[on]('load', function(event) {
        matchHeight._update(false, event);
    });

    // throttled update heights on resize events
    $(window)[on]('resize orientationchange', function(event) {
        matchHeight._update(true, event);
    });

});



/* jQuery-FontSpy.js v3.0.0
 * https://github.com/patrickmarabeas/jQuery-FontSpy.js
 *
 * Copyright 2013, Patrick Marabeas http://pulse-dev.com
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Date: 02/11/2015
 */

(function( w, $ ) {

  fontSpy = function  ( fontName, conf ) {
    var $html = $('html'),
        $body = $('body'),
        fontFamilyName = fontName;

        // Throw error if fontName is not a string or not is left as an empty string
        if (typeof fontFamilyName !== 'string' || fontFamilyName === '') {
          throw 'A valid fontName is required. fontName must be a string and must not be an empty string.';
        }

    var defaults = {
        font: fontFamilyName,
        fontClass: fontFamilyName.toLowerCase().replace( /\s/g, '' ),
        success: function() {},
        failure: function() {},
        testFont: 'Courier New',
        testString: 'QW@HhsXJ',
        glyphs: '',
        delay: 50,
        timeOut: 1000,
        callback: $.noop
    };

    var config = $.extend( defaults, conf );

    var $tester = $('<span>' + config.testString+config.glyphs + '</span>')
        .css('position', 'absolute')
        .css('top', '-9999px')
        .css('left', '-9999px')
        .css('visibility', 'hidden')
        .css('fontFamily', config.testFont)
        .css('fontSize', '250px');

    $body.append($tester);

    var fallbackFontWidth = $tester.outerWidth();

    $tester.css('fontFamily', config.font + ',' + config.testFont);

    var failure = function () {
      $html.addClass("no-"+config.fontClass);
      if( config && config.failure ) {
        config.failure();
      }
      config.callback(new Error('FontSpy timeout'));
      $tester.remove();
    };

    var success = function () {
      config.callback();
      $html.addClass(config.fontClass);
      if( config && config.success ) {
        config.success();
      }
      $tester.remove();
    };

    var retry = function () {
      setTimeout(checkFont, config.delay);
      config.timeOut = config.timeOut - config.delay;
    };

    var checkFont = function () {
      var loadedFontWidth = $tester.outerWidth();

      if (fallbackFontWidth !== loadedFontWidth){
        success();
      } else if(config.timeOut < 0) {
        failure();
      } else {
        retry();
      }
    }

    checkFont();
    }
  })( this, jQuery );


/*
Plugin Name: 	jQuery.pin
https://github.com/webpop/jquery.pin
Licensed under the terms of the MIT license.
*/
(function ($) {
	"use strict";
	$.fn.pin = function (options) {
		var scrollY = 0, elements = [], disabled = false, $window = $(window);

		options = options || {};

		var recalculateLimits = function () {
			for (var i=0, len=elements.length; i<len; i++) {
				var $this = elements[i];

				if (options.minWidth && $window.outerWidth() <= options.minWidth) {
					if ($this.parent().is(".pin-wrapper")) { $this.unwrap(); }
					$this.css({width: "", left: "", top: "", position: ""});
					if (options.activeClass) { $this.removeClass(options.activeClass); }
					disabled = true;
					continue;
				} else {
					disabled = false;
				}

				var $container = options.containerSelector ? $this.closest(options.containerSelector) : $(document.body);
				var offset = $this.offset();
				var containerOffset = $container.offset();
				var parentOffset = $this.parent().offset();

				if (!$this.parent().is(".pin-wrapper")) {
					$this.wrap("<div class='pin-wrapper'>");
				}

				var pad = $.extend({
				  top: 0,
				  bottom: 0
				}, options.padding || {});

				$this.data("pin", {
					pad: pad,
					from: (options.containerSelector ? containerOffset.top : offset.top) - pad.top,
					to: containerOffset.top + $container.height() - $this.outerHeight() - pad.bottom,
					end: containerOffset.top + $container.height(),
					parentTop: parentOffset.top
				});

				$this.css({width: $this.outerWidth()});
				$this.parent().css("height", $this.outerHeight());
			}
		};

		var onScroll = function () {
			if (disabled) { return; }

			scrollY = $window.scrollTop();

			var elmts = [];
			for (var i=0, len=elements.length; i<len; i++) {          
				var $this = $(elements[i]),
					data  = $this.data("pin");

				if (!data) { // Removed element
				  continue;
				}

				elmts.push($this); 
				  
				var from = data.from - data.pad.bottom,
					to = data.to - data.pad.top;
			  
				if (from + $this.outerHeight() > data.end) {
					$this.css('position', '');
					continue;
				}
			  
				if (from < scrollY && to > scrollY) {
					!($this.css("position") == "fixed") && $this.css({
						left: $this.offset().left,
						top: data.pad.top
					}).css("position", "fixed");
					if (options.activeClass) { $this.addClass(options.activeClass); }
				} else if (scrollY >= to) {
					$this.css({
						left: "",
						top: to - data.parentTop + data.pad.top
					}).css("position", "absolute");
					if (options.activeClass) { $this.addClass(options.activeClass); }
				} else {
					$this.css({position: "", top: "", left: ""});
					if (options.activeClass) { $this.removeClass(options.activeClass); }
				}
		  }
		  elements = elmts;
		};

		var update = function () { recalculateLimits(); onScroll(); };

		this.each(function () {
			var $this = $(this), 
				data  = $(this).data('pin') || {};

			if (data && data.update) { return; }
			elements.push($this);
			$("img", this).one("load", recalculateLimits);
			data.update = update;
			$(this).data('pin', data);
		});

		$window.scroll(onScroll);
		$window.resize(function () { recalculateLimits(); });
		recalculateLimits();

		$window.on('load', update);

		return this;
	  };
})(jQuery);


( function( $ ) {
	"use strict";
	
	// Define default settings
	var defaults = {
		action: function() {},
		runOnLoad: false,
		duration: 500
	};
	
	// Define global variables
	var settings = defaults,
		running = false,
		start;
	
	var methods = {};
	
	// Initial plugin configuration
	methods.init = function() {
		
		// Allocate passed arguments to settings based on type
		for( var i = 0; i <= arguments.length; i++ ) {
			var arg = arguments[i];
			switch ( typeof arg ) {
				case "function":
					settings.action = arg;
					break;
				case "boolean":
					settings.runOnLoad = arg;
					break;
				case "number":
					settings.duration = arg;
					break;
			}
		}
	
		// Process each matching jQuery object
		return this.each(function() {
		
			if( settings.runOnLoad ) { settings.action(); }
			
			$(this).resize( function() {
				
				methods.timedAction.call( this );
				
			} );
		
		} );
	};
	
	methods.timedAction = function( code, millisec ) {
		
		var doAction = function() {
			var remaining = settings.duration;
			
			if( running ) {
				var elapse = new Date() - start;
				remaining = settings.duration - elapse;
				if( remaining <= 0 ) {
					// Clear timeout and reset running variable
					clearTimeout(running);
					running = false;
					// Perform user defined function
					settings.action();
				
					return;
				}
			}
			wait( remaining );
		};
		
		var wait = function( time ) {
			running = setTimeout( doAction, time );
		};
		
		// Define new action starting time
		start = new Date();
		
		// Define runtime settings if function is run directly
		if( typeof millisec === 'number' ) { settings.duration = millisec; }
		if( typeof code === 'function' ) { settings.action = code; }
		
		// Only run timed loop if not already running
		if( !running ) { doAction(); }
		
	};

	
	$.fn.afterResize = function( method ) {
		
		if( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else {
			return methods.init.apply( this, arguments );
		}
		
	};
	
})(jQuery);


/*
Plugin Name: 	Animated Headlines
Written by: 	Codyhouse - (https://codyhouse.co/demo/animated-headlines/index.html)
*/
jQuery(document).ready(function($) {
	//set animation timing
	var animationDelay = 2500,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 150,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect 
		revealDuration = 600,
		revealAnimationDelay = 1500;

	initHeadline();

	function initHeadline() {
		//initialise headline animation
		animateHeadline('.word-rotator', '.word-rotator.letters');
	}

	function animateHeadline($selector) {
		var duration = animationDelay;

		theme.fn.intObs($selector, function(){
			
			// Single Letters - Insert <i> element for each letter of a changing word
			if( $(this).hasClass('letters') ) {
				$(this).find('b').each(function() {
					var word = $(this),
						letters = word.text().split(''),
						selected = word.hasClass('is-visible');
					for (i in letters) {
						if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
						letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
					}
					var newLetters = letters.join('');
					word.html(newLetters).css('opacity', 1);
				});				
			}

			// Animate the Headline
			var headline = $(this);

			if (headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function() {
					headline.find('.word-rotator-words').addClass('is-loading')
				}, barWaiting);
			} else if (headline.hasClass('clip')) {
				var spanWrapper = headline.find('.word-rotator-words'),
					newWidth = spanWrapper.outerWidth() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type')) {
				//assign to .word-rotator-words the width of its longest word
				var words = headline.find('.word-rotator-words b'),
					width = 0;
				words.each(function() {
					var wordWidth = $(this).outerWidth();
					if (wordWidth > width) width = wordWidth;
				});
				headline.find('.word-rotator-words').css('width', width);
			};

			// Trigger animation
			setTimeout(function() {
				hideWord(headline.find('.is-visible').eq(0))
			}, duration);
		}, {});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);

		if ($word.parents('.word-rotator').hasClass('type')) {
			var parentSpan = $word.parent('.word-rotator-words');
			parentSpan.addClass('selected').removeClass('waiting');
			setTimeout(function() {
				parentSpan.removeClass('selected');
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function() {
				showWord(nextWord, typeLettersDelay)
			}, typeAnimationDelay);

		} else if ($word.parents('.word-rotator').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		} else if ($word.parents('.word-rotator').hasClass('clip')) {
			$word.parents('.word-rotator-words').stop( true, true ).animate({
				width: '2px'
			}, revealDuration, function() {
				switchWord($word, nextWord);
				showWord(nextWord);
			});

		} else if ($word.parents('.word-rotator').hasClass('loading-bar')) {
			$word.parents('.word-rotator-words').removeClass('is-loading');
			switchWord($word, nextWord);
			setTimeout(function() {
				hideWord(nextWord)
			}, barAnimationDelay);
			setTimeout(function() {
				$word.parents('.word-rotator-words').addClass('is-loading')
			}, barWaiting);

		} else {
			switchWord($word, nextWord);
			setTimeout(function() {
				hideWord(nextWord)
			}, animationDelay);
		}
	}

	function showWord($word, $duration) {
		if ($word.parents('.word-rotator').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');
		} else if ($word.parents('.word-rotator').hasClass('clip')) {
			if (document.hasFocus()) {
				$word.parents('.word-rotator-words').stop( true, true ).animate({
					'width': $word.outerWidth() + 10
				}, revealDuration, function() {
					setTimeout(function() {
						hideWord($word)
					}, revealAnimationDelay);
				});
			} else {
				$word.parents('.word-rotator-words').stop( true, true ).animate({
					width: $word.outerWidth() + 10
				});
				setTimeout(function() {
					hideWord($word)
				}, revealAnimationDelay);
			}
		}
	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');

		if (!$letter.is(':last-child')) {
			setTimeout(function() {
				hideLetter($letter.next(), $word, $bool, $duration);
			}, $duration);
		} else if ($bool) {
			setTimeout(function() {
				hideWord(takeNext($word))
			}, animationDelay);
		}

		if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		}
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');

		if (!$letter.is(':last-child')) {
			setTimeout(function() {
				showLetter($letter.next(), $word, $bool, $duration);
			}, $duration);
		} else {
			if ($word.parents('.word-rotator').hasClass('type')) {
				setTimeout(function() {
					$word.parents('.word-rotator-words').addClass('waiting');
				}, 200);
			}
			if (!$bool) {
				setTimeout(function() {
					hideWord($word)
				}, animationDelay)
			}

			if (!$word.closest('.word-rotator').hasClass('type')) {
				$word.closest('.word-rotator-words').stop( true, true ).animate({
					width: $word.outerWidth()
				});
			}
		}
	}

	function takeNext($word) {
		return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	}

	function takePrev($word) {
		return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
	}

	function switchWord($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');

		if (!$newWord.closest('.word-rotator').hasClass('clip')) {
			var space = 0,
				delay = ($newWord.outerWidth() > $oldWord.outerWidth()) ? 0 : 600;

			if ($newWord.closest('.word-rotator').hasClass('loading-bar') || $newWord.closest('.word-rotator').hasClass('slide')) {
				space = 3;
				delay = 0;
			}

			setTimeout(function() {
				$newWord.closest('.word-rotator-words').stop( true, true ).animate({
					width: $newWord.outerWidth() + space
				});
			}, delay);
		}
	}
});

/*
jQuery Hover3d
=================================================
Version: 1.1.0
Author: Rian Ariona
Website: http://ariona.net
Docs: http://ariona.github.io/hover3d
Repo: http://github.com/ariona/hover3d
Issues: http://github.com/ariona/hover3d/issues
*/

(function($){
	
	$.fn.hover3d = function(options){
		
		var settings = $.extend({
			selector      : null,
			perspective   : 1000,
			sensitivity   : 20,
			invert        : false,
			shine         : false,
			hoverInClass  : "hover-in",
			hoverOutClass : "hover-out",
			hoverClass    : "hover-3d"
		}, options);
		
		return this.each(function(){
			
			var $this = $(this),
				$card = $this.find(settings.selector);
				currentX = 0;
				currentY = 0;


			if( settings.shine ){
				$card.append('<div class="shine"></div>');
			}
			var $shine = $(this).find(".shine");

			// Set perspective and transformStyle value
			// for element and 3d object
			$this.css({
				perspective: settings.perspective+"px",
				transformStyle: "preserve-3d"
			});
			
			$card.css({
				perspective: settings.perspective+"px",
				transformStyle: "preserve-3d",
			});

			$shine.css({
				position  : "absolute",
				top       : 0,
				left      : 0,
				bottom    : 0,
				right     : 0,
				transform : 'translateZ(1px)',
				"z-index" : 9
			});
			
			// Mouse Enter function, this will add hover-in
			// Class so when mouse over it will add transition
			// based on hover-in class
			function enter(event){
				$card.addClass(settings.hoverInClass+" "+settings.hoverClass);
				currentX = currentY = 0;
				setTimeout(function(){
					$card.removeClass(settings.hoverInClass);
				}, 1000);
			}
			
			// Mouse movement Parallax effect
			function move(event){
				
				var w      = $card.innerWidth(),
					h      = $card.innerHeight(),
					currentX = Math.round(event.pageX - $card.offset().left),
					currentY = Math.round(event.pageY - $card.offset().top),
					ax 	   = settings.invert ?  ( w / 2 - currentX)/settings.sensitivity : -( w / 2 - currentX)/settings.sensitivity,
					ay     = settings.invert ? -( h / 2 - currentY)/settings.sensitivity :  ( h / 2 - currentY)/settings.sensitivity,
					dx     = currentX - w / 2,
					dy     = currentY - h / 2,
					theta  = Math.atan2(dy, dx),
					angle  = theta * 180 / Math.PI - 90;

					
				if (angle < 0) {
					angle  = angle + 360;
				}
				

				$card.css({
					perspective    : settings.perspective+"px",
					transformStyle : "preserve-3d",
					transform      : "rotateY("+ax+"deg) rotateX("+ay+"deg)"
				});

				$shine.css('background', 'linear-gradient(' + angle + 'deg, rgba(255,255,255,' + event.offsetY / h * .5 + ') 0%,rgba(255,255,255,0) 80%)');
			}
			
			// Mouse leave function, will set the transform
			// property to 0, and add transition class
			// for exit animation
			function leave(){
				$card.addClass(settings.hoverOutClass+" "+settings.hoverClass);
				$card.css({
					perspective    : settings.perspective+"px",
					transformStyle : "preserve-3d",
					transform      : "rotateX(0) rotateY(0)"
				});
				setTimeout( function(){
					$card.removeClass(settings.hoverOutClass+" "+settings.hoverClass);
					currentX = currentY = 0;
				}, 1000 );
			}
			
			// Mouseenter event binding
			$this.on( "mouseenter", function(){
				return enter();
			});
			
			// Mousemove event binding
			$this.on( "mousemove", function(event){
				return move(event);
			});
			
			// Mouseleave event binding
			$this.on( "mouseleave", function(){
				return leave();
			});
			
		});
		
	};
	
}(jQuery));


/* Re-Init Plugin */
if( $('[data-reinit-plugin]').length ) {
	$('[data-reinit-plugin]').on('click', function(e) {
		e.preventDefault();

		var pluginInstance = $(this).data('reinit-plugin'),
			pluginFunction = $(this).data('reinit-plugin-function'),
			pluginElement  = $(this).data('reinit-plugin-element'),
			pluginOptions  = theme.fn.getOptions($(this).data('reinit-plugin-options'));

		$( pluginElement ).data( pluginInstance ).destroy();

		setTimeout(function(){
			theme.fn.execPluginFunction(pluginFunction, $( pluginElement ), pluginOptions);	
		}, 1000);

	});
}


// Before / After
(function(theme, $) {

	theme = theme || {};

	var instanceName = '__beforeafter';

	var PluginBeforeAfter = function($el, opts) {
		return this.initialize($el, opts);
	};

	PluginBeforeAfter.defaults = {
		
	};

	PluginBeforeAfter.prototype = {
		initialize: function($el, opts) {
			this.$el = $el;

			this
				.setData()
				.setOptions(opts)
				.build();

			return this;
		},

		setData: function() {
			this.$el.data(instanceName, this);

			return this;
		},

		setOptions: function(opts) {
			this.options = $.extend(true, {}, PluginBeforeAfter.defaults, opts, {
				wrapper: this.$el
			});

			return this;
		},

		build: function() {

			if (!($.isFunction($.fn.twentytwenty))) {
				return this;
			}

			var self = this;

			self.options.wrapper
				.twentytwenty(self.options);

			return this;

		}
	};

	// expose to scope
	$.extend(theme, {
		PluginBeforeAfter: PluginBeforeAfter
	});

	// jquery plugin
	$.fn.themePluginBeforeAfter = function(opts) {
		return this.map(function() {
			var $this = $(this);

			if ($this.data(instanceName)) {
				return $this.data(instanceName);
			} else {
				return new PluginBeforeAfter($this, opts);
			}

		});
	}

}).apply(this, [window.theme, jQuery]);

// Carousel Light
(function(theme, $) {

	theme = theme || {};

	var instanceName = '__carouselLight';

	var PluginCarouselLight = function($el, opts) {
		return this.initialize($el, opts);
	};

	PluginCarouselLight.defaults = {
		autoplay: true,
		autoplayTimeout: 7000,
		disableAutoPlayOnClick: true
	};

	PluginCarouselLight.prototype = {
		initialize: function($el, opts) {
			if ($el.data(instanceName)) {
				return this;
			}

			this.$el = $el;
			this.clickFlag = true;

			this
				.setData()
				.setOptions(opts)
				.build()
				.owlNav()
				.owlDots()
				.autoPlay()
				.events();

			return this;
		},

		setData: function() {
			this.$el.data(instanceName, this);

			return this;
		},

		setOptions: function(opts) {
			this.options = $.extend(true, {}, PluginCarouselLight.defaults, opts, {
				wrapper: this.$el
			});

			return this;
		},

		build: function() {
			var self = this;

			self.$el
				.css('opacity', 1)
				.find('.owl-item:first-child')
				.addClass('active');

			self.$el.trigger('initialized.owl.carousel');

			// Carousel Navigate By ID and item index
			self.carouselNavigate();

			return this;
		},

		changeSlide: function( $nextSlide ) {
			var self = this,
				$prevSlide = self.$el.find('.owl-item.active');

			self.$el.find('.owl-item.active').addClass('removing');

			$prevSlide
				.removeClass('fadeIn')
				.addClass( 'fadeOut animated' );

			setTimeout(function(){
				setTimeout(function(){
					$prevSlide.removeClass('active');
				}, 400);

				$nextSlide
					.addClass('active')
					.removeClass('fadeOut')
					.addClass( 'fadeIn animated' );

			}, 200);

			// Dots
			self.$el
				.find('.owl-dot')
				.removeClass('active')
				.eq( $nextSlide.index() )
				.addClass('active');

			self.$el.trigger({
				type: 'change.owl.carousel',
				nextSlideIndex: $nextSlide.index(),
				prevSlideIndex: $prevSlide.index()
			});

			setTimeout(function(){
				self.$el.trigger({
					type: 'changed.owl.carousel',
					nextSlideIndex: $nextSlide.index(),
					prevSlideIndex: $prevSlide.index()
				});
			}, 500);
		},

		owlNav: function() {
			var self = this,
				$owlNext = self.$el.find('.owl-next'),
				$owlPrev = self.$el.find('.owl-prev');

			$owlPrev.on('click', function(e){
				e.preventDefault();

				if( self.options.disableAutoPlayOnClick ) {
					window.clearInterval(self.autoPlayInterval);
				}

				if( self.avoidMultipleClicks() ) {
					return false;
				}

				self.owlPrev();
			});

			$owlNext.on('click', function(e){
				e.preventDefault();

				if( self.options.disableAutoPlayOnClick ) {
					window.clearInterval(self.autoPlayInterval);
				}

				if( self.avoidMultipleClicks() ) {
					return false;
				}

				self.owlNext();
			});

			return this;
		},

		owlDots: function(){
			var self = this,
				$owlDot = self.$el.find('.owl-dot');

			$owlDot.on('click', function(e){
				$this = $(this);

				e.preventDefault();

				if( self.options.disableAutoPlayOnClick ) {
					window.clearInterval(self.autoPlayInterval);
				}

				if( self.avoidMultipleClicks() ) {
					return false;
				}

				var dotIndex = $(this).index();

				// Do nothing if respective dot slide is active/showing
				if( $this.hasClass('active') ) {
					return false;
				}

				self.changeSlide( self.$el.find('.owl-item').eq( dotIndex ) );
			});

			return this;
		},

		owlPrev: function() {
			var self = this;

			if( self.$el.find('.owl-item.active').prev().get(0) ) {
				self.changeSlide( self.$el.find('.owl-item.active').prev() );
			} else {
				self.changeSlide( self.$el.find('.owl-item:last-child') );
			}
		},

		owlNext: function() {
			var self = this;

			if( self.$el.find('.owl-item.active').next().get(0) ) {
				self.changeSlide( self.$el.find('.owl-item.active').next() );
			} else {
				self.changeSlide( self.$el.find('.owl-item').eq(0) );
			}
		},

		avoidMultipleClicks: function() {
			var self = this;

			if( !self.clickFlag ) {
				return true;
			}

			if( self.clickFlag ) {
				self.clickFlag = false;
				setTimeout(function(){
					self.clickFlag = true; 
				}, 1000);
			}

			return false;
		},

		autoPlay: function(){
			var self = this,
				$el  = this.options.wrapper;

			if( self.options.autoplay ) {
				self.autoPlayInterval = window.setInterval(function() {
					self.owlNext();
				}, self.options.autoplayTimeout);
			}

			return this;
		},

		carouselNavigate: function() {
			var self      = this,
				$el       = this.options.wrapper,
				$carousel = $el;

			if( $('[data-carousel-navigate]').get(0) ) {
				$('[data-carousel-navigate-id="#'+ $el.attr('id') +'"]').each(function(){
					var $this = $(this),
						hasCarousel = $( $this.data('carousel-navigate-id') ).get(0),
						toIndex = $this.data('carousel-navigate-to');

					if( hasCarousel ) {

						$this.on('click', function(){

							if( self.options.disableAutoPlayOnClick ) {
								window.clearInterval(self.autoPlayInterval);
							}
							
							self.changeSlide( self.$el.find('.owl-item').eq( parseInt(toIndex) - 1 ) );
						});

					}
				});

				$el.on('change.owl.carousel', function(e){
					$('[data-carousel-navigate-id="#'+ $el.attr('id') +'"]').removeClass('active');
				});

				$el.on('changed.owl.carousel', function(e){
					$('[data-carousel-navigate-id="#'+ $el.attr('id') +'"][data-carousel-navigate-to="'+ ( e.nextSlideIndex + 1 ) +'"]').addClass('active');
				});
			}

			return this;
		},

		events: function() {
			var self = this;

			self.$el.on('change.owl.carousel', function(event) {

				// Hide elements inside carousel
			    self.$el.find('[data-appear-animation]:not(.background-image-wrapper), [data-plugin-animated-letters]').addClass('invisible');

			    // Animated Letters
			    self.$el.find('[data-plugin-animated-letters]').trigger('animated.letters.destroy');

			    // Remove "d-none" class before show the element. This is useful when using background images inside a carousel. Like ken burns effect
			    self.$el.find('.owl-item:not(.active) [data-carousel-onchange-show]').removeClass('d-none');

			});

			self.$el.on('changed.owl.carousel', function(event) {
				setTimeout(function(){

				    // Appear Animation
				    if( self.$el.find('.owl-item.cloned [data-appear-animation]').get(0) ) {
				    	self.$el.find('.owl-item.cloned [data-appear-animation]').each(function() {
							var $this = $(this),
								opts;

							var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
							if (pluginOptions)
								opts = pluginOptions;

							$this.themePluginAnimate(opts);
						});
				    }

					// Show elements inside carousel
				    self.$el.find('.owl-item.active [data-appear-animation]:not(.background-image-wrapper), [data-plugin-animated-letters]').removeClass('invisible');

				    // Animated Letters
				    self.$el.find('.owl-item.active [data-plugin-animated-letters]').trigger('animated.letters.initialize');

				    // Background Video
				    self.$el.find('.owl-item.cloned.active [data-plugin-video-background]').trigger('video.background.initialize');

				}, 500);
			    
			});
		}
	};

	// expose to scope
	$.extend(theme, {
		PluginCarouselLight: PluginCarouselLight
	});

	// jquery plugin
	$.fn.themePluginCarouselLight = function(opts) {
		return this.map(function() {
			var $this = $(this);

			if ($this.data(instanceName)) {
				return $this.data(instanceName);
			} else {
				return new PluginCarouselLight($this, opts);
			}

		});
	};

}).apply(this, [window.theme, jQuery]);

// Carousel
(function(theme, $) {

	theme = theme || {};

	var instanceName = '__carousel';

	var PluginCarousel = function($el, opts) {
		return this.initialize($el, opts);
	};

	PluginCarousel.defaults = {
		loop: true,
		responsive: {
			0: {
				items: 1
			},
			479: {
				items: 1
			},
			768: {
				items: 2
			},
			979: {
				items: 3
			},
			1199: {
				items: 4
			}
		},
		navText: [],
		refresh: false
	};

	PluginCarousel.prototype = {
		initialize: function($el, opts) {
			if ($el.data(instanceName)) {
				return this;
			}

			this.$el = $el;

			// If has data-icon inside, initialize only after icons get rendered
			// Prevent flicking issues
			if( $el.find('[data-icon]').get(0) ) {
				var self = this;

				$(window).on('icon.rendered', function(){
					if ($el.data(instanceName)) {
						return this;
					}

					setTimeout(function(){
						self
							.setData()
							.setOptions(opts)
							.build();
					}, 1000);
				});

				return this;
			}

			this
				.setData()
				.setOptions(opts)
				.build();

			return this;
		},

		setData: function() {
			this.$el.data(instanceName, this);

			return this;
		},

		setOptions: function(opts) {
			this.options = $.extend(true, {}, PluginCarousel.defaults, opts, {
				wrapper: this.$el
			});

			return this;
		},

		build: function() {
			if (!($.isFunction($.fn.owlCarousel))) {
				return this;
			}

			var self = this,
				$el = this.options.wrapper;

			// Add Theme Class
			$el.addClass('owl-theme');

			// Add Loading
			$el.addClass('owl-loading');

			// Force RTL according to HTML dir attribute
			if ($('html').attr('dir') == 'rtl') {
				this.options = $.extend(true, {}, this.options, {
					rtl: true
				});
			}

			if (this.options.items == 1) {
				this.options.responsive = {}
			}

			if (this.options.items > 4) {
				this.options = $.extend(true, {}, this.options, {
					responsive: {
						1199: {
							items: this.options.items
						}
					}
				});
			}

			// Auto Height Fixes
			if (this.options.autoHeight) {
				var itemsHeight = [];

				$el.find('.owl-item').each(function(){
					if( $(this).hasClass('active') ) {
						itemsHeight.push( $(this).height() );
					}
				});

				$(window).afterResize(function() {
					$el.find('.owl-stage-outer').height( Math.max.apply(null, itemsHeight) );
				});

				$(window).on('load', function() {
					$el.find('.owl-stage-outer').height( Math.max.apply(null, itemsHeight) );
				});
			}

			// Initialize OwlCarousel
			$el.owlCarousel(this.options).addClass('owl-carousel-init animated fadeIn');

			// Remove "animated fadeIn" class to prevent conflicts
			setTimeout(function(){
				$el.removeClass('animated fadeIn');
			}, 1000);

			// Owl Carousel Wrapper
			if( $el.closest('.owl-carousel-wrapper').get(0) ) {
				setTimeout(function(){
					$el.closest('.owl-carousel-wrapper').css({
						height: ''
					});
				}, 500);
			}

			// Owl Carousel Loader
			if( $el.prev().hasClass('owl-carousel-loader') ) {
				$el.prev().remove();
			}

			// Nav Offset
			self.navigationOffsets();

			// Nav Outside
			if( $el.hasClass('nav-outside') ) {
				$(window).on('owl.carousel.nav.outside', function(){
					if( $(window).width() < 992 ) {
						self.options.stagePadding = 40;
						$el.addClass('stage-margin');
					} else {
						self.options.stagePadding = 0;
						$el.removeClass('stage-margin');
					}

					$el.owlCarousel('destroy').owlCarousel( self.options );

					// Nav Offset
					self.navigationOffsets();
				});

				// Window Resize
				$(window).on('load', function(){
					$(window).afterResize(function(){
						$(window).trigger('owl.carousel.nav.outside');
					});
				});

				// First Load
				$(window).trigger('owl.carousel.nav.outside');
			}

			// Nav style 5 (SVG Arrows)
			if( $el.hasClass('nav-svg-arrows-1') ) {
				var svg_arrow = '' +
					'<svg version="1.1" viewBox="0 0 15.698 8.706" width="17" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
						'<polygon stroke="#212121" stroke-width="0.1" fill="#212121" points="11.354,0 10.646,0.706 13.786,3.853 0,3.853 0,4.853 13.786,4.853 10.646,8 11.354,8.706 15.698,4.353 "/>' +
					'</svg>';

				$el.find('.owl-next, .owl-prev').append( svg_arrow );
			}

			// Sync
			if( $el.attr('data-sync') ) {
				$el.on('change.owl.carousel', function(event) {
					if (event.namespace && event.property.name === 'position') {
					    var target = event.relatedTarget.relative(event.property.value, true);
					    $( $el.data('sync') ).owlCarousel('to', target, 300, true);				        
				  	}
				});
			}

			// Carousel Center Active Item
			if( $el.hasClass('carousel-center-active-item') ) {
				var itemsActive    = $el.find('.owl-item.active'),
					indexCenter    = Math.floor( ($el.find('.owl-item.active').length - 1) / 2 ),
					itemCenter     = itemsActive.eq(indexCenter);

				itemCenter.addClass('current');

				$el.on('change.owl.carousel', function(event) {
				  	$el.find('.owl-item').removeClass('current');
					
					setTimeout(function(){
					  	var itemsActive    = $el.find('.owl-item.active'),
					  		indexCenter    = Math.floor( ($el.find('.owl-item.active').length - 1) / 2 ),
					  		itemCenter     = itemsActive.eq(indexCenter);

					  	itemCenter.addClass('current');
					}, 100);
				});

				// Refresh
				$el.trigger('refresh.owl.carousel');

			}

			// AnimateIn / AnimateOut Fix
			if( self.options.animateIn || self.options.animateOut ) {
				$el.on('change.owl.carousel', function(event) {

					// Hide elements inside carousel
				    $el.find('[data-appear-animation], [data-plugin-animated-letters]').addClass('d-none');

				    // Animated Letters
				    $el.find('[data-plugin-animated-letters]').trigger('animated.letters.destroy');

				    // Remove "d-none" class before show the element. This is useful when using background images inside a carousel. Like ken burns effect
				    $el.find('.owl-item:not(.active) [data-carousel-onchange-show]').removeClass('d-none');

				});

				$el.on('changed.owl.carousel', function(event) {
					setTimeout(function(){

					    // Appear Animation
				    	$el.find('[data-appear-animation]').each(function() {
							var $this = $(this),
								opts;

							var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
							if (pluginOptions)
								opts = pluginOptions;

							$this.themePluginAnimate(opts);
						});

						// Show elements inside carousel
					    $el.find('.owl-item.active [data-appear-animation], [data-plugin-animated-letters]').removeClass('d-none');

					    // Animated Letters
					    $el.find('.owl-item.active [data-plugin-animated-letters]').trigger('animated.letters.initialize');

					    // Background Video
					    $el.find('.owl-item.cloned.active [data-plugin-video-background]').trigger('video.background.initialize');

					}, 10);
				    
				});
			}

			// data-icon inside carousel
			if( $el.find('[data-icon]').length ) {
				$el.on('change.owl.carousel drag.owl.carousel', function(){
					$el.find('.owl-item.cloned [data-icon]').each(function(){
						var $this = $(this),
							opts;

						var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
						if (pluginOptions)
							opts = pluginOptions;

						$this.themePluginIcon(opts);	
					});
				});
			}

			// Render Background Videos inside carousel. Just a trigger on window is sufficient to render
			if( $el.find('[data-plugin-video-background]').get(0) ) {
				$(window).resize();
			}

			// Remove Loading
			$el.removeClass('owl-loading');

			// Remove Height
			$el.css('height', 'auto');

			// Carousel Navigate By ID and item index
			self.carouselNavigate();

			// Refresh Carousel
			if( self.options.refresh ) {
				$el.owlCarousel('refresh');
			}

			return this;
		},

		navigationOffsets: function() {
			var self 			 = this,
				$el  			 = this.options.wrapper,
				navHasTransform  = $el.find('.owl-nav').css('transform') == 'none' ? false : true,
				dotsHasTransform = $el.find('.owl-dots').css('transform') == 'none' ? false : true;

			// ************* NAV *****************
			// Nav Offset - Horizontal
			if( self.options.navHorizontalOffset && !self.options.navVerticalOffset ) {
				if( !navHasTransform ) {
					$el.find('.owl-nav').css({
						transform: 'translate3d('+ self.options.navHorizontalOffset +', 0, 0)'
					});
				} else {
					$el.find('.owl-nav').css({
						left: self.options.navHorizontalOffset
					});
				}
			}

			// Nav Offset - Vertical
			if( self.options.navVerticalOffset && !self.options.navHorizontalOffset ) {
				if( !navHasTransform ) {
					$el.find('.owl-nav').css({
						transform: 'translate3d(0, '+ self.options.navVerticalOffset +', 0)'
					});
				} else {
					$el.find('.owl-nav').css({
						top: 'calc( 50% - '+ self.options.navVerticalOffset +' )'
					});
				}
			}

			// Nav Offset - Horizontal & Vertical
			if( self.options.navVerticalOffset && self.options.navHorizontalOffset ) {
				if( !navHasTransform ) {
					$el.find('.owl-nav').css({
						transform: 'translate3d('+ self.options.navHorizontalOffset +', '+ self.options.navVerticalOffset +', 0)'
					});
				} else {
					$el.find('.owl-nav').css({
						top: 'calc( 50% - '+ self.options.navVerticalOffset +' )',
						left: self.options.navHorizontalOffset
					});
				}
			}

			// ********** DOTS *********************
			// Dots Offset - Horizontal
			if( self.options.dotsHorizontalOffset && !self.options.dotsVerticalOffset ) {
				$el.find('.owl-dots').css({
					transform: 'translate3d('+ self.options.dotsHorizontalOffset +', 0, 0)'
				});
			}

			// Dots Offset - Vertical
			if( self.options.dotsVerticalOffset && !self.options.dotsHorizontalOffset ) {
				if( !dotsHasTransform ) {
					$el.find('.owl-dots').css({
						transform: 'translate3d(0, '+ self.options.dotsVerticalOffset +', 0)'
					});
				} else {
					$el.find('.owl-dots').css({
						top: 'calc( 50% - '+ self.options.dotsVerticalOffset +' )'
					});
				}
			}

			// Dots Offset - Horizontal & Vertical
			if( self.options.dotsVerticalOffset && self.options.dotsHorizontalOffset ) {
				$el.find('.owl-dots').css({
					transform: 'translate3d('+ self.options.dotsHorizontalOffset +', '+ self.options.dotsVerticalOffset +', 0)'
				});
			}

			return this;
		},

		carouselNavigate: function() {
			var self      = this,
				$el       = this.options.wrapper,
				$carousel = $el.data('owl.carousel');

			if( $('[data-carousel-navigate]').get(0) ) {
				$('[data-carousel-navigate-id="#'+ $el.attr('id') +'"]').each(function(){
					var $this = $(this),
						hasCarousel = $( $this.data('carousel-navigate-id') ).get(0),
						toIndex = $this.data('carousel-navigate-to');

					if( hasCarousel ) {

						$this.on('click', function(){
							$carousel.to( parseInt(toIndex) - 1 );
						});

					}
				});

				$el.on('change.owl.carousel', function(){
					$('[data-carousel-navigate-id="#'+ $el.attr('id') +'"]').removeClass('active');
				});

				$el.on('changed.owl.carousel', function(e){
					$('[data-carousel-navigate-id="#'+ $el.attr('id') +'"][data-carousel-navigate-to="'+ ( e.item.index + 1 ) +'"]').addClass('active');
				});
			}

			return this;
		}
	};

	// expose to scope
	$.extend(theme, {
		PluginCarousel: PluginCarousel
	});

	// jquery plugin
	$.fn.themePluginCarousel = function(opts) {
		return this.map(function() {
			var $this = $(this);

			if ($this.data(instanceName)) {
				return $this.data(instanceName);
			} else {
				return new PluginCarousel($this, opts);
			}

		});
	}

}).apply(this, [window.theme, jQuery]);

// Scroll to Top
(function(theme, $) {

	theme = theme || {};

	$.extend(theme, {

		PluginScrollToTop: {

			defaults: {
				wrapper: $('body'),
				offset: 150,
				buttonClass: 'scroll-to-top',
				iconClass: 'fas fa-chevron-up',
				delay: 1000,
				visibleMobile: false,
				label: false,
				easing: 'easeOutBack'
			},

			initialize: function(opts) {
				initialized = true;

				// Don't initialize if the page has Section Scroll
				if( $('body[data-plugin-section-scroll]').get(0) ) {
					return;
				}

				this
					.setOptions(opts)
					.build()
					.events();

				return this;
			},

			setOptions: function(opts) {
				this.options = $.extend(true, {}, this.defaults, opts);

				return this;
			},

			build: function() {
				var self = this,
					$el;

				// Base HTML Markup
				$el = $('<a />')
					.addClass(self.options.buttonClass)
					.attr({
						'href': '#',
					})
					.append(
						$('<i />')
						.addClass(self.options.iconClass)
				);

				// Visible Mobile
				if (!self.options.visibleMobile) {
					$el.addClass('hidden-mobile');
				}

				// Label
				if (self.options.label) {
					$el.append(
						$('<span />').html(self.options.label)
					);
				}

				this.options.wrapper.append($el);

				this.$el = $el;

				return this;
			},

			events: function() {
				var self = this,
					_isScrolling = false;

				// Click Element Action
				self.$el.on('click', function(e) {
					e.preventDefault();
					$('html').animate({
						scrollTop: 0
					}, self.options.delay, self.options.easing);
					return false;
				});

				// Show/Hide Button on Window Scroll event.
				$(window).scroll(function() {

					if (!_isScrolling) {

						_isScrolling = true;

						if ($(window).scrollTop() > self.options.offset) {

							self.$el.stop(true, true).addClass('visible');
							_isScrolling = false;

						} else {

							self.$el.stop(true, true).removeClass('visible');
							_isScrolling = false;

						}

					}

				});

				return this;
			}

		}

	});

}).apply(this, [window.theme, jQuery]);


// Sticky
(function(theme, $) {
	
	theme = theme || {};
	
	var instanceName = '__sticky';

	var PluginSticky = function($el, opts) {
		return this.initialize($el, opts);
	};

	PluginSticky.defaults = {
		minWidth: 991,
		activeClass: 'sticky-active'
	};

	PluginSticky.prototype = {
		initialize: function($el, opts) {
			if ( $el.data( instanceName ) ) {
				return this;
			}

			this.$el = $el;

			this
				.setData()
				.setOptions(opts)
				.build()
				.events();

			return this;
		},

		setData: function() {
			this.$el.data(instanceName, this);

			return this;
		},

		setOptions: function(opts) {
			this.options = $.extend(true, {}, PluginSticky.defaults, opts, {
				wrapper: this.$el
			});

			return this;
		},

		build: function() {
			if (!($.isFunction($.fn.pin))) {
				return this;
			}

			var self = this,
				$window = $(window);
			
			self.options.wrapper.pin(self.options);

			if( self.options.wrapper.hasClass('sticky-wrapper-transparent') ) {
				self.options.wrapper.parent().addClass('position-absolute w-100');
			}

			$window.afterResize(function() {
				self.options.wrapper.removeAttr('style').removeData('pin');
				self.options.wrapper.pin(self.options);
				$window.trigger('scroll');
			});

			// Change Logo Src
			if( self.options.wrapper.find('img').attr('data-change-src') ) {
				var $logo      = self.options.wrapper.find('img'),
					logoSrc    = $logo.attr('src'),
					logoNewSrc = $logo.attr('data-change-src');

				self.changeLogoSrc = function(activate) {
					if(activate) {
						$logo.attr('src', logoNewSrc);
					} else {
						$logo.attr('src', logoSrc);
					}
				}
			}
			
			return this;
		},

		events: function() {
			var self = this,
				$window = $(window),
				$logo = self.options.wrapper.find('img'),
				sticky_activate_flag = true,
				sticky_deactivate_flag = false,
				class_to_check = ( self.options.wrapper.hasClass('sticky-wrapper-effect-1') ) ? 'sticky-effect-active' : 'sticky-active';

			$window.on('scroll sticky.effect.active', function(){
				if( self.options.wrapper.hasClass( class_to_check ) ) {		
					if( sticky_activate_flag ) {			
						if( $logo.attr('data-change-src') ) {
							self.changeLogoSrc(true);
						}

						sticky_activate_flag = false;
						sticky_deactivate_flag = true;
					}
				} else {	
					if( sticky_deactivate_flag ) {				
						if( $logo.attr('data-change-src') ) {
							self.changeLogoSrc(false);
						}

						sticky_deactivate_flag = false;
						sticky_activate_flag = true;
					}
				}
			});

			var is_backing = false;
			if( self.options.stickyStartEffectAt ) {

				// First Load
				if( self.options.stickyStartEffectAt < $window.scrollTop() ) {
					self.options.wrapper.addClass('sticky-effect-active');

					$window.trigger('sticky.effect.active');
				}

				$window.on('scroll', function(){
					if( self.options.stickyStartEffectAt < $window.scrollTop() ) {	
						self.options.wrapper.addClass('sticky-effect-active');
						is_backing = true;

						$window.trigger('sticky.effect.active');
					} else {	
						if( is_backing ) {
							self.options.wrapper.find('.sticky-body').addClass('position-fixed');
							is_backing = false;
						}

						if( $window.scrollTop() == 0 ) {
							self.options.wrapper.find('.sticky-body').removeClass('position-fixed');
						}

						self.options.wrapper.removeClass('sticky-effect-active');
					}
				});
			}

			// Refresh Sticky Plugin if click in a data-toggle="collapse"
			if( $('[data-bs-toggle="collapse"]').get(0) ) {

				$('[data-bs-toggle="collapse"]').on('click', function(){
					setTimeout(function(){
						self.build();
						$(window).trigger('scroll');
					}, 1000);
				});

			}
		}
	};

	// expose to scope
	$.extend(theme, {
		PluginSticky: PluginSticky
	});

	// jquery plugin
	$.fn.themePluginSticky = function(opts) {
		return this.map(function() {
			var $this = $(this);

			if ($this.data(instanceName)) {
				return $this.data(instanceName);
			} else {
				return new PluginSticky($this, opts);
			}
			
		});
	}

}).apply(this, [ window.theme, jQuery ]);

// Toggle
(function(theme, $) {

	theme = theme || {};

	var instanceName = '__toggle';

	var PluginToggle = function($el, opts) {
		return this.initialize($el, opts);
	};

	PluginToggle.defaults = {
		duration: 350,
		isAccordion: false
	};

	PluginToggle.prototype = {
		initialize: function($el, opts) {
			if ($el.data(instanceName)) {
				return this;
			}

			this.$el = $el;

			this
				.setData()
				.setOptions(opts)
				.build();

			return this;
		},

		setData: function() {
			this.$el.data(instanceName, this);

			return this;
		},

		setOptions: function(opts) {
			this.options = $.extend(true, {}, PluginToggle.defaults, opts, {
				wrapper: this.$el
			});

			return this;
		},

		build: function() {
			var self = this,
				$wrapper = this.options.wrapper,
				$items = $wrapper.find('> .toggle'),
				$el = null;

			$items.each(function() {
				$el = $(this);

				if ($el.hasClass('active')) {
					$el.find('> p').addClass('preview-active');
					$el.find('> .toggle-content').slideDown(self.options.duration);
				}

				self.events($el);
			});

			if (self.options.isAccordion) {
				self.options.duration = self.options.duration / 2;
			}

			return this;
		},

		events: function($el) {
			var self = this,
				previewParCurrentHeight = 0,
				previewParAnimateHeight = 0,
				toggleContent = null;

			$el.find('> label, > .toggle-title').click(function(e) {

				var $this = $(this),
					parentSection = $this.parent(),
					parentWrapper = $this.parents('.toggle'),
					previewPar = null,
					closeElement = null;

				if (self.options.isAccordion && typeof(e.originalEvent) != 'undefined') {
					closeElement = parentWrapper.find('.toggle.active > label, .toggle.active > .toggle-title');

					if (closeElement[0] == $this[0]) {
						return;
					}
				}

				parentSection.toggleClass('active');

				// Preview Paragraph
				if (parentSection.find('> p').get(0)) {

					previewPar = parentSection.find('> p');
					previewParCurrentHeight = previewPar.css('height');
					previewPar.css('height', 'auto');
					previewParAnimateHeight = previewPar.css('height');
					previewPar.css('height', previewParCurrentHeight);

				}

				// Content
				toggleContent = parentSection.find('> .toggle-content');

				if (parentSection.hasClass('active')) {

					$(previewPar).animate({
						height: previewParAnimateHeight
					}, self.options.duration, function() {
						$(this).addClass('preview-active');
					});

					toggleContent.slideDown(self.options.duration, function() {
						if (closeElement) {
							closeElement.trigger('click');
						}
					});

				} else {

					$(previewPar).animate({
						height: 0
					}, self.options.duration, function() {
						$(this).removeClass('preview-active');
					});

					toggleContent.slideUp(self.options.duration);

				}

			});
		}
	};

	// expose to scope
	$.extend(theme, {
		PluginToggle: PluginToggle
	});

	// jquery plugin
	$.fn.themePluginToggle = function(opts) {
		return this.map(function() {
			var $this = $(this);

			if ($this.data(instanceName)) {
				return $this.data(instanceName);
			} else {
				return new PluginToggle($this, opts);
			}

		});
	}

}).apply(this, [window.theme, jQuery]);


// Validation
(function(theme, $) {

	theme = theme || {};

	$.extend(theme, {

		PluginValidation: {

			defaults: {
				formClass: 'needs-validation',
				validator: {
					highlight: function(element) {
						$(element)
							.addClass('is-invalid')
							.removeClass('is-valid')
							.parent()
							.removeClass('has-success')
							.addClass('has-danger');
					},
					success: function(label, element) {
						$(element)
							.removeClass('is-invalid')
							.addClass('is-valid')
							.parent()
							.removeClass('has-danger')
							.addClass('has-success')
							.find('label.error')
							.remove();
					},
					errorPlacement: function(error, element) {
						if (element.attr('type') == 'radio' || element.attr('type') == 'checkbox') {
							error.appendTo(element.parent().parent());
						} else {
							error.insertAfter(element);
						}
					}
				},
				validateCaptchaURL: 'php/contact-form-verify-captcha.php',
				refreshCaptchaURL: 'php/contact-form-refresh-captcha.php'
			},

			initialize: function(opts) {
				initialized = true;

				this
					.setOptions(opts)
					.build();

				return this;
			},

			setOptions: function(opts) {
				this.options = $.extend(true, {}, this.defaults, opts);

				return this;
			},

			build: function() {
				var self = this;

				if (!($.isFunction($.validator))) {
					return this;
				}

				self.addMethods();
				self.setMessageGroups();

				$.validator.setDefaults(self.options.validator);

				$('.' + self.options.formClass).validate();

				return this;
			},

			addMethods: function() {
				var self = this;

				$.validator.addMethod('captcha', function(value, element, params) {
					var captchaValid = false;

					$.ajax({
						url: self.options.validateCaptchaURL,
						type: 'POST',
						async: false,
						dataType: 'json',
						data: {
							captcha: $.trim(value)
						},
						success: function(data) {
							if (data.response == 'success') {
								captchaValid = true;
							}
						}
					});

					if (captchaValid) {
						return true;
					}

				}, '');

				// Refresh Captcha
				$('#refreshCaptcha').on('click', function(e) {
					e.preventDefault();
					$.get(self.options.refreshCaptchaURL, function(url) {
						$('#captcha-image').attr('src', url);
					});					
				});

			},

			setMessageGroups: function() {

				$('.checkbox-group[data-msg-required], .radio-group[data-msg-required]').each(function() {
					var message = $(this).data('msg-required');
					$(this).find('input').attr('data-msg-required', message);
				});

			}

		}

	});

}).apply(this, [window.theme, jQuery]);


// Nav
(function(theme, $) {

	theme = theme || {};

	var initialized = false;

	$.extend(theme, {

		Nav: {

			defaults: {
				wrapper: $('#mainNav'),
				scrollDelay: 600,
				scrollAnimation: 'easeOutQuad'
			},

			initialize: function($wrapper, opts) {
				if (initialized) {
					return this;
				}

				initialized = true;
				this.$wrapper = ($wrapper || this.defaults.wrapper);

				this
					.setOptions(opts)
					.build()
					.events();

				return this;
			},

			setOptions: function(opts) {
				this.options = $.extend(true, {}, this.defaults, opts, theme.fn.getOptions(this.$wrapper.data('plugin-options')));

				return this;
			},

			build: function() {
				var self = this,
					$html = $('html'),
					$header = $('#header'),
					$headerNavMain = $('#header .header-nav-main'),
					thumbInfoPreview;

				// Preview Thumbs
				if( self.$wrapper.find('a[data-thumb-preview]').length ) {
					self.$wrapper.find('a[data-thumb-preview]').each(function() {
						thumbInfoPreview = $('<span />').addClass('thumb-info thumb-info-preview')
												.append($('<span />').addClass('thumb-info-wrapper')
													.append($('<span />').addClass('thumb-info-image').css('background-image', 'url(' + $(this).data('thumb-preview') + ')')
											   )
										   );

						$(this).append(thumbInfoPreview);
					});
				}

				// Side Header / Side Header Hamburguer Sidebar (Reverse Dropdown)
				if($html.hasClass('side-header') || $html.hasClass('side-header-hamburguer-sidebar')) {
					
					// Side Header Right / Side Header Hamburguer Sidebar Right
					if($html.hasClass('side-header-right') || $html.hasClass('side-header-hamburguer-sidebar-right')) {
						if(!$html.hasClass('side-header-right-no-reverse')) {
							$header.find('.dropdown-submenu').addClass('dropdown-reverse');
						}
					}

				} else {
					
					// Reverse
					var checkReverseFlag = false;
					self.checkReverse = function() {
						if( !checkReverseFlag ) {
							self.$wrapper.find('.dropdown, .dropdown-submenu').removeClass('dropdown-reverse');

							self.$wrapper.find('.dropdown:not(.manual):not(.dropdown-mega), .dropdown-submenu:not(.manual)').each(function() {
								if(!$(this).find('.dropdown-menu').visible( false, true, 'horizontal' )  ) {
									$(this).addClass('dropdown-reverse');
								}
							});

							checkReverseFlag = true;
						}
					}

					$(window).on('resize', function(){
						checkReverseFlag = false;
					});

					$header.on('mouseover', function(){
						self.checkReverse();
					});

				}

				// Clone Items
				if($headerNavMain.hasClass('header-nav-main-clone-items')) {

			    	$headerNavMain.find('nav > ul > li > a').each(function(){
				    	var parent = $(this).parent(),
				    		clone  = $(this).clone(),
				    		clone2 = $(this).clone(),
				    		wrapper = $('<span class="wrapper-items-cloned"></span>');

				    	// Config Classes
				    	$(this).addClass('item-original');
				    	clone2.addClass('item-two');

				    	// Insert on DOM
				    	parent.prepend(wrapper);
				    	wrapper.append(clone).append(clone2);
				    });

				}

				// Floating
				if($('#header.header-floating-icons').length && $(window).width() > 991) {

					var menuFloatingAnim = {
						$menuFloating: $('#header.header-floating-icons .header-container > .header-row'),

						build: function() {
							var self = this;

							self.init();
						},
						init: function(){
							var self  = this,
								divisor = 0;

							$(window).scroll(function() {
							    var scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height()),
							    	st = $(this).scrollTop();

								divisor = $(document).height() / $(window).height();

							    self.$menuFloating.find('.header-column > .header-row').css({
							    	transform : 'translateY( calc('+ scrollPercent +'vh - '+ st / divisor +'px) )' 
							    });
							});
						}
					}

					menuFloatingAnim.build();

				}

				// Slide
				if($('.header-nav-links-vertical-slide').length) {
					var slideNavigation = {
						$mainNav: $('#mainNav'),
						$mainNavItem: $('#mainNav li'),

						build: function(){
							var self = this;

							self.menuNav();
						},
						menuNav: function(){
							var self = this;

							self.$mainNavItem.on('click', function(e){
								var currentMenuItem 	= $(this),
									currentMenu 		= $(this).parent(),
									nextMenu        	= $(this).find('ul').first(),
									prevMenu        	= $(this).closest('.next-menu'),
									isSubMenu       	= currentMenuItem.hasClass('dropdown') || currentMenuItem.hasClass('dropdown-submenu'),
									isBack          	= currentMenuItem.hasClass('back-button'),
									nextMenuHeightDiff  = ( ( nextMenu.find('> li').length * nextMenu.find('> li').outerHeight() ) - nextMenu.outerHeight() ),
									prevMenuHeightDiff  = ( ( prevMenu.find('> li').length * prevMenu.find('> li').outerHeight() ) - prevMenu.outerHeight() );

								if( isSubMenu ) {
									currentMenu.addClass('next-menu');
									nextMenu.addClass('visible');
									currentMenu.css({
										overflow: 'visible',
										'overflow-y': 'visible'
									});
									
									if( nextMenuHeightDiff > 0 ) {
										nextMenu.css({
											overflow: 'hidden',
											'overflow-y': 'scroll'
										});
									}

									for( i = 0; i < nextMenu.find('> li').length; i++ ) {
										if( nextMenu.outerHeight() < ($('.header-row-side-header').outerHeight() - 100) ) {
											nextMenu.css({
												height: nextMenu.outerHeight() + nextMenu.find('> li').outerHeight()
											});
										}
									}

									nextMenu.css({
										'padding-top': nextMenuHeightDiff + 'px'
									});
								}

								if( isBack ) {
									currentMenu.parent().parent().removeClass('next-menu');
									currentMenu.removeClass('visible');

									if( prevMenuHeightDiff > 0 ) {
										prevMenu.css({
											overflow: 'hidden',
											'overflow-y': 'scroll'
										});
									}
								}

								e.stopPropagation();
							});
						}
					}

					$(window).trigger('resize');
					
					if( $(window).width() > 991 ) {
						slideNavigation.build();
					}

					$(document).ready(function(){
						$(window).afterResize(function(){
							if( $(window).width() > 991 ) {
								slideNavigation.build();
							}
						});
					});
				}

				// Header Nav Main Mobile Dark
				if($('.header-nav-main-mobile-dark').length) {
					$('#header:not(.header-transparent-dark-bottom-border):not(.header-transparent-light-bottom-border)').addClass('header-no-border-bottom');
				}

				// Keyboard Navigation / Accessibility
				if( $(window).width() > 991 ) {
					var focusFlag = false;
					$header.find('.header-nav-main nav > ul > li > a').on('focus', function(){
						
						if( $(window).width() > 991 ) {
							if( !focusFlag ) {
								focusFlag = true;
								$(this).trigger('blur');
								
								self.focusMenuWithChildren();
							}
						}

					});
				}
				
				return this;
			},

			focusMenuWithChildren: function() {
				// Get all the link elements within the primary menu.
				var links, i, len,
					menu = document.querySelector( 'html:not(.side-header):not(.side-header-hamburguer-sidebar):not(.side-header-overlay-full-screen) .header-nav-main > nav' );

				if ( ! menu ) {
					return false;
				}

				links = menu.getElementsByTagName( 'a' );

				// Each time a menu link is focused or blurred, toggle focus.
				for ( i = 0, len = links.length; i < len; i++ ) {
					links[i].addEventListener( 'focus', toggleFocus, true );
					links[i].addEventListener( 'blur', toggleFocus, true );
				}

				//Sets or removes the .focus class on an element.
				function toggleFocus() {
					var self = this;

					// Move up through the ancestors of the current link until we hit .primary-menu.
					while ( -1 === self.className.indexOf( 'header-nav-main' ) ) {
						// On li elements toggle the class .focus.
						if ( 'li' === self.tagName.toLowerCase() ) {
							if ( -1 !== self.className.indexOf( 'accessibility-open' ) ) {
								self.className = self.className.replace( ' accessibility-open', '' );
							} else {
								self.className += ' accessibility-open';
							}
						}
						self = self.parentElement;
					}
				}
			},

			events: function() {
				var self    = this,
					$html   = $('html'),
					$header = $('#header'),
					$window = $(window),
					headerBodyHeight = $('.header-body').outerHeight();

				if( $header.hasClass('header') ) {
					$header = $('.header');
				}

				$header.find('a[href="#"]').on('click', function(e) {
					e.preventDefault();
				});

				// Mobile Arrows
				if( $html.hasClass('side-header-hamburguer-sidebar') ) {
					$header.find('.dropdown-toggle, .dropdown-submenu > a')
						.append('<i class="fas fa-chevron-down fa-chevron-right"></i>');
				} else {
					$header.find('.dropdown-toggle, .dropdown-submenu > a')
						.append('<i class="fas fa-chevron-down"></i>');
				}
				
				$header.find('.dropdown-toggle[href="#"], .dropdown-submenu a[href="#"], .dropdown-toggle[href!="#"] .fa-chevron-down, .dropdown-submenu a[href!="#"] .fa-chevron-down').on('click', function(e) {
					e.preventDefault();
					if ($window.width() < 992) {
						$(this).closest('li').toggleClass('open');

						// Adjust Header Body Height
						var height = ( $header.hasClass('header-effect-shrink') && $html.hasClass('sticky-header-active') ) ? theme.StickyHeader.options.stickyHeaderContainerHeight : headerBodyHeight;
						$('.header-body').animate({
					 		height: ($('.header-nav-main nav').outerHeight(true) + height) + 10
					 	}, 0);
					}
				});

				$header.find('li a.active').addClass('current-page-active');

				// Add Open Class
				$header.find('.header-nav-click-to-open .dropdown-toggle[href="#"], .header-nav-click-to-open .dropdown-submenu a[href="#"], .header-nav-click-to-open .dropdown-toggle > i').on('click', function(e) {
					if( !$('html').hasClass('side-header-hamburguer-sidebar') && $window.width() > 991 ) {
						e.preventDefault();
						e.stopPropagation();
					}

					if ($window.width() > 991) {
						e.preventDefault();
						e.stopPropagation();

						$header.find('li a.active').removeClass('active');

						if( $(this).prop('tagName') == 'I' ) {
							$(this).parent().addClass('active');
						} else {
							$(this).addClass('active');
						}

						if (!$(this).closest('li').hasClass('open')) {

							var $li = $(this).closest('li'),
								isSub = false;

							if( $(this).prop('tagName') == 'I' ) {
								$('#header .dropdown.open').removeClass('open');
								$('#header .dropdown-menu .dropdown-submenu.open').removeClass('open');
							}

							if ( $(this).parent().hasClass('dropdown-submenu') ) {
								isSub = true;
							}

							$(this).closest('.dropdown-menu').find('.dropdown-submenu.open').removeClass('open');
							$(this).parent('.dropdown').parent().find('.dropdown.open').removeClass('open');

							if (!isSub) {
								$(this).parent().find('.dropdown-submenu.open').removeClass('open');
							}

							$li.addClass('open');

							$(document).off('click.nav-click-to-open').on('click.nav-click-to-open', function (e) {
								if (!$li.is(e.target) && $li.has(e.target).length === 0) {
									$li.removeClass('open');
									$li.parents('.open').removeClass('open');
									$header.find('li a.active').removeClass('active');
									$header.find('li a.current-page-active').addClass('active');
								}
							});

						} else {
							$(this).closest('li').removeClass('open');
							$header.find('li a.active').removeClass('active');
							$header.find('li a.current-page-active').addClass('active');
						}

						$window.trigger({
							type: 'resize',
							from: 'header-nav-click-to-open'
						});
					}
				});

				// Collapse Nav
				$header.find('[data-collapse-nav]').on('click', function(e) {
					$(this).parents('.collapse').removeClass('show');
				});

				// Top Features
				$header.find('.header-nav-features-toggle').on('click', function(e) {
					e.preventDefault();

					var $toggleParent = $(this).parent();

					if (!$(this).siblings('.header-nav-features-dropdown').hasClass('show')) {

						var $dropdown = $(this).siblings('.header-nav-features-dropdown');

						$('.header-nav-features-dropdown.show').removeClass('show');

						$dropdown.addClass('show');

						$(document).off('click.header-nav-features-toggle').on('click.header-nav-features-toggle', function (e) {
							if (!$toggleParent.is(e.target) && $toggleParent.has(e.target).length === 0) {
								$('.header-nav-features-dropdown.show').removeClass('show');
							}
						});

						if ($(this).attr('data-focus')) {
							$('#' + $(this).attr('data-focus')).focus();
						}

					} else {
						$(this).siblings('.header-nav-features-dropdown').removeClass('show');
					}
				});

				// Hamburguer Menu
				var $hamburguerMenuBtn = $('.hamburguer-btn:not(.side-panel-toggle)'),
					$hamburguerSideHeader = $('#header.side-header, #header.side-header-overlay-full-screen');
				
				$hamburguerMenuBtn.on('click', function(){
					if($(this).attr('data-set-active') != 'false') {
						$(this).toggleClass('active');
					}
					$hamburguerSideHeader.toggleClass('side-header-hide');
					$html.toggleClass('side-header-hide');

					$window.trigger('resize');
				});

				$('.hamburguer-close:not(.side-panel-toggle)').on('click', function(){
					$('.hamburguer-btn:not(.hamburguer-btn-side-header-mobile-show)').trigger('click');
				});				
				
				// Set Header Body Height when open mobile menu
				$('.header-nav-main nav').on('show.bs.collapse', function () {
				 	$(this).removeClass('closed');

				 	// Add Mobile Menu Opened Class
				 	$('html').addClass('mobile-menu-opened');

			 		$('.header-body').animate({
				 		height: ($('.header-body').outerHeight() + $('.header-nav-main nav').outerHeight(true)) + 10
				 	});

				 	// Header Below Slider / Header Bottom Slider - Scroll to menu position
				 	if( $('#header').is('.header-bottom-slider, .header-below-slider') && !$('html').hasClass('sticky-header-active') ) {
				 		self.scrollToTarget( $('#header'), 0 );
				 	}
				});

				// Set Header Body Height when collapse mobile menu
				$('.header-nav-main nav').on('hide.bs.collapse', function () {
				 	$(this).addClass('closed');

				 	// Remove Mobile Menu Opened Class
				 	$('html').removeClass('mobile-menu-opened');

			 		$('.header-body').animate({
				 		height: ($('.header-body').outerHeight() - $('.header-nav-main nav').outerHeight(true))
				 	}, function(){
				 		$(this).height('auto');
				 	});
				});

				// Header Effect Shrink - Adjust header body height on mobile
				$window.on('stickyHeader.activate', function(){
					if( $window.width() < 992 && $header.hasClass('header-effect-shrink') ) {
						if( $('.header-btn-collapse-nav').attr('aria-expanded') == 'true' ) {
							$('.header-body').animate({
						 		height: ( $('.header-nav-main nav').outerHeight(true) + theme.StickyHeader.options.stickyHeaderContainerHeight ) + ( ($('.header-nav-bar').length) ? $('.header-nav-bar').outerHeight() : 0 ) 
						 	});
						}
					}
				});

				$window.on('stickyHeader.deactivate', function(){
					if( $window.width() < 992 && $header.hasClass('header-effect-shrink') ) {
						if( $('.header-btn-collapse-nav').attr('aria-expanded') == 'true' ) {
							$('.header-body').animate({
						 		height: headerBodyHeight + $('.header-nav-main nav').outerHeight(true) + 10
						 	});
						}
					}
				});

				// Remove Open Class on Resize		
				$window.on('resize.removeOpen', function(e) {
					if( e.from == 'header-nav-click-to-open' ) {
						return;
					}
					
					setTimeout(function() {
						if( $window.width() > 991 ) {
							$header.find('.dropdown.open').removeClass('open');
						}
					}, 100);
				});

				// Side Header - Change value of initial header body height
				$(document).ready(function(){
					if( $window.width() > 991 ) {
						var flag = false;
						
						$window.on('resize', function(e) {
							if( e.from == 'header-nav-click-to-open' ) {
								return;
							}

							$header.find('.dropdown.open').removeClass('open');

							if( $window.width() < 992 && flag == false ) {
								headerBodyHeight = $('.header-body').outerHeight();
								flag = true;

								setTimeout(function(){
									flag = false;
								}, 500);
							}
						});
					}
				});

				// Side Header - Set header height on mobile
				if( $html.hasClass('side-header') ) {
					if( $window.width() < 992 ) {
						$header.css({
							height: $('.header-body .header-container').outerHeight() + (parseInt( $('.header-body').css('border-top-width') ) + parseInt( $('.header-body').css('border-bottom-width') ))
						});
					}

					$(document).ready(function(){
						$window.afterResize(function(){
							if( $window.width() < 992 ) {
								$header.css({
									height: $('.header-body .header-container').outerHeight() + (parseInt( $('.header-body').css('border-top-width') ) + parseInt( $('.header-body').css('border-bottom-width') ))
								});
							} else {
								$header.css({
									height: ''
								});
							}
						});
					});
				}

				// Anchors Position
				if( $('[data-hash]').length ) {
					$('[data-hash]').on('mouseover', function(){
						var $this = $(this);

						if( !$this.data('__dataHashBinded') ) {
							var target = $this.attr('href'),
								offset = ($this.is("[data-hash-offset]") ? $this.data('hash-offset') : 0),
								delay  = ($this.is("[data-hash-delay]") ? $this.data('hash-delay') : 0),
								force  = ($this.is("[data-hash-force]") ? true : false),
								windowWidth = $(window).width();

							// Hash Offset SM
							if ($this.is("[data-hash-offset-sm]") && windowWidth > 576) {
								offset = $this.data('hash-offset-sm');
							}
							
							// Hash Offset MD
							if ($this.is("[data-hash-offset-md]") && windowWidth > 768) {
								offset = $this.data('hash-offset-md');
							}
							
							// Hash Offset LG
							if ($this.is("[data-hash-offset-lg]") && windowWidth > 992) {
								offset = $this.data('hash-offset-lg');
							}
							
							// Hash Offset XL
							if ($this.is("[data-hash-offset-xl]") && windowWidth > 1200) {
								offset = $this.data('hash-offset-xl');
							}
							
							// Hash Offset XXL
							if ($this.is("[data-hash-offset-xxl]") && windowWidth > 1400) {
								offset = $this.data('hash-offset-xxl');
							}

							if( !$(target).length ) {
								target = target.split('#');
								target = '#'+target[1];
							}

							if( target.indexOf('#') != -1 && $(target).length) {
								$this.on('click', function(e) {
									e.preventDefault();

									if( !$(e.target).is('i') || force ) {

										setTimeout(function(){

											// Close Collapse if open
											$this.parents('.collapse.show').collapse('hide');

											// Close Side Header
											$hamburguerSideHeader.addClass('side-header-hide');
											$html.addClass('side-header-hide');
											
											$window.trigger('resize');

											self.scrollToTarget(target, offset);

											// Data Hash Trigger Click
											if( $this.data('hash-trigger-click') ) {

												var $clickTarget = $( $this.data('hash-trigger-click') ),
													clickDelay = $this.data('hash-trigger-click-delay') ? $this.data('hash-trigger-click-delay') : 0;

												if( $clickTarget.length ) {

													setTimeout(function(){
														// If is a "Tabs" plugin link
														if( $clickTarget.closest('.nav-tabs').length ) {
															new bootstrap.Tab( $clickTarget[0] ).show();
														} else {
															$clickTarget.trigger('click');
														}
														
													}, clickDelay);
												}

											}

										}, delay);
										
									}

									return;
								});
							}

							$(this).data('__dataHashBinded', true);
						}
					});
				}

				// Floating
				if($('#header.header-floating-icons').length) {

					$('#header.header-floating-icons [data-hash]').off().each(function() {

						var target = $(this).attr('href'),
							offset = ($(this).is("[data-hash-offset]") ? $(this).data('hash-offset') : 0);

						if($(target).length) {
							$(this).on('click', function(e) {
								e.preventDefault();

									$('html, body').animate({
										scrollTop: $(target).offset().top - offset
									}, 600, 'easeOutQuad', function() {

									});

								return;
							});
						}

					});

				}

				// Side Panel Toggle
				if( $('.side-panel-toggle').length ) {
					var init_html_class = $('html').attr('class');

					$('.side-panel-toggle').on('click', function(e){
						var extra_class = $(this).data('extra-class'),
							delay       = ( extra_class ) ? 100 : 0,
							isActive    = $(this).data('is-active') ? $(this).data('is-active') : false;

						e.preventDefault();

						if( isActive ) {
							$('html').removeClass('side-panel-open');
							$(this).data('is-active', false);
							return false;
						}

						if( extra_class ) {
							$('.side-panel-wrapper').css('transition','none');
							$('html')
								.removeClass()
								.addClass( init_html_class )
								.addClass( extra_class );
						}
						setTimeout(function(){
							$('.side-panel-wrapper').css('transition','');
							$('html').toggleClass('side-panel-open');
						}, delay);

						$(this).data('is-active', true);						
					});

					$(document).on('click', function(e){
						if( !$(e.target).closest('.side-panel-wrapper').length && !$(e.target).hasClass('side-panel-toggle') ) {
							$('.hamburguer-btn.side-panel-toggle:not(.side-panel-close)').removeClass('active');
							$('html').removeClass('side-panel-open');
						}
					});
				}

				return this;
			},

			scrollToTarget: function(target, offset) {
				var self = this,
					targetPosition = $(target).offset().top;

				$('body').addClass('scrolling');

				$('html, body').animate({
					scrollTop: $(target).offset().top - offset
				}, self.options.scrollDelay, self.options.scrollAnimation, function() {
					$('body').removeClass('scrolling');

					// If by some reason the scroll finishes in a wrong position, this code will run the scrollToTarget() again until get the correct position
					// We need do it just one time to prevent infinite recursive loop at scrollToTarget() function
					if( $(target).offset().top !=  targetPosition) {
						self.scrollToTarget( target, offset );
					}
				});

				return this;

			}

		}

	});

}).apply(this, [window.theme, jQuery]);



// Sticky Header
(function(theme, $) {

	theme = theme || {};

	var initialized = false;

	$.extend(theme, {

		StickyHeader: {

			defaults: {
				wrapper: $('#header'),
				headerBody: $('#header .header-body'),
				stickyEnabled: true,
				stickyEnableOnBoxed: true,
				stickyEnableOnMobile: false,
				stickyStartAt: 0,
				stickyStartAtElement: false,
				stickySetTop: 0,
				stickyEffect: '',
				stickyHeaderContainerHeight: false,
				stickyChangeLogo: false,
				stickyChangeLogoWrapper: true,
				stickyForce: false,
				stickyScrollUp: false,
				stickyScrollValue: 0
			},

			initialize: function($wrapper, opts) {
				if (initialized) {
					return this;
				}				

				initialized = true;
				this.$wrapper = ($wrapper || this.defaults.wrapper);

				if( this.$wrapper.hasClass('header') ) {
					this.$wrapper = $('.header[data-plugin-options]');
				}

				this
					.setOptions(opts)
					.build()
					.events();

				return this;
			},

			setOptions: function(opts) {
				this.options = $.extend(true, {}, this.defaults, opts, theme.fn.getOptions(this.$wrapper.data('plugin-options')));
				return this;
			},

			build: function() {
				if( $(window).width() < 992 && this.options.stickyEnableOnMobile == false ) {
					$('html').addClass('sticky-header-mobile-disabled');
					return this;
				}

				if (!this.options.stickyEnableOnBoxed && $('html').hasClass('boxed') || $('html').hasClass('side-header-hamburguer-sidebar') && !this.options.stickyForce || !this.options.stickyEnabled) {
					return this;
				}

				var self = this;

				if( self.options.wrapper.hasClass('header') ) {
					self.options.wrapper = $('.header');
					self.options.headerBody = $('.header .header-body');
				}
				
				var	$html = $('html'),
					$window = $(window),
					sideHeader = $html.hasClass('side-header'),
					initialHeaderTopHeight = self.options.wrapper.find('.header-top').outerHeight(),
					initialHeaderContainerHeight = self.options.wrapper.find('.header-container').outerHeight(),
					minHeight;

				// HTML Classes
				$html.addClass('sticky-header-enabled');

				if (parseInt(self.options.stickySetTop) < 0) {
					$html.addClass('sticky-header-negative');
				}

				if (self.options.stickyScrollUp) {
					$html.addClass('sticky-header-scroll-direction');
				}				

				// Notice Top Bar First Load
				if( $('.notice-top-bar').get(0) ) {
					if (parseInt(self.options.stickySetTop) == 1 || self.options.stickyEffect == 'shrink') {
						$('.body').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
						    setTimeout(function(){
								if( !$html.hasClass('sticky-header-active') ) {
								    self.options.headerBody.animate({
								    	top: $('.notice-top-bar').outerHeight()
								    }, 300, function(){
								    	if( $html.hasClass('sticky-header-active') ) {
								    		self.options.headerBody.css('top', 0);
								    	}
								    });
								}
						    }, 0);
						});
					}					
				}

				// Set Start At
				if(self.options.stickyStartAtElement) {

					var $stickyStartAtElement = $(self.options.stickyStartAtElement);

					$(window).on('scroll resize sticky.header.resize', function() {
						self.options.stickyStartAt = $stickyStartAtElement.offset().top;
					});

					$(window).trigger('sticky.header.resize');
				}

				// Define Min Height value
				if( self.options.wrapper.find('.header-top').get(0) ) {
					minHeight = ( initialHeaderTopHeight + initialHeaderContainerHeight );
				} else {
					minHeight = initialHeaderContainerHeight;
				}

				// Set Wrapper Min-Height
				if( !sideHeader ) {
					if( !$('.header-logo-sticky-change').get(0) ) {
						self.options.wrapper.css('height', self.options.headerBody.outerHeight());
					} else {
						$window.on('stickyChangeLogo.loaded', function(){
							self.options.wrapper.css('height', self.options.headerBody.outerHeight());
						});
					}

					if( self.options.stickyEffect == 'shrink' ) {
						
						// Prevent wrong visualization of header when reload on middle of page
						$(document).ready(function(){
							if( $window.scrollTop() >= self.options.stickyStartAt ) {
								self.options.wrapper.find('.header-container').on('transitionend webkitTransitionEnd oTransitionEnd', function(){
									self.options.headerBody.css('position', 'fixed');
								});
							} else {
								if( !$html.hasClass('boxed') ) {
									self.options.headerBody.css('position', 'fixed');
								}
							}
						});

						self.options.wrapper.find('.header-container').css('height', initialHeaderContainerHeight);
						self.options.wrapper.find('.header-top').css('height', initialHeaderTopHeight);
					}
				}

				// Sticky Header Container Height
				if( self.options.stickyHeaderContainerHeight ) {
					self.options.wrapper.find('.header-container').css('height', self.options.wrapper.find('.header-container').outerHeight());
				}

				// Boxed
				if($html.hasClass('boxed') && self.options.stickyEffect == 'shrink') {
					self.boxedLayout();
				}

				// Check Sticky Header / Flags prevent multiple runs at same time
				var activate_flag   	 = true,
					deactivate_flag 	 = false,
					initialStickyStartAt = self.options.stickyStartAt;

				self.checkStickyHeader = function() {

					// Notice Top Bar
					var $noticeTopBar = $('.notice-top-bar');
					if ( $noticeTopBar.get(0) ) {
						self.options.stickyStartAt = ( $noticeTopBar.data('sticky-start-at') ) ? $noticeTopBar.data('sticky-start-at') : $('.notice-top-bar').outerHeight();
					} else {
						if( $html.hasClass('boxed') ) {
							self.options.stickyStartAt = initialStickyStartAt + 25;
						} else {
							self.options.stickyStartAt = initialStickyStartAt;
						}
					}

					if( $window.width() > 991 && $html.hasClass('side-header') ) {
						$html.removeClass('sticky-header-active');
						activate_flag = true;
						return;
					}

					if ($window.scrollTop() >= parseInt(self.options.stickyStartAt)) {
						if( activate_flag ) {
							self.activateStickyHeader();
							activate_flag = false;
							deactivate_flag = true;
						}
					} else {
						if( deactivate_flag ) {
							self.deactivateStickyHeader();
							deactivate_flag = false;
							activate_flag = true;
						}
					}

					// Scroll Up
					if (self.options.stickyScrollUp) {
						
					    // Get the new Value
					    self.options.stickyScrollNewValue = window.pageYOffset;

					    //Subtract the two and conclude
					    if(self.options.stickyScrollValue - self.options.stickyScrollNewValue < 0){
					        $html.removeClass('sticky-header-scroll-up').addClass('sticky-header-scroll-down');
					    } else if(self.options.stickyScrollValue - self.options.stickyScrollNewValue > 0){
					        $html.removeClass('sticky-header-scroll-down').addClass('sticky-header-scroll-up');
					    }

					    // Update the old value
					    self.options.stickyScrollValue = self.options.stickyScrollNewValue;

					}
				};
				
				// Activate Sticky Header
				self.activateStickyHeader = function() {
					if ($window.width() < 992) {
						if (self.options.stickyEnableOnMobile == false) {
							self.deactivateStickyHeader();
							self.options.headerBody.css({
								position: 'relative'
							});
							return false;
						}
					} else {
						if (sideHeader) {
							self.deactivateStickyHeader();
							return;
						}
					}

					$html.addClass('sticky-header-active');

					// Sticky Effect - Reveal
					if( self.options.stickyEffect == 'reveal' ) {

						self.options.headerBody.css('top','-' + self.options.stickyStartAt + 'px');

						self.options.headerBody.animate({
							top: self.options.stickySetTop
						}, 400, function() {});

					}

					// Sticky Effect - Shrink
					if( self.options.stickyEffect == 'shrink' ) {

						// If Header Top
						if( self.options.wrapper.find('.header-top').get(0) ) {
							self.options.wrapper.find('.header-top').css({
								height: 0,
								'min-height': 0,
								overflow: 'hidden'
							});
						}

						// Header Container
						if( self.options.stickyHeaderContainerHeight ) {
							self.options.wrapper.find('.header-container').css({
								height: self.options.stickyHeaderContainerHeight,
								'min-height': 0
							});
						} else {
							self.options.wrapper.find('.header-container').css({
								height: (initialHeaderContainerHeight / 3) * 2, // two third of container height
								'min-height': 0
							});

							var y = initialHeaderContainerHeight - ((initialHeaderContainerHeight / 3) * 2);
							$('.main').css({
								transform: 'translate3d(0, -'+ y +'px, 0)',
								transition: 'ease transform 300ms'
							}).addClass('has-sticky-header-transform');

							if($html.hasClass('boxed')) {
								self.options.headerBody.css('position','fixed');
							}
						}

					}

					self.options.headerBody.css('top', self.options.stickySetTop);

					if (self.options.stickyChangeLogo) {
						self.changeLogo(true);
					}

					// Set Elements Style
					if( $('[data-sticky-header-style]').length ) {
						$('[data-sticky-header-style]').each(function() {
							var $el = $(this),
								css = theme.fn.getOptions($el.data('sticky-header-style-active')),
								opts = theme.fn.getOptions($el.data('sticky-header-style'));

							if( $window.width() > opts.minResolution ) {
								$el.css(css);
							}
						});
					}

					$.event.trigger({
						type: 'stickyHeader.activate'
					});
				};

				// Deactivate Sticky Header
				self.deactivateStickyHeader = function() {
					$html.removeClass('sticky-header-active');

					if ( $(window).width() < 992 && self.options.stickyEnableOnMobile == false) {
						return false;
					}

					// Sticky Effect - Shrink
					if( self.options.stickyEffect == 'shrink' ) {

						// Boxed Layout
						if( $html.hasClass('boxed') ) {

							// Set Header Body Position Absolute
							self.options.headerBody.css('position','absolute');

							if( $window.scrollTop() > $('.body').offset().top ) {
								// Set Header Body Position Fixed
								self.options.headerBody.css('position','fixed');								
							}

						} else {
							// Set Header Body Position Fixed
							self.options.headerBody.css('position','fixed');
						}

						// If Header Top
						if( self.options.wrapper.find('.header-top').get(0) ) {
							self.options.wrapper.find('.header-top').css({
								height: initialHeaderTopHeight,
								overflow: 'visible'
							});

							// Fix [data-icon] issue when first load is on middle of the page
							if( self.options.wrapper.find('.header-top [data-icon]').length ) {
								theme.fn.intObsInit( '.header-top [data-icon]:not(.svg-inline--fa)', 'themePluginIcon' );
							}
						}

						// Header Container
						self.options.wrapper.find('.header-container').css({
							height: initialHeaderContainerHeight
						});

					}

					self.options.headerBody.css('top', 0);

					if (self.options.stickyChangeLogo) {
						self.changeLogo(false);
					}

					// Set Elements Style
					if( $('[data-sticky-header-style]').length ) {
						$('[data-sticky-header-style]').each(function() {
							var $el = $(this),
								css = theme.fn.getOptions($el.data('sticky-header-style-deactive')),
								opts = theme.fn.getOptions($el.data('sticky-header-style'));

							if( $window.width() > opts.minResolution ) {
								$el.css(css);
							}
						});
					}

					$.event.trigger({
						type: 'stickyHeader.deactivate'
					});
				};

				// Always Sticky
				if (parseInt(self.options.stickyStartAt) <= 0) {
					self.activateStickyHeader();
				}

				// Set Logo
				if (self.options.stickyChangeLogo) {

					var $logoWrapper = self.options.wrapper.find('.header-logo'),
						$logo = $logoWrapper.find('img'),
						logoWidth = $logo.attr('width'),
						logoHeight = $logo.attr('height'),
						logoSmallTop = parseInt($logo.attr('data-sticky-top') ? $logo.attr('data-sticky-top') : 0),
						logoSmallWidth = parseInt($logo.attr('data-sticky-width') ? $logo.attr('data-sticky-width') : 'auto'),
						logoSmallHeight = parseInt($logo.attr('data-sticky-height') ? $logo.attr('data-sticky-height') : 'auto');

					if (self.options.stickyChangeLogoWrapper) {
						$logoWrapper.css({
							'width': $logo.outerWidth(true),
							'height': $logo.outerHeight(true)
						});
					}

					self.changeLogo = function(activate) {
						if(activate) {
							
							$logo.css({
								'top': logoSmallTop,
								'width': logoSmallWidth,
								'height': logoSmallHeight
							});

						} else {
							
							$logo.css({
								'top': 0,
								'width': logoWidth,
								'height': logoHeight
							});

						}
					}

					$.event.trigger({
						type: 'stickyChangeLogo.loaded'
					});

				}

				// Side Header
				var headerBodyHeight,
					flag = false;

				self.checkSideHeader = function() {
					if($window.width() < 992 && flag == false) {
						headerBodyHeight = self.options.headerBody.height();
						flag = true;
					}

					if(self.options.stickyStartAt == 0 && sideHeader) {
						self.options.wrapper.css('min-height', 0);
					}

					if(self.options.stickyStartAt > 0 && sideHeader && $window.width() < 992) {
						self.options.wrapper.css('min-height', headerBodyHeight);
					}
				}

				return this;
			},

			events: function() {
				var self = this;

				if( $(window).width() < 992 && this.options.stickyEnableOnMobile == false ) {
					return this;
				}

				if (!this.options.stickyEnableOnBoxed && $('body').hasClass('boxed') || $('html').hasClass('side-header-hamburguer-sidebar') && !this.options.stickyForce || !this.options.stickyEnabled) {
					return this;
				}

				if (!self.options.alwaysStickyEnabled) {
					$(window).on('scroll resize', function() {
						if ( $(window).width() < 992 && self.options.stickyEnableOnMobile == false) {
							self.options.headerBody.css({
								position: ''
							});

							if( self.options.stickyEffect == 'shrink' ) {
								self.options.wrapper.find('.header-top').css({
									height: ''
								});
							}

							self.deactivateStickyHeader();
						} else {
							self.checkStickyHeader();
						}
					});
				} else {
					self.activateStickyHeader();
				}

				$(window).on('load resize', function(){
					self.checkSideHeader();
				});

				$(window).on('layout.boxed', function(){
					self.boxedLayout();
				});

				return this;
			},

			boxedLayout: function(){
				var self = this,
					$window = $(window);

				if($('html').hasClass('boxed') && self.options.stickyEffect == 'shrink') {
					if( (parseInt(self.options.stickyStartAt) == 0) && $window.width() > 991) {
						self.options.stickyStartAt = 30;
					}

					// Set Header Body Position Absolute
					self.options.headerBody.css({
						position: 'absolute',
						top: 0
					});

					// Set position absolute because top margin from boxed layout
					$window.on('scroll', function(){
						if( $window.scrollTop() > $('.body').offset().top ) {
							self.options.headerBody.css({
								'position' : 'fixed',
								'top' : 0
							});								
						} else {
							self.options.headerBody.css({
								'position' : 'absolute',
								'top' : 0
							});
						}
					});
				}

				return this;
			}

		}

	});

}).apply(this, [window.theme, jQuery]);