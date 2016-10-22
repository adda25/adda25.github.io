
function setTitle(title) {
  var str = '<h1 class="page-header">'.concat(title).concat('</h1>')
  var msg = str
  document.getElementById('name').innerHTML = msg;
}

/**
  Form handling

  Thanks to Matteo Ragni
  https://github.com/MatteoRagni
*/

$("input[name=submit]").click(function(e) {
  var mess = $("textarea[name=message]").val();
  var mail = $("input[name=email]").val();
  if (mess != "") {
    $.post("http://asetti.altervista.org/respond.php",
      {message: mess, mail: mail}).
      done(function(d) { console.log(d);
        if(d == "NO") {
          alert("There was an error...");
        }
        if (d == "OK") {
          alert("Message sent!");
          $("textarea[name=message]").val("");
          $("input[name=mail]").val("");
        }
      });
  }
  return false;
})

/**
  Scroll animation JS
*/

var $animation_elements = $('.animation-element');
var $window = $(window);

function check_if_in_view() {
  var window_height = $window.height();
  var window_top_position = $window.scrollTop();
  var window_bottom_position = (window_top_position + window_height);

  $.each($animation_elements, function() {
    var $element = $(this);
    var element_height = $element.outerHeight();
    var element_top_position = $element.offset().top;
    var element_bottom_position = (element_top_position + element_height) + 200;

    //check to see if this current container is within viewport
    if ((element_bottom_position >= window_top_position) &&
      (element_top_position <= window_bottom_position)) {
      $element.addClass('in-view');
    } else {
      $element.removeClass('in-view');
    }
  });
}

$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');

setInterval(function(){ 
 $('.text-anim').toggleClass('animate');
},2000);


/**
  Navbar only after first section
*/
$('#main-nav').hide();
$(window).scroll(function() {
  if ($(this).scrollTop() > 600) {
    $('#main-nav').fadeIn();
  } else {
    $('#main-nav').fadeOut();
  }
 });


/*
 ___                          __     ___               
|_ _|_ __ ___   __ _  __ _  __\ \   / (_) _____      __
 | || '_ ` _ \ / _` |/ _` |/ _ \ \ / /| |/ _ \ \ /\ / /
 | || | | | | | (_| | (_| |  __/\ V / | |  __/\ V  V / 
|___|_| |_| |_|\__,_|\__, |\___| \_/  |_|\___| \_/\_/  
                     |___/                             
*/

$(document).ready(function() {
    $("#imageView1").click(function(e) {
        var offset_t = $(this).offset().top - $(window).scrollTop();
        var offset_l = $(this).offset().left - $(window).scrollLeft();
        var left = Math.round( (e.clientX - offset_l) );
        var right = -left + e.clientX;
        var top = Math.round( (e.clientY - offset_t) );
        if (left >= right) {
            ImageGallery.userWantsNext();
        } else {
            ImageGallery.userWantsPrevius();
        }
    });
});

/**
    If the user click on the thumbImages,
    than the selected thumb is show
    in the imageView.
*/
$(document).on('click', '.thumbView', function (event) {
    ImageGallery.userWantsThumbId(event.target.id);
});


