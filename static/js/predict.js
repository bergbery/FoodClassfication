var mbuttondisplay = '';
$(document).ready(function () { 
	
	var vpredictions = {
		"class1": '',
		"class2": '',
		"prob1":0,
		"prob2":0,
	}
	if (mpredictions != '{}') {
		var mpredictionsconverted = mpredictions.replace(/&#39;/ig,'"');
		vpredictions = JSON.parse(mpredictionsconverted);
	}
	
	
	var vparams = {
		"_foodtype": '',
		"_buttondisplay": '',
	}
	if (mparams != '{}')  {
		var mparamsconverted = mparams.replace(/&#39;/ig,'"');
		vparams = JSON.parse(mparamsconverted);
	}

	setTimeout(function(){	
		if (mpredictions != '{}') {
		//## using prediction
			var vpredictresult = vpredictions.class1;
			$('.predictedresult').text(vpredictresult);
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
		}
		else {
		//## using pass in
			var vpredictresult = vparams._foodtype;
			mbuttondisplay = vparams._buttondisplay;
			$('.predictedresult').text(vpredictresult);
			//alert(vpredictresult);
			if (vpredictresult.toLowerCase() == 'nasilemak') {				
				//$('#uploadfile').attr('src',"{{ url_for('static',filename='assets/img/portfolio/fullsize/1.jpg') }}", );
				$('#uploadfile').attr('src','../static/assets/img/portfolio/fullsize/1.jpg');
			}
			else if (vpredictresult.toLowerCase() == 'charkwayteow') {
				//$('#uploadfile').attr('src',"{{ url_for('static',filename='assets/img/portfolio/fullsize/2.jpg') }}", );
				$('#uploadfile').attr('src','../static/assets/img/portfolio/fullsize/2.jpg');
			}
			//## search wiki and display result
			searchAndDisplayWiki(vpredictresult);
			//## display more detail
			displaymoredetail(vpredictresult)
		}
		
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
	
	var vingredienthtml = '';	
	$.ajax({
		type: "GET",
		//url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + _firstresult + "&callback=?&",
		url: '/getingredient/?_foodtype='+vpredictresult+'',
		contentType: "application/json; charset=utf-8",
		async: false,
		dataType: "json",
		success: function (data, textStatus, jqXHR) {
			//## construct table for ingredient
			vingredienthtml = constructIngredient(data, vpredictresult);
		},
		error: function (errorMessage) {
			alert(errorMessage);
		}
	});
	var vreceipehtml = '';
	$.ajax({
		type: "GET",
		//url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + _firstresult + "&callback=?&",
		url: '/getrecipe/?_foodtype='+vpredictresult+'',
		contentType: "application/json; charset=utf-8",
		async: false,
		dataType: "json",
		success: function (data, textStatus, jqXHR) {
			//## construct table for recipe
			vreceipehtml = constructRecipe(data, vpredictresult);
		},
		error: function (errorMessage) {
			alert(errorMessage);
		}
	});
	
	
	//## append table to respective placeholder
	//var vingredienthtml = $("<div />").append($('.ingredienttbl.' + vpredictresult.toLowerCase()).clone()).html();
	//var vingredienthtml = vtable;
	$('#ph_ingredient').append(vingredienthtml);
	//var vreceipehtml = $("<div />").append($('.receipetbl.' + vpredictresult.toLowerCase()).clone()).html();
	$('#ph_receipe').append(vreceipehtml);
	
	//## display button for user to click
	$('.moredetailbtn').removeClass('hidectrl');
}

//## construct table for ingredient
function constructIngredient(_data, _predictresult) {
	var vpredictresult =_predictresult.toLowerCase();
	var vingredienttable = '';
	//## mobile screen
    if (window.matchMedia("(max-device-width: 767px)").matches) {
		//## Loop Ingredient Table	
		vingredienttable = `<table class="table table-bordered table-striped ingredienttbl ` + vpredictresult +`" id='ingredient_` + vpredictresult +`' style="width:100%">
								<thead>
									<tr>
										<td>
											Details
										</td>
									</tr>
								</thead>`;
		
		$.each(_data, function (dataindex, dataobj) {
			var vingredient = dataobj.INGREDIENT;
			var vamount = dataobj.AMOUNT;
			var vunit = dataobj.UNIT;
			var vprice = dataobj.PRICE;
			var vlocation = dataobj.LOCATION;
			//## concat row
			vingredienttable += `<tr>
									<td>
										<div><input type="checkbox" class="checkbox" value="1" name="selectingred" /></div>
										<div>Ingredient: <span class='ingredient'>`+vingredient+`</span></div>
										<div>Amount: <span class='amount'>`+parseFloat(vamount)+`</span></div>
										<div>Unit: <span class='unit'>`+vunit+`</span></div>
										<div>Price: <span class='price'>`+parseFloat(vprice).toFixed(2)+`</span></div>
										<div>Location: <span class='location'>`+vlocation+`</span></div>
									</td>
								</tr>`;
				
		});	
		//## concat end row
		vingredienttable += `</tbody>
					</table>`;
	}
	else {	
		//## Loop Ingredient Table	
		vingredienttable = `<table class="table table-bordered table-striped ingredienttbl ` + vpredictresult +`" id='ingredient_` + vpredictresult +`' style="width:100%">
								<thead>
									<tr>
										<td></td>
										<td>Ingredient</td>
										<td>Amount</td>
										<td>Unit</td>
										<td>Price</td>
										<td>Location</td>
									</tr>
								</thead>`;
						
		$.each(_data, function (dataindex, dataobj) {
			var vingredient = dataobj.INGREDIENT;
			var vamount = dataobj.AMOUNT;
			var vunit = dataobj.UNIT;
			var vprice = dataobj.PRICE;
			var vlocation = dataobj.LOCATION;
			//## concat row
			vingredienttable += `<tr>
									<td><input type="checkbox" class="checkbox" value="1" name="selectingred" /></td>
									<td class='ingredient'>`+vingredient+`</td>
									<td class='centernumber amount'>`+parseFloat(vamount)+`</td>								
									<td class='unit'>`+vunit+`</td>
									<td class='centernumber price'>`+parseFloat(vprice).toFixed(2)+`</td>
									<td class='location'>`+vlocation+`</td>
								</tr>`;
				
		});	
		//## concat end row
		vingredienttable += `</tbody>
					</table>`;
	}
	return vingredienttable;					
}

//## construct table for recipe
function constructRecipe(_data, _predictresult) {
	var vpredictresult =_predictresult.toLowerCase();
	//## Loop Ingredient Table	
	var vrecipetable = `<table class="table table-bordered table-striped receipetbl ` + vpredictresult +`" id='receipe_` + vpredictresult +`' style="width:100%">
							<thead>
								<tr>
									<td>Step</td>
									<td>Description</td>
								</tr>
							</thead>`;
					
	$.each(_data, function (dataindex, dataobj) {
		var vstep = dataobj.STEP;
		var vdescription = dataobj.DESCRIPTION;
		//## concat row
		vrecipetable += `<tr>
								<td>`+vstep+`</td>
								<td>`+vdescription+`</td>
							</tr>`;
			
	});	
	//## concat total Amount row
	vrecipetable += `</tbody>
				</table>`;
	
	return vrecipetable;					
}

function onclick_Ingredient(_this) {
	setTimeout(function(){ 
		var vrowcount = 0;
		$('.detailrow').find('.foodcollapse').each(function (foodind, foodrow) {
			if ($(foodrow).hasClass('show') == true) {
				vrowcount = vrowcount + 1;
			}
		});
		if (mbuttondisplay == '' || mbuttondisplay == 'both') {
			if (vrowcount > 0) {
				//## hide Receipe Button
				$('button.receipe').addClass('hidectrl');
				//## show Ingredient Button
				$('button.ingredient').removeClass('hidectrl');	
			}
			else {
				//## hide Receipe Button
				$('button.receipe').addClass('hidectrl');
				//## hide Ingredient Button
				$('button.ingredient').addClass('hidectrl');	
			}
		} 
		else {
			if (vrowcount > 0) {
				//## show respective Button
				$('button.' + mbuttondisplay).removeClass('hidectrl');
			}
			else {
				//## hide respective Button
				$('button.' + mbuttondisplay).addClass('hidectrl');
			}
		}
	
	}, 500);
}

function onclick_Receipe(_this) {
	setTimeout(function(){ 
		var vrowcount = 0;
		$('.detailrow').find('.foodcollapse').each(function (foodind, foodrow) {
			if ($(foodrow).hasClass('show') == true) {
				vrowcount = vrowcount + 1;
			}
		});
		if (mbuttondisplay == '' || mbuttondisplay == 'both') {
			if (vrowcount > 0) {
				//## hide Ingredient Button
				$('button.ingredient').addClass('hidectrl');
				//## show Receipe Button
				$('button.receipe').removeClass('hidectrl');
			}
			else {
				//## hide Ingredient Button
				$('button.ingredient').addClass('hidectrl');
				//## hide Receipe Button
				$('button.receipe').addClass('hidectrl');	
			}
		} 
		else if (mbuttondisplay == 'online') {			
			//## hide only export Button
			$('button.' + mbuttondisplay).addClass('hidectrl');
		}
		else {
			if (vrowcount > 0) {
				//## show only export Button
				$('button.' + mbuttondisplay).removeClass('hidectrl');
			}
			else {
				//## hide only export Button
				$('button.' + mbuttondisplay).addClass('hidectrl');
			}
		}
	}, 500);
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
			//var vIngredient = $(trrow).find("td:eq(1)").text();
			//var vPrice = $(trrow).find("td:eq(4)").text();
			var vIngredient = $(trrow).find(".ingredient").text();
			var vPrice = $(trrow).find(".price").text();
			vtotalPrice += parseFloat(vPrice);
			//## concat row
			vsummarytable += `<tr>
									<td>`+vrowno+`</td>
									<td>`+vIngredient+`</td>
									<td class='centernumber'>`+parseFloat(vPrice).toFixed(2)+`</td>
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
							<td class='centernumber'>`+parseFloat(vtotalPrice).toFixed(2)+`</td>
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
