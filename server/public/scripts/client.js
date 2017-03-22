var editing = false;
var bookId = 0;

$(document).ready(function() {
  console.log('jquery sourced');

  getBooks();

  $('#bookForm').on('submit', function(event) {
    event.preventDefault();
    console.log($('#title').val(), $('#author').val());

    //validateForm();
    var objectToSend = {
      title: $('#title').val(),
      author: $('#author').val(),
      publisher: $('#publisher').val(),
      year: $('#year').val()
    };
    if(editing) {
      editing = false;
      var path = '/books/update/' + bookId;

      console.log(path);
      $.ajax({
        type: 'PUT', // similar to POST
        url: path, // use parameters to send the id of the book
        data: objectToSend,
        success: function() {
        getBooks();
        }
      });
    } else {
      $('#formTitle').text('Add new entry..');
      $.ajax({
        type:"POST",
        url: "/books/add",
        data: objectToSend,
        success: function(response) {
            getBooks();
            $('#title').val('');
            $('#author').val('');
            $('#publisher').val('');
            $('#year').val('');
        }
      });
    }
  });

  $('#books').on('click','.delete',function() {
    console.log('Delete Book:', $(this).data('book'));
    $.ajax({
      type: 'DELETE', //similar to SELECT
      url: '/books/delete/' + $(this).data('book'), // use parameters to send the id of the book
      success: function() {
        getBooks();
      }
    });
  });

  $('#books').on('click','.edit',function() {
    console.log('Edit Book:', $(this).data('book'));
    editing = true;
    $('#formTitle').text('Your are now editing..');
    bookId = $(this).data('book');
    console.log($(this).data('title'));

    $('#title').val($(this).data('title'));
    $('#author').val($(this).data('author'));
    $('#publisher').val($(this).data('publisher'));
    $('#year').val($(this).data('year'));
  });

});

function getBooks() {
  $.ajax({
    type: "GET",
    url: "/books",
    success: function(response) {
      console.log(response);
      $('#books').empty();
      for (var i = 0; i < response.length; i++) {
        var book = response[i];
        $('#books').append('<tr>');
        var $el = $('#books').children().last();
        $el.append('<td>' + book.id + '</td>');
        $el.append('<td>' + book.author + '</td>');
        $el.append('<td>' + book.title + '</td>');
        $el.append('<td>' + book.publisher + '</td>');
        $el.append('<td>' + book.year + '</td>');
        $el.append('<td><button class="delete" data-book='+
                  book.id + '>Delete</button></td>');
        $el.append('<td><button class="edit" data-book='+ book.id +
                          ' data-author="' + book.author +
                          '" data-title= "' + book.title +
                          '" data-publisher= "' + book.publisher +
                          '" data-year= ' + book.year +
                          '>Edit</button></td>');

      }
    }
  });
}

function validateForm() {

  if ($('#title').val() === '') {
    console.log("title cannot be empty");

  }

  // $('#title').val(),
  // author: $('#author').val(),
  // publisher: $('#publisher').val(),
  // year: $('#year').val()
}
