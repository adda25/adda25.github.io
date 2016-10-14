
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
    $("#thumbView0").click(function() {
      Pics.setAtIndex(0);
    });
});

$(document).ready(function() {
    $("#thumbView1").click(function() {
      Pics.setAtIndex(1);
    });
});

$(document).ready(function() {
    $("#thumbView2").click(function() {
      Pics.setAtIndex(2);
    });
});

$(document).ready(function() {
    $("#thumbView3").click(function() {
      Pics.setAtIndex(3);
    });
});

$(document).ready(function() {
    $("#thumbView4").click(function() {
      Pics.setAtIndex(4);
    });
});

$(document).ready(function() {
    $("#thumbView5").click(function() {
      Pics.setAtIndex(5);
    });
});


var Pics = { 
  index: 0,
  images: [],
  mainView: "",
  thumbs: [],
  _lastThIdx: 0, /* Private */
  _lastOp: 1,    /* Private */

  nextThumbnail: function(currentIndex) {
    document.getElementById(this.thumbs[this._lastThIdx]).style.opacity = 0.5;
    this._lastThIdx = currentIndex;
    document.getElementById(this.thumbs[currentIndex]).style.opacity = 1.0;
  },

  setAtIndex: function(index) {
    document.getElementById(this.mainView).style.backgroundImage = "url('" + this.images[index] + "')";
    this.nextThumbnail(index);    
    this.index = this.index + 1;
  },

  setup: function() {
    this.setAtIndex(0);
    for (var i = 0; i < 6; i++) {
      if (i >= 6) {
        break;
      } else {
        document.getElementById(this.thumbs[i]).style.backgroundImage = "url('" + this.images[i] + "')";
      }
    }
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


