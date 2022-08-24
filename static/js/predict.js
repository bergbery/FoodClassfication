$(document).ready(function () { 
	
	//var predictions = {
	//	"class1": 'NasiLemak',
	//	"class2": 'CharKwayTeow',
	//	"prob1":0.9,
	//	"prob2":0.1,
	//}

	setTimeout(function(){	
		var vpredictresult = '{{ predictions.class1 }}';
		alert(vpredictresult);
		//## search wiki and display result
		searchAndDisplayWiki(vpredictresult);
	}, 200);
});

//## search wiki and display result
function searchAndDisplayWiki(_vpredictresult) {
	var vdata = '';
	$.ajax({
		type: "GET",
		url: "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + _vpredictresult + "&callback=?",
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
		url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + _firstresult + "&callback=?",
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
			blurb.find('.infobox-title.fn').remove();
			blurb.find('.infobox-below').closest('tr').remove();
			blurb.find('.thumb.tright').remove();
			blurb.find('.mw-references-wrap.mw-references-columns').remove();
			
			// remove any references
			blurb.find('sup').remove();

			// remove cite error
			blurb.find('.mw-ext-cite-error').remove();
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
