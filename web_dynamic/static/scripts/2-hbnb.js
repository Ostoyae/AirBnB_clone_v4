$(document).ready(
  function () {
let r = $.get('http://localhost:5001/api/v1/status', (resp) => {
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
	   console.log($(this).attr('data-name'));
      }

      console.log(amenities);
      if ($.isEmptyObject(amenities)) {
        $('Div.amenities h4').html('&nbsp;');
      } else {
        $('Div.amenities h4').text(Object.values(amenities));
      }
    });
  });
