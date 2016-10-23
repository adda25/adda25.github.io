
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
  /**
    Control the imageView pic
    when the user click on the imageView.
    If the touch point is greater than the 
    half width, than the next image is 
    presented, and viceversa.
  */
  $('#' + WebGallery.data.get_main_view_id()).click(function (e) { 
    var offset_l = $(this).offset().left - $(window).scrollLeft();
    var left = Math.round( (e.clientX - offset_l) );
    var div_width = $(this).width();
    if (left > (div_width * 0.5)) {
      WebGallery.next();
    } else {
      WebGallery.previus();
    }
  });

  /**
    If the user click on the thumbImages,
    than the selected thumb is show
    in the imageView.
  */
  $(document).on('click', '.thumbView', function (event) {
    WebGallery.set_at_thumb_id(event.target.id);
  });
});


var WebGallery = {

  setup: function(main_view_id, images_to_load) {
    this.data.setup(main_view_id, images_to_load);
  },

  next: function() {
    this.data.next();
  },

  previus: function() {
    this.data.previus();
  },

  set_at_thumb_id: function(thumb_id) {
    this.data.set_at_thumb_id(thumb_id);
  },

  data: (function() {
    var images = [];
    var thumbs = [];
    var main_view = "";
    var images_size = 0;
    var thumbs_size = 0;
    var image_index = 0;
    var thumbs_start_index_val = 0; 

    var set_image_at_index = function(index) {
      if (index > (images_size - 1)) { return; }
      if (index < 0) { return; }
      if (images_size === 0) { return; }
      image_index = index;
      document.getElementById(main_view).style.backgroundImage = "url('" + images[index] + "')";
      if (thumbs_size === 0) {
        return;
      } else if (thumbs_size === 1) {
        load_thumbs_from_image_index_to(image_index, image_index + 1);
        set_selected_thumb_with_thumb_index(0);
      } else if (thumbs_size === 2) {
        load_thumbs_from_image_index_to(image_index, image_index + 2);
        set_selected_thumb_with_thumb_index(0);
      } else { 
        manage_thumbs_scroll();
        var selected_thumb_index = thumb_index_from_image_index();
        unselect_all_thumbs();
        set_selected_thumb_with_thumb_index(selected_thumb_index);
      }
    };

    var manage_thumbs_scroll = function() {
      // Convert imIndex in thumbsIndex
      var current_thumb_index = thumb_index_from_image_index();
      if (current_thumb_index === (thumbs_size - 1) ) {
        if (image_index === (images_size - 1)) { 
          return; 
        }
        // Go on
        thumbs_start_index_val += 1;
        load_thumbs_from_image_index_to(thumbs_start_index_val, thumbs_end_index());
      } else if (current_thumb_index === 0 && image_index !== 0) {
        // Go back
        thumbs_start_index_val -= 1;
        load_thumbs_from_image_index_to(thumbs_start_index_val, thumbs_end_index());
      }
    };

    var load_thumbs_from_image_index_to = function(min, max) {
      var img_idx = min;
      if (img_idx < 0 || images_size === 0) { return; }
      for (var i = 0; i < thumbs_size; i++) {
        if (img_idx > (images_size - 1)) { return; }
        if (img_idx === max) { return; }
        document.getElementById(thumbs[i]).style.backgroundImage = "url('" + images[img_idx] + "')";
        img_idx++;
      }
    };

    var set_selected_thumb_with_thumb_index = function(thumb_index) {
      document.getElementById(thumbs[thumb_index]).style.opacity = 1.0;
    };

    var unselect_all_thumbs = function() {
      for (var i = 0; i < thumbs_size; i++) {
        document.getElementById(thumbs[i]).style.opacity = 0.5;
      }
    };

    var thumbs_start_index = function() {
      return thumbs_start_index_val;
    };

    var thumbs_end_index = function() {
      return (thumbs_start_index_val + thumbs_size);
    };

    var thumb_index_from_image_index = function() {
      return image_index - thumbs_start_index(); 
    };

    return { 

      get_main_view_id: function() {
        return main_view;
      },

      setup: function(main_view_id, images_to_load) {
        main_view = main_view_id;
        images = images_to_load;
        images_size = 0;
        thumbsNum = 0;
        image_index = 0;
        thumbs_start_index_val = 0;
        var nt = [];
        thumbs = document.querySelectorAll('[id^="thumbView"]');
        thumbs.forEach(item => {
            nt.push(item.id);
            thumbs_size++;
        })
        thumbs = nt
        images.forEach(item => { images_size++; })
        load_thumbs_from_image_index_to(0, thumbs_end_index());
        set_image_at_index(0);
        return this;
      },

      next: function() {
        if (images_size === image_index) { return; }
        image_index++;
        set_image_at_index(image_index);
      },

      previus: function() {
        if (image_index === 0) { return; }
        image_index--;
        set_image_at_index(image_index);
      },

      set_at_thumb_id: function(thumb_id) {
        var k = 0;
        thumbs.forEach(item => {
          if (item === thumb_id) {
            var start_index = thumbs_start_index();
            set_image_at_index(k + start_index);
          }
          k++;
        })
      }
    }; // End return
  }()) // End data

}; // End ImageGallery

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


