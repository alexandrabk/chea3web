////meanRank bar graph
function parseMeanRankLibraries(nr_tfs){

	var toptfsdat = chea3Results["Integrated--meanRank"].slice(0,nr_tfs);
	var tfs = toptfsdat.map(function(x){return x["TF"]})
	//var libinfo = toptfs[i]["Library"].split(";")
	var libs = Object.keys(chea3Results).map(function(x){return x.replace("--"," ");});
	libs = libs.slice(2,libs.length)
	var datasets = [];
	
	//loop through library names
	for(i=0; i< libs.length; i++){
		
		//loop through toptfs 
		var ranks = Array(tfs.length).fill(null);
		
		for(j = 0; j < tfs.length; j++){
			var ranksinfo = toptfsdat[j]["Library"].split(";").map(function(x){return x.split(",")})
			
			//ranks to weighted contribution to mean
			var c = ranksinfo.length;
			
			//loop through each contributing rank
			for(k = 0; k<ranksinfo.length; k++){
				if(ranksinfo[k][0] == libs[i]){
					// console.log(ranksinfo[k][0])
					ranks[j] = ranks[j] + ranksinfo[k][1]/c;
					// console.log(ranks[j])
				
				}
			}
		}
		// console.log(ranks)
		datasets[i] = {label: libs[i],
				data: ranks,
				backgroundColor: Array(ranks.length).fill(colorArray[i]),
				borderWidth: 1}
				
				
	}
	var data = {
			labels: tfs,
			datasets: datasets
	}	
	
	return(data);
}

function parseLibrary(library, nr_tfs) {
	var process_score = library === 'Integrated--topRank' ? function (x) { return x['Score'] } : function (x) { return -Math.log10(x['FET p-value']) },
		results = chea3Results[library].slice(0, nr_tfs),
		data = {
			labels: results.map(function(x) { return x['TF'] }),
			datasets: [{
				label: library,
				data: results.map(process_score),
				backgroundColor: getColor('colorpicker'),
				borderWidth: 1
			}]
		}
	return data
}

function generateBarChart(){

	$('#nav-barchart').html('<canvas id="barchart" width="400" height="200"></canvas>');
	var ctx = document.getElementById('barchart').getContext('2d'),
		library = $('#library-selectpicker').val(),
		nr_tfs = $('#tf-slider').val();
	
	if (library === "Integrated--meanRank") {

		var data = parseMeanRankLibraries(nr_tfs);
		// console.log(data);

		new Chart(ctx, {
			type: 'horizontalBar',
			
			data: data,
			options: {
				title: {
					display: true,
					text: "Weighted Library Contribution to Integrated MeanRank TF Ranks",
				},
				scales: {
					xAxes: [{
						stacked: true
					}],
					yAxes: [{
						stacked: true
					}]
				}
			}
		});

	} else {

		var data = parseLibrary(library, nr_tfs);
		// console.log(data);

		new Chart(ctx, {
			type: 'horizontalBar',
			data: data,
			options: {
				title: {
					display: true,
					text: library,
				}
			}
		});
	}
	
}



function renderBarChartPopoverButton(){
	return `<button id = "barchartpopover" type="button" class="btn btn-link display-7" title = "Library Contribution to Integrated meanRank Ranks" data-toggle="popover" style="display:inline;float:right;padding:0;margin-right:0;margin-left:5;color:#28a0c9;font-size:50%" data-placement="left">Bar Chart</button>`;
}