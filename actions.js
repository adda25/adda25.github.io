function alertFormNotImplementedYet() {
  alert("Hello! Form is not active yet");
}

function setTitle(title) {
  var str = '<h1 class="page-header">'.concat(title).concat('</h1>')
  var msg = str
  document.getElementById('name').innerHTML = msg;
}


// \\\\\\\\\\\\\\\\\\\\\\\\\\\\
// For carousel images handling
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\

function setImages() {
  var folder = "images/";
  $.ajax({
      url : folder,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(JPG|jpg|png|gif)$/) ) { 
                  $("body").append( "<img src='"+ folder + val +"'>" );
              } 
          });
          console.log(data);
      }
  });
}


// \\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Form handling
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Thanks to Matteo Ragni
// https://github.com/MatteoRagni

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

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Scroll animation JS
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\

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
