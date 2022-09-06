function onchange_submitfile(_this) {
	var input = document.getElementById('fileinput');
    if (!input.files) { // This is VERY unlikely, browser support is near-universal
        Swal.fire({
					title:"This browser doesn't seem to support the `files` property of file inputs.", 
					html: "",
					icon: 'error',
					showDenyButton: false,
					showCancelButton: false,
					confirmButtonText: 'Close',
					denyButtonText: ''
				});
    } else {
        var file = input.files[0];
		var vfilesize = file.size;		
        if (vfilesize > 1000000) {
			var vfilesizeinMB = byteToMB(vfilesize, 2);
			Swal.fire({
					title:"File " + file.name + " is " + vfilesizeinMB + " MB in size, which exceed the limit!", 
					html: "Please choose another file",
					icon: 'error',
					showDenyButton: false,
					showCancelButton: false,
					confirmButtonText: 'Close',
					denyButtonText: ''
				});
		}
		else {
			$('#submituploadfile').trigger('click');
		}
    }
	
	
}

function byteToMB(bytes, roundTo) {
  var converted = bytes / (1024*1024);
  return roundTo ? converted.toFixed(roundTo) : converted;
}

function onclick_itemreceipe(_this) {
	if ($(_this).hasClass('nasilemak') == true) {
		window.location = '/displaypredict/?_foodtype=NasiLemak&_buttondisplay=both';
	}
	else if ($(_this).hasClass('charkwayteow') == true) {
		window.location = '/displaypredict/?_foodtype=CharKwayTeow&_buttondisplay=both';
	}
}

function onclick_submitfeedback(_this) {
	event.preventDefault();
	
	Swal.fire({
		title:"Feedback had been submitted!", 
		html: "Thank you",
		icon: 'success',
		showDenyButton: false,
		showCancelButton: false,
		confirmButtonText: 'OK',
		denyButtonText: ''
	}).then((result) => {
		$('#name').val('');
		$('#email').val('');
		$('#phone').val('');
		$('#message').val('');
	})
}
