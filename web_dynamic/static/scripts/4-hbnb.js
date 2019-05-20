// Get Users for since place only has the user_id value
let users = {};
$.get('http://0.0.0.0:5001/api/v1/users/')
  .done((data) => {
    data.map((usr) => {
      users[usr.id] = usr;
    });
    console.log('Received user data and mapped to dictionary');
  });

$(document).ready(function () {
  // api call to get places
  fetchPlaces();

  $.get('http://0.0.0.0:5001/api/v1/status/', (resp) => {
    if (resp.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  let amenities = {};
  $('DIV.amenities UL.popover li').each(function () {
    if ($(this).find(':checkbox').prop('checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    }
  });

  if ($.isEmptyObject(amenities)) {
    $('Div.amenities h4').html('&nbsp;');
  } else {
    $('Div.amenities h4').text(Object.values(amenities));
  }

  $('DIV.amenities UL.popover li').click(function () {
    let cd = $(this).find(':checkbox');
    let name = $(this).attr('data-name');
    let id = $(this).attr('data-id');
    if (!cd.prop('checked')) {
      delete amenities[id];
    } else {
      amenities[id] = name;
      // console.log($(this).attr('data-name'));
    }

    console.log(amenities);
    if ($.isEmptyObject(amenities)) {
      $('Div.amenities h4').html('&nbsp;');
    } else {
      $('Div.amenities h4').text(Object.values(amenities));
    }
  });

  $('BUTTON').click(function () {
    // TODO do we need to do any prior cleanup?
    fetchPlaces({ 'amenities': Object.keys(amenities) });
  });
});

function fetchPlaces (json = {}) {
  // remove existing articles, however a naive solution.
  $('section.places article').remove();
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify(json),
    contentType: 'application/json',
    success: function (resp) {
      createArticle(resp);
    }
  }
  )
    .done(() => {
      console.log('Received places data');
    })
    .fail((resp) => {
      console.log(resp.responseText);
    });
}

// createArticle - generates a html article for each place
//
// data - List of places from api
function createArticle (data) {
  let dest = $('section.places');

  data.forEach((place) => {
    dest.append(setHTML(place, users[place.user_id]));
  });
}

// setHTML - Take a html template and set the values accordingly
//
// html - Place object
// user - User Object associated with the place.
//
// Returns Article.
function setHTML (place, user) {
  let html = $($.parseHTML(ArticleHTML));
  let article = html.clone();
  let username = users ? `${user.first_name} ${user.last_name}` : 'john doe';

  article.find('.title h2').text(place.name).css('overflow-wrap', 'anywhere');
  article.find('.price_by_night').text(place.price_by_night);
  article.find('.max_guest').find('br').after(`${place.max_guest} Guests`);
  article.find('.number_rooms').find('br').after(`${place.number_rooms} Bedrooms`);
  article.find('.number_bathrooms').find('br').after(`${place.number_bathrooms} Bathroom`);
  article.find('.user strong').text(`Owner: ${username}`);
  article.find('.description').html(place.description);

  return article;
}

const ArticleHTML = '<article>\n' +
    '\n' +
    '\t    <div class="title">\n' +
    '\n' +
    '\t      <h2>place.name</h2>\n' +
    '\n' +
    '\t      <div class="price_by_night" style="resize: both; overflow: auto; " >\n' +
    '\n' +
    '\t\tplace.price_by_night\n' +
    '\n' +
    '\t      </div>\n' +
    '\t    </div>\n' +
    '\t    <div class="information">\n' +
    '\t      <div class="max_guest">\n' +
    '\t\t<i class="fa fa-users fa-3x" aria-hidden="true"></i>\n' +
    '\n' +
    '\t\t<br />\n' +
    // '\t\t      place.max_guest Guests\n' +
    '\n' +
    '\t      </div>\n' +
    '\t      <div class="number_rooms">\n' +
    '\t\t<i class="fa fa-bed fa-3x" aria-hidden="true"></i>\n' +
    '\n' +
    '\t\t<br />\n' +
    '\n' +
    // '\t\tplace.number_rooms Bedrooms\n' +
    '\t      </div>\n' +
    '\t      <div class="number_bathrooms">\n' +
    '\t\t<i class="fa fa-bath fa-3x" aria-hidden="true"></i>\n' +
    '\n' +
    '\t\t<br />\n' +
    '\n' +
    // '\t\tplace.number_bathrooms Bathroom\n' +
    '\n' +
    '\t      </div>\n' +
    '\t    </div>\n' +
    '\n' +
    '\t    <!-- **********************\n' +
    '\t\t USER\n' +
    '\t\t **********************  -->\n' +
    '\n' +
    '\t    <div class="user">\n' +
    '\n' +
    '\t      <strong>Owner: users[place.user_id]</strong>\n' +
    '\n' +
    '\t    </div>\n' +
    '\t    <div class="description">\n' +
    '\n' +
    '\t      place.description\n' +
    '\n' +
    '\t    </div>\n' +
    '\n' +
    '\t  </article> ';
