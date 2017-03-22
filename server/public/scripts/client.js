$(document).ready(function() {
  console.log('jquery sourced');

  $.ajax({
    type: "GET",
    url: "/books",
    success: function(response) {
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        var book = response[i];
        $('#books').append('<tr>');
        var $el = $('#books').children().last();
        $el.append('<td>' + book.id + '</td>');
        $el.append('<td>' + book.author + '</td>');
        $el.append('<td>' + book.title + '</td>');

      }
    }
  });
});
