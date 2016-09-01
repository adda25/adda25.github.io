function alertFormNotImplementedYet() {
  alert("Hello! Form is not active yet");
}

function setTitle(title) {
  var str = '<h1 class="page-header">'.concat(title).concat('</h1>')
  var msg = str
  document.getElementById('name').innerHTML = msg;
}

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



