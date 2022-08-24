$(document).ready(function () { 
	
	var vpredictions = {
		"class1": '',
		"class2": ',
		"prob1":0,
		"prob2":0,
	}
	if (mpredictions != '') {
		vpredictions = JSON.Parse(mpredictions);
	}

	setTimeout(function(){	
		var vpredictresult = vpredictions.class1;
		//var vuploadedimg = vpredictions.image64;
		//$('#uploadedimg').attr('src, vuploadedimg);
		//alert(vpredictresult);
		//## search wiki and display result
		searchAndDisplayWiki(vpredictresult);
		//## turn on collapse
		$('.' + vpredictresult).removeClass('hidectrl');
	}, 200);
});

//## search wiki and display result
function searchAndDisplayWiki(_vpredictresult) {
	var vdata = '';
	$.ajax({
		type: "GET",
		url: "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + _vpredictresult + "&callback=?",
		contentType: "application/json; charset=utf-8",
		async: false,
		dataType: "json",
		success: function (data, textStatus, xhr) {
			$.each(data, function (i, item) {
				if (i == 1) {
					//## display wiki result - 1st item
					var vfirstresult = item[0];
					displayWikiContent(vfirstresult);
				}
			});
					
			
		},
		error: function (xhr, textStatus, errorThrown) {
			vdata = textStatus;
		}
	});
	return vdata;
}

function displayWikiContent(_firstresult) {
	$.ajax({
		type: "GET",
		url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + _firstresult + "&callback=?",
		contentType: "application/json; charset=utf-8",
		async: false,
		dataType: "json",
		success: function (data, textStatus, jqXHR) {

			var markup = data.parse.text["*"];
			var blurb = $('<div></div>').html(markup);

			// remove links as they will not work
			blurb.find('a').each(function () { 
				$(this).replaceWith($(this).html()); 
			});
			
			//## remove further link
			//blurb.find('.infobox-title.fn').remove();
			blurb.find('.infobox-below').closest('tr').remove();
			blurb.find('.thumb.tright').remove();
			//blurb.find('.mw-references-wrap.mw-references-columns').remove();
			blurb.find('table.infobox').not('.hrecipe').remove();
			blurb.find('.mw-references-wrap').remove();
			
			// remove any references
			//@blurb.find('sup').remove();

			// remove cite error
			//@blurb.find('.mw-ext-cite-error').remove();
			$('#wikidescription').html($(blurb).find('p'));
			$('#wikidescription').html(blurb);

		},
		error: function (errorMessage) {
			alert(errorMessage);
		}
	});
}

//## display wiki result
function displayWiki(apiResult){
	for (var i = 0; i < apiResult.query.search.length; i++){
		$('#wikidescription').append('<p>'+apiResult.query.search[i].title+'</p>');
	}
}
