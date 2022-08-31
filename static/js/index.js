function onchange_submitfile(_this) {
	$('#submituploadfile').trigger('click');
}

function onclick_itemreceipe(_this) {
	if ($(_this).hasClass('nasilemak') == true) {
		window.location = '/displaypredict/?_foodtype=NasiLemak&_buttondisplay=both';
	}
	else if ($(_this).hasClass('charkwayteow') == true) {
		window.location = '/displaypredict/?_foodtype=CharKwayTeow&_buttondisplay=both';
	}
}