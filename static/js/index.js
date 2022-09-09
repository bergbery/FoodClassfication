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
	
	var vname = $('#name').val();
	var vemail = $('#email').val();
	var vphone = $('#phone').val();
	var vmessage = $('#message').val();
	
	if (vname == '' || vemail == '' || vmessage == '') {
		Swal.fire({
				title:"Please fill up the required field!", 
				html: "",
				icon: 'error',
				showDenyButton: false,
				showCancelButton: false,
				confirmButtonText: 'Close',
				denyButtonText: ''
			});		
	}
	else {
		var vuserfeedback = {
			'name': vname,
			'email': vemail,
			'contact': vphone,
			'remark': vmessage		
		}
		var vdata = '';
		$.ajax({
			url: `/insertfeedback/`,
			type: 'POST',
			crossDomain: true,
			data: JSON.stringify(vuserfeedback),
			contentType: "application/json",
			async: false,
			success: function (data, textStatus, xhr) {
				vdata = data;
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log('Error in Operation');
			}
		});
		
		if (vdata != null) {
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
		else {
			Swal.fire({
				title:"An error occured. Please call 6666 8888.", 
				html: "",
				icon: 'error',
				showDenyButton: false,
				showCancelButton: false,
				confirmButtonText: 'Close',
				denyButtonText: ''
			});	
		}
	}
}