var ImageGallery = {
  images: [],
  thumbs: [],
  mainView: "",
  imagesNum: 0,
  thumbsNum: 0,
  imIndex: 0,
  thumbsStartIndexVal: 0,

  setup: function() {
    this.imagesNum = 0;
    this.thumbsNum = 0;
    this.imIndex   = 0;
    this.thumbsStartIndexVal = 0;
    var nt = [];
    this.thumbs = document.querySelectorAll('[id^="thumbView"]');
    this.thumbs.forEach(item => {
        nt.push(item.id);
        this.thumbsNum++;
    })
    this.thumbs = nt
    this.images.forEach(item => { this.imagesNum++; })
    this.loadThumbsFromImageIndexTo(0, this.thumbsEndIndex());
    this.setImageAtIndex(0);
  },

  userWantsNext: function() {
    if (this.imagesNum == this.imIndex) { return; }
    this.imIndex++;
    this.setImageAtIndex(this.imIndex);
  },

  userWantsPrevius: function() {
    if (this.imIndex == 0) { return; }
    this.imIndex--;
    this.setImageAtIndex(this.imIndex);
  },

  userWantsThumbId: function(thumbId) {
    var k = 0;
    this.thumbs.forEach(item => {
      if (item == thumbId) {
        var startIndex = this.thumbsStartIndex();
        this.setImageAtIndex(k + startIndex);
      }
      k++;
    })
  },

  setImageAtIndex: function(index) {
    if (index > (this.imagesNum - 1)) { return; }
    if (index < 0) { return; }
    if (this.imagesNum == 0) { return; }
    this.imIndex = index;
    document.getElementById(this.mainView).style.backgroundImage = "url('" + this.images[index] + "')";
    if (this.thumbsNum == 0) {
      return;
    } else if (this.thumbsNum == 1) {
      this.loadThumbsFromImageIndexTo(this.imIndex, this.imIndex + 1);
      this.setSelectedThumbWithThumbIndex(0);
    } else if (this.thumbsNum == 2) {
      this.loadThumbsFromImageIndexTo(this.imIndex, this.imIndex + 2);
      this.setSelectedThumbWithThumbIndex(0);
    } else { 
      this.manageThumbsScroll();
      var selectedThumbIndex = this.thumbIndexFromImIndex();
      this.unselectAllThumbs();
      this.setSelectedThumbWithThumbIndex(selectedThumbIndex);
    }
  },

  manageThumbsScroll: function() {
    // Convert imIndex in thumbsIndex
    var currentThumbIndex = this.thumbIndexFromImIndex();
    var thumbsSize = this.thumbsNum;
    if (currentThumbIndex == (thumbsSize - 1) ) {
      if (this.imIndex == (this.imagesNum - 1) ) { 
        return; 
      }
      // Go on
      this.thumbsStartIndexVal += 1;
      this.loadThumbsFromImageIndexTo(this.thumbsStartIndexVal, this.thumbsEndIndex());
    } else if (currentThumbIndex == 0 && this.imIndex != 0) {
      // Go back
      this.thumbsStartIndexVal -= 1;
      this.loadThumbsFromImageIndexTo(this.thumbsStartIndexVal, this.thumbsEndIndex());
    }
  },

  loadThumbsFromImageIndexTo: function(min, max) {
    var imgIdx = min;
    if (imgIdx < 0 || this.imagesNum == 0) { return; }
    for (var i = 0; i < this.thumbsNum; i++) {
      if (imgIdx > (this.imagesNum - 1)) { return; }
      if (imgIdx == max) { return; }
      document.getElementById(this.thumbs[i]).style.backgroundImage = "url('" + this.images[imgIdx] + "')";
      imgIdx++;
    }
  },

  setSelectedThumbWithThumbIndex: function(thumbIndex) {
    document.getElementById(this.thumbs[thumbIndex]).style.opacity = 1.0;
  },

  unselectAllThumbs: function() {
    for (var i = 0; i < this.thumbsNum; i++) {
      document.getElementById(this.thumbs[i]).style.opacity = 0.5;
    }
  },

  thumbsStartIndex: function() {
    return this.thumbsStartIndexVal;
  },

  thumbsEndIndex: function() {
    return (this.thumbsStartIndexVal + this.thumbsNum);
  },

  thumbIndexFromImIndex: function() {
    return this.imIndex - this.thumbsStartIndex(); 
  }

}; 


/*
 ____  _    _ _ _ _                
/ ___|| | _(_) | | |__   __ _ _ __ 
\___ \| |/ / | | | '_ \ / _` | '__|
 ___) |   <| | | | |_) | (_| | |   
|____/|_|\_\_|_|_|_.__/ \__,_|_|   
   
 https://codepen.io/tamak/pen/hzEer        
*/

jQuery(document).ready(function(){
    jQuery('.skillbar').each(function(){
        jQuery(this).find('.skillbar-bar').animate({
            width:jQuery(this).attr('data-percent')
        },1);
    });
});


