/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 *
 * Google CDN, Latest jQuery
 * To use the default WordPress version of jQuery, go to lib/config.php and
 * remove or comment out: add_theme_support('jquery-cdn');
 * ======================================================================== */

(function($) {
	/*
	* Global variables
	*/
	var doc = document,
		win = window,
		body = doc.body;

	var $window = $(win),
		$html = $('html');


	/*
	* Get element by id
	*/
	function id(el){
		return doc.getElementById(el);
	}


	/*
	* View Port Width Detection
	*/
	var viewportSize = function(){
		var innerWidth = $window.innerWidth();

		switch(true) {
			case (innerWidth < 768):
				return 'phone';
			case (innerWidth < 992):
				return 'tablet';
			case (innerWidth > 991):
				return 'desktop';
		}
	};


	/*
	* Modernizr detection
	*/
	var history = Modernizr.history,
		touch = Modernizr.touch;


	/*
	* IE detection
	*/
	switch(true) {
		case ($html.hasClass('.lt-ie8')):
			var ltIE8 = true;
			break;
		case ($html.hasClass('.lt-ie9')):
			var ltIE9 = true;
			break;
		case ($html.hasClass('.lt-ie10')):
			var ltIE10 = true;
			break;
	}


	/*
	* Debounce
	*/
	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this,
				args = arguments;

			var later = function() {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) {
				func.apply(context, args);
			}
		};
	}

