$(document).ready(function () { 
	
	var vpredictions = {
		"class1": '',
		"class2": '',
		"prob1":0,
		"prob2":0,
	}
	if (mpredictions != '') {
		var mpredictionsconverted = mpredictions.replace(/&#39;/ig,'"');
		vpredictions = JSON.parse(mpredictionsconverted);
	}

	setTimeout(function(){	
		var vpredictresult = vpredictions.class1;
		//var vuploadedimg = vpredictions.image64;
		//$('#uploadedimg').attr('src, vuploadedimg);
		//alert(vpredictresult);
		var vfilename = vpredictions.upload_filename;
		//$('#uploadfile').attr('src',"{{ url_for('static',filename='uploads/"+vfilename+"') }}", );
		$('#uploadfile').attr('src',"../static/uploads/"+vfilename);
		//## search wiki and display result
		searchAndDisplayWiki(vpredictresult);
		//## display more detail
		displaymoredetail(vpredictresult)
		
	}, 200);
});

//## search wiki and display result
function searchAndDisplayWiki(_vpredictresult) {
	var vdata = '';
	//## get wiki list with predicted result
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
					//## search wiki Content with first result
					searchWikiContent(vfirstresult);
				}
			});
					
			
		},
		error: function (xhr, textStatus, errorThrown) {
			vdata = textStatus;
		}
	});
	return vdata;
}

//## search wiki Content
function searchWikiContent(_firstresult) {
	$.ajax({
		type: "GET",
		//url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + _firstresult + "&callback=?&",
		url: " https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=" + _firstresult + "&callback=?&",
		contentType: "application/json; charset=utf-8",
		async: false,
		dataType: "json",
		success: function (data, textStatus, jqXHR) {

			var vpages = data.query.pages;
			
			$.each(vpages, function (ind, obj) {
				var veachpageextract = obj.extract;
				$('#wikidescription').html(veachpageextract)
			});
			/*
			for (var veachpage in vpages) {
				var veachpageinfo = veachpage;
			}
			//var vpage = eval('data.query.pages.' + vpageid + '.extract');
			//var markup = data.parse.text["*"];
			console.log(markup);
			var num_revisions = data.query.pages[pageId].revisions.length;
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
			*/
		},
		error: function (errorMessage) {
			alert(errorMessage);
		}
	});
}

//## display wiki result with first result
function displayWiki(apiResult){
	for (var i = 0; i < apiResult.query.search.length; i++){
		$('#wikidescription').append('<p>'+apiResult.query.search[i].title+'</p>');
	}
}

//## display more detail
function displaymoredetail(vpredictresult) {
	
	//## append table to respective placeholder
	var vingredienthtml = $("<div />").append($('.ingredienttbl.' + vpredictresult.toLowerCase()).clone()).html();
	$('#ph_ingredient').append(vingredienthtml);
	var vreceipehtml = $("<div />").append($('.receipetbl.' + vpredictresult.toLowerCase()).clone()).html();
	$('#ph_receipe').append(vreceipehtml);
	
	//## display button for user to click
	$('.moredetailbtn').removeClass('hidectrl');
}

function onclick_Ingredient(_this) {
	//## hide Receipe Button
	$('button.receipe').addClass('hidectrl');
	//## show Ingredient Button
	$('button.ingredient').removeClass('hidectrl');	
}

function onclick_Receipe(_this) {
	//## hide Ingredient Button
	$('button.ingredient').addClass('hidectrl');
	//## show Receipe Button
	$('button.receipe').removeClass('hidectrl');
}

function onclick_submit(_this) {
	var swal_html = constructCheckedIngredient();
	if (swal_html != null && swal_html != '') {
		Swal.fire({
				title:"Submit to Order?", 
				html: swal_html,
				showDenyButton: true,
				showCancelButton: false,
				confirmButtonText: 'Submit',
				denyButtonText: 'Cancel'
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.fire({
							title:"Order had been submitted!", 
							html: "Thank you",
							icon: 'success',
							showDenyButton: false,
							showCancelButton: false,
							confirmButtonText: 'OK',
							denyButtonText: ''
						}).then((result) => {
							//## clear checked ingredient
							clearCheckedIngredient();
						})
				} else if (result.isDenied) {
					//Swal.fire('Changes are not saved', '', 'info')
				}
			})
	}
	else {
		Swal.fire({
				title:"No selection had been made!", 
				html: "Click close and make your selection.",
				icon: 'error',
				showDenyButton: false,
				showCancelButton: false,
				confirmButtonText: 'Close',
				denyButtonText: ''
			});
	}
}

function onclick_export(_this) {
	Swal.fire({
			title:"Export to PDF?", 
			html: '',
			showDenyButton: true,
			showCancelButton: false,
			confirmButtonText: 'Export',
			denyButtonText: 'Cancel'
		}).then((result) => {
			if (result.isConfirmed) {
				var vtableCtrlId = '';
				$('.detailrow').find('.foodcollapse').each(function (colind, colobj) {
					if ($(colobj).hasClass('show') == true) {
						vtableCtrlId = $(colobj).find('table').attr('id');
						// exit loop
						return false;
					}
				});
				
				createPDF($('#' + vtableCtrlId)[0]);
			} else if (result.isDenied) {
				//Swal.fire('Changes are not saved', '', 'info')
			}
		})	
}

//## construct table  for checked ingredient
function constructCheckedIngredient() {
	//## Loop Ingredient Table	
	var vsummarytable = `<table class="table table-bordered table-striped summarytbl" style="width:100%">
							<thead>
								<tr>
									<td>No.</td>
									<td>Ingredient</td>
									<td>Price</td>
								</tr>
							</thead>
							<tbody>`;
	var vrowno = 1;						
	var vtotalPrice = 0;
	$('#ph_ingredient .ingredienttbl').find('tbody tr').each(function (trindex, trrow) {
		var vischecked = $(trrow).find('.checkbox').is(':checked');
		if (vischecked == true) {
			var vIngredient = $(trrow).find("td:eq(1)").text();
			var vPrice = $(trrow).find("td:eq(4)").text();
			vtotalPrice += parseFloat(vPrice);
			//## concat row
			vsummarytable += `<tr>
									<td>`+vrowno+`</td>
									<td>`+vIngredient+`</td>
									<td>`+parseFloat(vPrice).toFixed(2)+`</td>
								</tr>`;
			
			//## increment row no
			vrowno = vrowno + 1;
		}
	});	
	//## concat total Amount row
	vsummarytable += `</tbody>
					<tfoot>
						<tr>
							<td colspan='2' class='totalamount'>Total Amount</td>
							<td>`+parseFloat(vtotalPrice).toFixed(2)+`</td>
						</tr>
					</tfoot>
				</table>`;
	
	if (vtotalPrice == 0) {
		vsummarytable = '';
	}
	return vsummarytable;					
}

//## clear checked ingredient
function clearCheckedIngredient() {
	//## Loop Ingredient Table
	$('#ph_ingredient .ingredienttbl').find('tbody tr').each(function (trindex, trrow) {
		var vischecked = $(trrow).find('.checkbox').is(':checked');
		if (vischecked == true) {
			$(trrow).find('.checkbox').prop( "checked", false );
		}
	});						
}

//## create PDF
function createPDF(_tableCtrl) {
	html2canvas(_tableCtrl, {
		onrendered: function (canvas) {
			var data = canvas.toDataURL();
			var docDefinition = {
				content: [{
					image: data,
					width: 500
				}]
			};
			pdfMake.createPdf(docDefinition).download("download.pdf");
		}
	});
}
