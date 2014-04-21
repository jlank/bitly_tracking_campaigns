// created by John Lancaster - @jlank - john.k.lancaster@gmail.com | 2014 | MIT License

// add campaign element
$('button.campaign.the-icons.btn').click(function () {
  $('#campaign').append('<input type="text" placeholder="other"><br/>');
});

// add name element
$('button.initials.the-icons.btn').click(function () {
  $('#initials').append('<input type="text" placeholder="name_next"><br/>');
});

// update table http://stackoverflow.com/questions/4220126/run-javascript-function-when-user-finishes-typing-instead-of-on-key-up
//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 500;   //time in ms, 5 second for example

//on keyup, start the countdown
$('.listen_keys input').on('keyup', function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown
$('.listen_keys input').on('keydown', function() {
    clearTimeout(typingTimer);
});

//user is "finished typing," do something
function doneTyping () {
    //do something
    var array_els = function (el) { if (el.value !== "") return el.value; }
    var remove = function (n, i) { return (n !== "" && n != undefined); }
    var baseUrl = '';
    var longUrl = '';
    var token = '';
    var campaign_elements = $('#campaign input');
    var initials_elements = $('#initials input');

    // get all values from campaign and initials input
    var c_values = [].map.call(campaign_elements, array_els);
    var i_values = [].map.call(initials_elements, array_els);

    // remove undefined elements from arrays
    campaign_values = $.grep(c_values, remove);
    initials_values = $.grep(i_values, remove);

    baseUrl = $('#base_url').val();

    var generate_links = function (c, i) {
      if (c) camp = c;
      init = i ? i : '';
      var longUrl = baseUrl + '?' + camp + '_' + init;
      $('table tbody').append('<tr> <td>' + camp + '</td> <td>' + init + '</td> <td class="longUrl"><a target="_blank" href="' + longUrl + '">' + longUrl + '</a></td> <td class="bitlyUrl">bitly</td> </tr>');
    }

    $('table tbody > tr').remove();
    campaign_values.forEach(function (camp) {
      if (initials_values.length) {
        initials_values.forEach(function (init) { generate_links(camp, init) });
      }
      else {
        generate_links(camp);
      }
    });
}

// get short links with api token for bitly
$('#get_links').click(function (e) {
  e.preventDefault();
  $('table tbody > tr').each(function () {
    $this = $(this);
    var value = $this.find(".longUrl a");
    value = value.html();
    get_short(value, function (data) {
      var $row = $('tr:contains(' + data.data.long_url + ')');
      var bit_value = $row.find(".bitlyUrl");
      $(bit_value).html('<a target="_blank" href="' + data.data.url + '">' + data.data.url + '</a>');
    });
  });
});

var get_short = function (link, result) {
  var api_endpoint = 'https://api-ssl.bitly.com/v3/shorten'
  var format = 'json';
  var username = $('#bitly_username').val();
  var key = $('#bitly_key').val();

  var request_url = api_endpoint + '?' +
                    'longUrl=' + encodeURIComponent(link) +
                    '&login=' +  username + '&apiKey=' + key + '&format=' + format;

  if (username == "") return alert('please enter your bitly username');
  if (key == "") return alert('please enter your bitly API key');

  var err = function (err) { alert(err); }
  $.ajax({ url: request_url, error: err, success: result }); // make the request and call back with provided function
}
