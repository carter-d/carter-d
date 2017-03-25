
//define width, height, and margins
var width,height;

var margin = {top: 20, bottom: 20, left: 50, right: 20}
    ,   width = 1300 - margin.left - margin.right
    ,   height = 700 - margin.top - margin.bottom;


//create a tool tip for displaying stream name, timestep, and data
var toolTip = d3.select(".toolTip");
toolTip.append("div")
    .attr("class", "info");

var info = d3.select(".info");


function makeStream(filename){

	var canvas = d3.select("body")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	var keys = [];

	d3.csv(filename, function(data){
		keys = d3.keys(data[0]).slice(); // copy array of keys
		keys.splice(0,1);				 // remove first element from array (Year)
		


		//create new stack layout
		var layers = d3.stack()
			.order(d3.stackOrderInsideOut)
			.offset(d3.stackOffsetWiggle)
			.keys(keys)(data);


		//calculate min / max values for x (year) and y (num homicides)
		var minX = d3.min(data, function(d){
			return d.Year;
		});

	 	var maxX = d3.max(data, function(d){
	 		return d.Year;
	 	});

		var maxY = d3.max(data, function(d){
			var total = 0;
			total = parseFloat(d["Connecticut"]) + parseFloat(d["Maine"]) + parseFloat(d["Massachusetts"]) + parseFloat(d["New Hampshire"]) + parseFloat(d["Rhode Island"]) + parseFloat(d["Vermont"]);
			return total;
		});	
	
		// x and y scales for the streams and axis
		var yScale = d3.scaleLinear()
		        .range([height-(height/4), 0])
		        .domain([0, maxY+(maxY/4)]);

		var xScale = d3.scaleLinear()
				.range([margin.left,width-margin.right])
				.domain([minX, maxX]);


		//this scale is used to calculate year based on an x position. used in the tooltip
		var xScaleReverse = d3.scaleLinear()
				.range([minX, maxX])
				.domain([margin.left,width-margin.right]);


		var area = d3.area()
			.curve(d3.curveCatmullRom)
			.x(function(d) {  return xScale(d.data.Year);})
			.y1(function(d) { return yScale(d[1]);})
			.y0(function(d){  return yScale(d[0]);});
			
			
		// I define my own color scheme, but if there are more categories than the initial six this is used to color the additional streams
		var colorScale = d3.scaleOrdinal(d3.schemeCategory20);


		//add g elements for each of the streams. each element is also given a class according to its name
		var states = canvas.selectAll(".state")
			.data(layers)
			.enter()
			.append("g")
			.attr("class", function(d){
				var noSpaceKey = d.key;
				noSpaceKey = noSpaceKey.replace(/\s+/g, '');
				return "state " + noSpaceKey;});

		// add paths
		states.append("path")
			.attr("fill", function(d) {
				if(d.key === "Connecticut"){
					return "#093145";
				} else if( d.key === "Maine"){
					return "#107896";
				} else if( d.key === "Massachusetts"){
					return "#829356";
				} else if( d.key === "New Hampshire"){
					return "#BCA136";
				} else if (d.key === "Rhode Island"){
					return "#C2571A";
				} else if (d.key === "Vermont"){
					return "#9A2617";
				} else{
					return colorScale(d.key);
				}
			})

			.attr("d", area)

			// populate and display tooltip
			.on("mouseover", function(d){

				var selectedState = d.key;
				var currentYear = Math.round(xScaleReverse(d3.event.pageX));

				var entryFound = data.filter(function (obj){
					return obj.Year == currentYear;
				})[0];

				var timeStepValue = entryFound[selectedState];
				currentYear = Math.round(xScaleReverse(d3.event.pageX));
				info.html(""+selectedState + ", " + currentYear + ", " + timeStepValue)
					.style("color", "black");

				toolTip.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 27) + "px")
					.style("opacity", 1);

				//reduce opacity of all streams except stream mouse is hovering over to give selection effect
				var i;
				for(i=0; i<keys.length; ++i){
					var noSpaceKey = keys[i];
					noSpaceKey = noSpaceKey.replace(/\s+/g, '');
					if(keys[i] !== d.key){
						d3.select("."+noSpaceKey).style("opacity", .4);
					}
				}

			})

			// functionally the same as mouseover. just used to update tooltip placement / values
			.on("mousemove",function(d){

				var selectedState = ""+d.key;

				var currentYear = Math.round(xScaleReverse(d3.event.pageX));

				var entryFound = data.filter(function (obj){
					return obj.Year == currentYear;
				})[0];

				var timeStepValue = entryFound[selectedState];
				currentYear = Math.round(xScaleReverse(d3.event.pageX));
				info.html(""+selectedState + ", " + currentYear + ", " + timeStepValue)
					.style("color", "black");

				toolTip.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 27) + "px")
					.style("opacity", 1);

				//reduce opacity of all streams except stream mouse is hovering over to give selection effect
				var i;
				for(i=0; i<keys.length; ++i){
					var noSpaceKey = keys[i];
					noSpaceKey = noSpaceKey.replace(/\s+/g, '');
					if(keys[i] !== d.key){
						d3.select("."+noSpaceKey).style("opacity", .4);
					}
				}

			})

			.on("mouseout", function(d){
				toolTip.style("opacity", 0);

				//change all streams back to full opacity
				var i;
				for(i=0; i<keys.length; ++i){
					var noSpaceKey = keys[i];
					noSpaceKey = noSpaceKey.replace(/\s+/g, '');
					d3.select("."+noSpaceKey).style("opacity", 1);	
				}
			});


		//x axis
		canvas.append("g")
			//.data(layers)
			.attr("class", "axis")
			.attr("transform", "translate (0,"+ (height-(height/10))+")")
			.call(d3.axisBottom(xScale)
				.tickFormat(d3.format("d")));

		//y axis
		canvas.append("g")
			.attr("transform", "translate (" + margin.left +","+ height/6.7+")")
			.call(d3.axisLeft(yScale));
	 });
}


makeStream("new_england_homicide_by_year.csv");