$(document).ready(function(){

	initForm();
	initCarousel();
	initExpand();


	if ( $('.ie-compat').length>0 ){
		initIE();
	}
	else if (document.referrer.indexOf(location.protocol + "//" + location.host) === 0){
		initIE();
	}
	else {
		if (document.cookie.replace(/(?:(?:^|.*;\s*)homeIntro\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
			
			Intro.init(); //animate if not <ie10 or referred from same site
			Intro.loaded();
			
	    	document.cookie = "homeIntro=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
		} else {
			$('.title-overlay').hide();
		}
	}

});



$(document).scroll(function(){
	Intro.cancel();
})

// intro animation
var Intro = (function() {
    return {
    	init: function(){
    		if ( $(window).width() > 767 && $('body').hasClass('homepage')) {
    			$('body').addClass('intro-running');
				$('header h1, .main-container').addClass('prepare');
    		}
    		else {
	        	$('.title-overlay').hide();
    		}
    	},
        loaded: function() {
          	setTimeout(function() {
				$('body').removeClass('intro-running');
			    $('.title-overlay').fadeOut(300,function(){
					$('header .prepare, .main-container').removeClass('prepare')
			    });
			}, 3200);
        },
        cancel: function(){
			if ( $('body').hasClass('intro-running')) {
	        	$('.title-overlay').fadeOut();
	        	$('body').removeClass('intro-running');
				$('header .prepare, .main-container').removeClass('prepare')
			}
        }
    }
}());

function initIE(){
	$('.title-overlay').fadeOut(200);
}


function initExpand(){
	$('.expand').click(function(e){
		e.preventDefault();
		$(this).parents('.team_member_descr').animate({
			height: $(this).parents('.team_member_descr').get(0).scrollHeight
		}, 500);
		$(this).siblings('.overlay').animate({
			opacity: 0
		},500);
		$(this).animate({
			opacity: 0
		},500);
	});
}


function carouselButtons(currentSlide,max){
	if (currentSlide==0){
  	$('.carousel-container .carousel-nav.next').fadeIn();
  	$('.carousel-container .carousel-nav.prev').fadeOut();
  }
  else if (currentSlide== (max-1 )){
  	$('.carousel-container .carousel-nav.next').fadeOut();
  	$('.carousel-container .carousel-nav.prev').fadeIn();
  }
  else {
  	$('.carousel-container .carousel-nav').fadeIn();
  }
}
function initCarousel(){
	if($('.carousel').length){
		var slides = $('.carousel .item').length;
		$('.carousel').slick({
			dots: true,
			nextArrow: $('.carousel-nav.next'),
			prevArrow: $('.carousel-nav.prev'),
			centerMode: true,
			infinite: false,
			variableWidth: true,
		});
		$('.carousel').on('afterChange', function(event, slick, currentSlide){
		  carouselButtons(currentSlide,slides);
		});
		carouselButtons(0,slides);

	}


	if($(window).width() < 768){
		$('.carousel').slick('slickSetOption', 'centerMode', false, true);
		if($('.item').length > 1){
			$('.carousel .item').each(function(){
				$(this).css("background-image", "url("+$(this).data('mobile-image')+")").css('background-size', 'contain');
			});
		} else {
			$('.carousel').slick('slickSetOption', 'centerMode', true, true);
			$('.carousel .item').css('width', $(window).width() );
			$('.carousel .item').css("background-image", "url("+$('.carousel .item').data('mobile-image-single')+")").css('background-size', 'cover');
		}
	} 
	else {
		if($('.item').length == 1){
			$('.carousel').slick('slickSetOption', 'centerMode', true, true);
			$('.carousel .item').css('width', $(window).width() );
		} else {
			
		}
	}
}

function initForm(){
	if ($('select').length)$('select').selectOrDie();
	
		
	window.Parsley.on('field:validated', function() {
	  // This global callback will be called for any field that fails validation.
	  // console.log('test');
	    if($('select').hasClass('parsley-error')){
			$('.sod_select').addClass('parsley-error');
		} else {
			$('.sod_select').removeClass('parsley-error');
		}
	});
	
	// submit form
	$('form#getintouch').on('submit',function(e){
		e.preventDefault();
		$('form').parsley();
		if($('select').hasClass('parsley-error')){
			$('.sod_select').addClass('parsley-error');
		}
        var data = $('form#getintouch').serialize();
        $.ajax({
	        url:'/actions/contact/submission/submitForm'
	        ,type: "POST"
	        ,data: data
	        ,dataType: 'json'
	        ,success: function(){
	        	// success msg
		        $('.form-success').fadeIn();

		        // clear form
			    $('form').find("input[type=text], input[type=email], textarea").val("");
			    $('#topic option:first-child').prop('selected', true);
				$('.sod_option:first-child').trigger('click');
				$('.sod_option').removeClass('active selected');
				$('.sod_option:first-child').addClass('active selected');
				$('.sod_label').html($('#topic option:first-child').html());
				$("#topic").selectOrDie("update");

				// hide form
				$('form#getintouch .fields').slideUp();
	        }
	    }).done(function(response){
        });
	});

	// reopen cleared form to send another
	$('form#getintouch .toggle-form').on('click',function(e){
		e.preventDefault();
		$('.form-success').fadeOut();
		$('form#getintouch .fields').slideDown();
	})
}