// Use this variable to set up the common and page specific functions. If you
// rename this variable, you will also need to rename the namespace below.
var HYATT = {
	// All pages
	common: {
		init: function() {

			// Masthead Carousels -----------------------
			var $masthead = $('#masthead-component .flexslider'),
				$mastheadSlides = $('#masthead-component .flexslider .slides li');

			if($masthead.length){
				imagesLoaded( document.querySelector('#masthead-component'), function( instance ) {
					if($mastheadSlides.length > 1) {
						$masthead.flexslider({
							animation : "fade",
							slideshowSpeed: typeof $masthead.data('slide-speed') === 'undefined' ? 5000 : parseInt($masthead.data('slide-speed')) * 1000,
							controlNav: viewportSize() === 'desktop' ? true : false,
							directionNav: viewportSize() === 'phone' ? false : true,
							start: function(slider){ // Fires when the slider loads the first slide
								$('.progress').remove();
								$masthead.removeClass('visuallyhidden');

								var slide_count = slider.count - 1;

								$(slider)
									.find('img.lazy-slide:eq(0)')
									.each(function() {
										var src = $(this).attr('data-src');
										$(this).attr('src', src).removeAttr('data-src');
								});
							},
							before: function(slider){ // Fires asynchronously with each slider animation
								var slides     = slider.slides,
									index      = slider.animatingTo,
									$slide     = $(slides[index]),
									$img       = $slide.find('img[data-src]'),
									current    = index,
									nxt_slide  = current + 1,
									prev_slide = current - 1;

								$slide
									.parent()
									.find('img.lazy-slide:eq(' + current + '), img.lazy-slide:eq(' + prev_slide + '), img.lazy-slide:eq(' + nxt_slide + ')')
									.each(function() {
										var src = $(this).attr('data-src');
										$(this).attr('src', src).removeAttr('data-src');
								});
							}
						});
					} else {
						$('.progress').remove();
						$masthead.removeClass('visuallyhidden');
					}
				});
			}


			// Scroll to top -----------------------
			$('.scroll-top').click(function() {
				$('body,html').animate({
					scrollTop : 0
				}, 500);
			});


			// Form validation -----------------------
			$('.js_validate').change( function () {
				$(this).validate({
					rules: {
						"card-number": {
							required: true,
							creditcard: true
						},
						"expiration-month": {
							required: true,
							digits: true,
							minlength: 2
						},
						"expiration-year": {
							required: true,
							digits: true,
							minlength: 2,
							maxlength: 4
						},
						"last-name": {
							required: true,
							minlength: 1
						}
					},

					messages: {
						"last-name": {
							required: "Please specify your last name."
						}
					},

					submitHandler: function(form) {
					    // some other code
					    // maybe disabling submit button
					    // then:
					    $(form).submit();
					}
				});
			});




			// Promo Boxes ------------------------
			$promoBoxes = $('.promo-box');
			function resizePromoBoxHeight() {
				$promoBoxes.height("");
				if (viewportSize() !== 'phone') {
					var maxHeight = 0;
					$promoBoxes.outerHeight(function(i, val) {
						if (val > maxHeight) {
							maxHeight = val;
						}
					});
					$promoBoxes.outerHeight(maxHeight);
				}
			}
			if ($promoBoxes.length > 0) {
				$promoBoxes.imagesLoaded(resizePromoBoxHeight);
				$(window).resize(debounce(resizePromoBoxHeight, 200));
			}


			// News Rotator -----------------------
			$('.text-rotator-component .flexslider').flexslider({
				animation: "slide",
				directionNav: false
			});



			// Map -----------------------------
			$mapComponent = $('.map-component');
			for(var i = 0; i < $mapComponent.length; i++){
				var component = $($mapComponent[i]);
				var iframe = component.find("iframe");
				var aDirections = component.find("a");

				var location = iframe.data("latitude") + "~" + iframe.data("longitude");
				var search = aDirections.data("search").replace(/ /g, "%20");

				var frameUrl = "http://www.bing.com/maps/embed/viewer.aspx?v=3&cp=" + location;
				frameUrl += "&lvl=16&w=" + iframe.width() + "&h=" + iframe.height();
				frameUrl += "&sty=r&typ=d&pp=" + location;
				frameUrl += "&ps=&dir=0&mkt=en-us&src=SHELL&form=BMEMJS";

				iframe.attr("src", frameUrl);

				var aDirectionsUrl = "http://www.bing.com/maps/?cp=" + location;
				aDirectionsUrl += "&sty=r&lvl=16&rtp=~adr." + search;

				aDirections.attr("href", aDirectionsUrl);
			}


			// Fancybox -------------------------
			var $fancyboxInline = $(".fancybox-inline");
			if ($fancyboxInline.length){
				$fancyboxInline.fancybox({
					fitToView	: viewportSize() === 'phone' ? true : false,
					// fitToView	: false,
					width		: viewportSize() === 'desktop' ? 900 : '99%',
					// height		: viewportSize() === 'desktop' ? '50%' : '80%',
					margin		: 5,
					padding		: 0,
					autoSize	: false,
					autoHeight	: true,
					// scrolling	: 'no',
					openEffect	: 'none',
					closeEffect	: 'none',
					tpl         : {
						closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"><span class="icomoon-close"></span></a>',
						next    : '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span class="icomoon-next"></span></a>',
						prev    : '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span class="icomoon-prev"></span></a>'
					},
					afterLoad : function(current,previous){
						var currentModal = current.href;
						currentModal     = currentModal.substr(1); // remove first char, which is a hash
						currentModal     = id(currentModal);
						/*
						.fancybox-inline is visually hidden by default, ...
						remove .visuallyhidden as it's no longer needed */
						currentModal.className = currentModal.className.replace('visuallyhidden','');
					}
				});
			}

			var $fancyboxMap = $(".fancybox-map");
			if ($fancyboxMap.length){
				$fancyboxMap.fancybox({
					// fitToView	: false,
					fitToView	: true,
					width		: '70%',
					height		: '70%',
					margin		: 5,
					padding		: 15,
					// autoSize	: false,
					autoHeight	: true,
					scrolling	: 'no',
					openEffect	: 'none',
					closeEffect	: 'none',
					tpl         : {
						closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"><span class="icomoon-close"></span></a>',
						next    : '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span class="icomoon-next"></span></a>',
						prev    : '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span class="icomoon-prev"></span></a>'
					}
				});
			}




			// Navigation -----------------------

			// auto generate nav toggles for secondary nav
			var $navbarHeader = $('.navbar-header');
			var $navbarCollapse = $('.navbar-collapse');

			for(var j = 0; j < $navbarCollapse.length; j++){
				var $thisCollapse = $($navbarCollapse[j]);
				var $collapseID = $thisCollapse.attr('id');

				var buttonToggle;
				var $dropToggleText = $thisCollapse.find('.dropdown-toggle').text().trim();
				var $dropToggleClass = $thisCollapse.find('.dropdown-toggle > span:first-child').attr('class');

				// no collapse toggles, just a link
				if(typeof $collapseID === 'undefined'){
					buttonToggle = '<a href="' + $thisCollapse.find('.dropdown-toggle').attr('href') + '" class="btn btn-default navbar-toggle collapsed">';
					buttonToggle += '<span class="sr-only">' + $dropToggleText + '</span>';
					buttonToggle += '<span class="' + $dropToggleClass + '"> <span class="hidden-xs">' + $dropToggleText + '</span></span>';
					buttonToggle += '</a>';

					$navbarHeader.append(buttonToggle);

				}
				// collapse toggles
				else if($collapseID !== 'navbar-collapse-main'){
					buttonToggle = '<button type="button" class="navbar-toggle btn btn-default collapsed" data-toggle="collapse" data-target="#' + $collapseID + '">';
					buttonToggle += '<span class="sr-only">Toggle ' + $dropToggleText + '</span>';
					buttonToggle += '<span class="' + $dropToggleClass + '"> <span class="hidden-xs">' + $dropToggleText + '</span></span>';
					buttonToggle += '<span class="icomoon-dropdown-nav"></span>';
					buttonToggle += '</button>';

					$navbarHeader.append(buttonToggle);
				}
			}

			// toggle one nav at a time
			$('.navbar').on('show.bs.collapse', function () {
				var actives = $(this).find('.collapse.in'),
					hasData;

				// if a nav is already open
				if (actives && actives.length) {
					hasData = actives.data('collapse');
					if (hasData && hasData.transitioning){
						return;
					}
					actives.collapse('hide');

					// return hasdata if true
					return hasData || actives.data('collapse', null);
				}
			});



			// allow parent clickthrough of dropdown toggle for desktop
			if(viewportSize() === 'desktop'){
				$('#navbar-collapse-main .dropdown-toggle').click(function() {
					var location = $(this).attr('href');
					window.location.href = location;
					return false;
				});
			}



			// truncate property name in navbar if it's too long
			var togglesTotalWidth = 0;
			$('.navbar-toggle').each(function(){
				togglesTotalWidth += $(this).outerWidth();
			});

			if(viewportSize() === 'phone' || viewportSize() === 'tablet'){
				if($navbarHeader.height() > 60){
					$('.logo-component').css({
						'width': window.innerWidth - (togglesTotalWidth + 30),
						'overflow': 'hidden',
						'white-space': 'nowrap'
					});
				}
			}




			// Selection dropdowns -----------------------
			$('.selectpicker').selectpicker();

			$('.crs-country').on('change', function(){
				$('#stateProvince').selectpicker('refresh');
			});




			// Remove items from list
			$('.js_remove-item').click(function(){
				var $panel = $(this).closest('li');
				$panel.addClass("shrink");
				setTimeout(function() {
					$panel.remove();
				}, 300);
			});

			// delete all cart items
			function emptyCart(e) {
				var $cartList = $('.products__list li');

				$cartList.addClass("shrink");
				setTimeout(function() {
					$cartList.remove();
				}, 300);
			}

			// Popup confirmation -----------------------
			var $confirmPopup = $("[data-toggle=confirmation]");

			if ($confirmPopup.length){
				$confirmPopup.confirmation({
					popout		: true,
					onConfirm	: emptyCart
				});
			}

			$('.popover.confirmation').on('show.bs.popover', function () {
				// $(this).addClass('pulse animated');
				console.log('pulse');
			});
			$('.popover.confirmation').on('shown.bs.popover', function () {
				// $(this).addClass('pulse animated');
				console.log('pulsed');
			});



			// Datepickers -----------------------
			// var optionsDate = {
			// 	// format: 'D M dd, yyyy',
			// 	// weekStart: 1,
			// 	// autoclose: true,
			// 	// todayBtn: "linked",
			// 	// todayHighlight: true,
			// 	// clearBtn: true
			// };

			// disable all dates before today
			$.fn.datepicker.defaults.startDate = new Date();

			// intialize bootstrap datepicker
			$('.bootstrap-datepicker').datepicker();



			// Set Choose a date in datepicker and Listings -----------------------
			if ($('#previewDate').length) {
				var previewDate = id('previewDate');
				var $displayDate = $('.displayDate');
				var $btnAddCart = $('.btn--addcart');

				if(previewDate.value.length === 0) {
					$displayDate
						.html("<strong>Please select a date above to view times and book.</strong><br/><span>You can only book services a day at a time.</span>")
						.addClass('displayDate__alert') // show select date notice
						.next().addClass('visuallyhidden'); // hide time options

					// Make add to cart button disabled if no date is selected
					$btnAddCart.attr('disabled', true);
				}

				// Have a default message if no date is choosen
				$('.bootstrap-datepicker').on("changeDate", function() {
					if(previewDate.value.length > 0){
						$displayDate
							.html("Select Available Time on " + '<strong>' + previewDate.value + '</strong>')
							.removeClass('displayDate__alert') // hide select date notice
							.next().removeClass('visuallyhidden'); // show time options

							// Remove disabled if date is selected
							$btnAddCart.attr('disabled', false);
					}
				});
			}



			// News Read more button -----------------------
			if($('.news-component').length){
				var $newsImgHeight;
				var $beforeTruncation = $('.truncate').html();

				imagesLoaded( document.querySelector('.news-component'), function( instance ) {
					$newsImgHeight = $('.news-component img').height();
					$('.truncate').dotdotdot({
						/*	The text to add as ellipsis. */
						ellipsis	: '',

						/*	How to cut off the text/html: 'word'/'letter'/'children' */
						wrap		: 'word',

						/*	Wrap-option fallback to 'letter' for long words */
						fallbackToLetter: true,

						/*	jQuery-selector for the element to keep and put after the ellipsis. */
						after		: '.news-component__more',

						/*	Whether to update the ellipsis: true/'window' */
						watch		: false,

						/*	Optionally set a max-height, if null, the height will be measured. */
						height		: $newsImgHeight,

						/*	Deviation for the height-option. */
						tolerance	: 0,

						/*	Callback function that is fired after the ellipsis is added,
							receives two parameters: isTruncated(boolean), orgContent(string). */
						callback	: dotdotdotCallback,

						lastCharacter	: {

							/*	Remove these characters from the end of the truncated text. */
							remove		: [ ' ', ',', ';', '.', '!', '?' ],

							/*	Don't add an ellipsis if this array contains
								the last character of the truncated text. */
							noEllipsis	: []
						}
					});
				});
			}

			function dotdotdotCallback(isTruncated, originalContent) {
				if (!isTruncated) {
					$("a", this).remove();
				}
			}

			$(".truncate").on('click','a',function(e) {
				e.preventDefault();

				if ($(this).html() === ' <span class="caret"></span> Read More') {
					var div = $(this).closest('.truncate');
					div.trigger('destroy').find('.news-component__more').hide();
					$(".news-component__less", div).show();
				}
				else {
					$(this).hide();
					$(this).closest('.truncate').dotdotdot({
						height: $newsImgHeight,
						after: ".news-component__more",
						callback: dotdotdotCallback
					});
				}
			});



			// Gallery Carousel -----------------------
			var players = [];
			$('#gallery-component > .flexslider--thumbs').flexslider({
				animation: "slide",
				controlNav: false,
				animationLoop: false,
				slideshow: false,
				itemWidth: 164,
				itemMargin: 16,
				asNavFor: '#gallery-component > .flexslider--large'
			});

			$('#gallery-component > .flexslider--large').flexslider({
				animation: "slide",
				controlNav: false,
				animationLoop: false,
				slideshow: false,
				sync: "#gallery-component > .flexslider--thumbs",
				before: function(slider){
					if(window.yplayerLoaded){
						if(slider.slides[slider.currentSlide].getElementsByTagName('iframe').length){
							var current = slider.slides[slider.currentSlide].getElementsByTagName('iframe')[0].id;
							switch(players[current].getPlayerState()){
								case (1):  // playing
								case (3):  // buffering
									players[current].pauseVideo();
									break;
							}
						}
						if(slider.slides[slider.animatingTo].getElementsByTagName('iframe').length){
							var animatingTo = slider.slides[slider.animatingTo].getElementsByTagName('iframe')[0].id;
							switch(players[animatingTo].getPlayerState()){
								case (-1): // unstarted
								case (0):  // ended
								case (2):  // paused
								case (5):  // video cued
									//players[animatingTo].playVideo();
									break;
							}
						}
					}
				}
			});

			$('.video-poster').click(function(){
				var $this = $(this);
				var $vidID = $this.next('a').children('iframe').attr('id');

				players[$vidID].playVideo(); // play video
				$this.remove(); // remove poster
			});

			// Youtube API -----------------------
			if($('[data-youtube]').length){
				var tag = doc.createElement('script');

				tag.src = '//www.youtube.com/iframe_api';
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

				var player;
				window.onYouTubeIframeAPIReady = function(){
					$('[data-youtube]').each(function(){
						player = new YT.Player(this.id,{
							height: '642',
							width: '1140',
							videoId: this.id,
							playerVars: {
								'autohide': 1,
								'autoplay': 0,
								'color': 'white',
								'controls': 0,
								'disablekb': 1,
								'enablejsapi': 1,
								'fs': 0,
								'modestbranding': 1,
								'origin': window.location.host,
								'rel': 0,
								'showinfo': 0,
								'theme': 'light',
								'version': 3
							},
							events: {
								'onReady': onPlayerReady,
								//'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
								//'onStateChange': onPlayerStateChange,
								//'onError': onPlayerError
							}
						});
						id(this.id).className = 'embed-responsive-item';
						window.yplayerLoaded = false;
						players[this.id] = player;
					});
				};
			}

			function onPlayerReady(e) {
				window.yplayerLoaded = true;
				$('.flexslider--large, .flexslider--thumbs').resize();
			}
		}
	},
	// Home page
	home: {
		init: function() {
			// JavaScript to be fired on the home page
		}
	},

	// About us page, note the change from about-us to about_us.
	about_us: {
		init: function() {
			// JavaScript to be fired on the about us page
		}
	},

	// Cart page, note the change from about-us to about_us.
	cart: {
		init: function() {
			// JavaScript to be fired on the cart page

			// delete all cart items
			$('.js_empty-cart').click(function(){
				$('.products__list li').remove();
			});


			$('.btn--addcart').click(function(){
				var target = $(this).closest('li');
				var getTimeSlot = target.find('label.active').text();
				var getTechPref = target.find('#descriptionPreference option:selected').text();
				$(this).next().click();
				if(getTechPref !== "No Preference") {
					target.find('.listing__field--techPreference').text(getTechPref);
				}
				if(getTimeSlot === "") {
					return false;
				}
				target.find('.listing__field--time').text(getTimeSlot);
			});
		}
	},

	review:{
		init: function() {
			$('.btn-user-detail-toggle').toggleClass('collapsed');
			// $(window).resize(function(){
			// 	if(viewportSize() === 'phone'){
			// 		$('.user-details').find('.collpse').addClass('collapse');
			// 	}
			// 	else{
			// 		$('.user-details').find('.collpse').removeClass('collapse');
			// 	}
			// });
			$('#js_checkout_terms-validate').validate({
				errorPlacement: function(error, element) {
					error.insertAfter(element.next('label'));
				},
				rules: {
					"termsAndCondition": {
						required: true
					}
				},
				messages: {
					"termsAndCondition": {
						required: "This is a required field."
					}
				}
			});
		}
	},

	// About us page, note the change from about-us to account.
	account: {
		init: function() {
			// JavaScript to be fired on the account page


			$('#js_account-profile').validate({
				// onkeyup: false,
                // onfocusout: false,
                invalidHandler: function(event, validator) {
				    // 'this' refers to the form
				    var errors = validator.numberOfInvalids();
				    var $errorField = $("#errors2");
				    if (errors) {
				    	var message = errors == 1 ? 'You missed 1 required field. It has been highlighted below.' : 'You missed ' + errors + ' required fields. They have been highlighted below.';
				    	$errorField.html("<div class='form-error-message'>" + message + "</div>");
				    	$errorField.show();
				    } else {
				    	$errorField.hide();
				    }
    			},
				rules: {
					"zip-code": {
						minlength: 5,
						maxlength: 5
					},
					"telephone": {
						required: true,
						number: true,
						maxlength: 10
					}
				},
				messages: {
					"gender": {
						required: "Gender is a required field."
					},
					"street": {
						required: "Street is a required field."
					},
					"city": {
						required: "City is a required field."
					},
					"birthday": {
						required: "Your birthday is a required field."
					},
					"zip-code": {
						required: "Your postal code is a required field."
					},
					"telephone": {
						required: "Your contact number is a required field."
					},
					"first-name": {
						required: "Please specify your first name."
					},
					"last-name": {
						required: "Please specify your last name."
					}
				}

			});

		}
	},

	// Treatments-services pages, note the change from treatments-services to treatments_services.
	treatments_services: {
		init: function() {
			// JavaScript to be fired on the streaments_services page


			// Add sticky class to booking-services__datepicker__content on scroll
			var stickyCart = debounce(function(){
				var $ele    = $('.booking-services__datepicker-wrapper');
				var $btn    = $('.booking-services__datepicker-wrapper .btn');
				var $eleTop = $ele.offset().top;
				var yScroll = $window.scrollTop(); // y position of the scroll

				// add buffer to compensate for debounce
				// yScroll -= 60;

				// if window is below element
				if(yScroll > $eleTop){
					$ele.addClass('booking-services__datepicker-wrapper--fixed');
					$btn.removeClass('visuallyhidden');
				} else {
					$ele.removeClass('booking-services__datepicker-wrapper--fixed');
					$btn.addClass('visuallyhidden');
				}
			},20);
			window.addEventListener('scroll', stickyCart);


			// Toggle button to say close / book
			$('.btn-product-toggle').click( function() {
				var $bookToggleButton = $(this).closest('li').find('.products__list__head .btn-product-toggle');

				if ($bookToggleButton.attr('aria-expanded') === 'true') {
				    $bookToggleButton.text('BOOK').addClass("btn--secondary").removeClass('btn--support');
				} else {
				    $bookToggleButton.text('CLOSE').addClass("btn--support").removeClass('btn--secondary');
				}
			});

			$(".btn").mouseup(function(){
				$(this).blur();
			});

			//Make Submit button disabled unless radio button is checked or make submit butt clickable when radio button is changed or selected
			// if ($panel.find('.active')) {
			// 	// $panel.find('.btn--submit__container > input').addClass("btn--support").removeClass('btn--secondary');
			// 	alert('active');
			// }

			UTIL.fire('treatments_services','collapse');
		},

		collapse: function() {
			// hide/show product info and form
			$('.productForm').on('show.bs.collapse',function(){
				$(this).prev().collapse('show');
			});
			$('.productForm').on('hide.bs.collapse',function(){
				$(this).prev().collapse('hide');
			});
		}
	}
};

// The routing fires all common scripts, followed by the page specific scripts.
// Add additional events for more control over timing e.g. a finalize event
var UTIL = {
	fire: function(func, funcname, args) {
		var namespace = HYATT;
		funcname = (funcname === undefined) ? 'init' : funcname;
		if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
			namespace[func][funcname](args);
		}
	},
	loadEvents: function() {
		UTIL.fire('common');

		$.each(document.body.className.replace(/-/g, '_').split(/\s+/),function(i,classnm) {
			UTIL.fire(classnm);

			// Log the function className
			console.log(classnm);

		});

	}
};


$(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
