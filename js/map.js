
//define canvas size
var width = 1000;
var height = 1000;
var padding = 20;

var canvas = d3.select(".map")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

// positions of each state in the grid by their abbreviation.
// This is gross, but I'm not sure how to do it without changing the csv file to include location data
// or making an api call to a service that has location data.
var statePositions = {};
statePositions["AL"] = [7,6];
statePositions["AK"] = [.01,.01];
statePositions["AZ"] = [2,5];
statePositions["AR"] = [5,5];
statePositions["CA"] = [1,4];
statePositions["CO"] = [3,4];
statePositions["CT"] = [10,3];
statePositions["DE"] = [9,5];
statePositions["DC"] = [10,4];
statePositions["FL"] = [9,7];
statePositions["GA"] = [8,6];
statePositions["HI"] = [1,7];
statePositions["ID"] = [2,2];
statePositions["IL"] = [6,2];
statePositions["IN"] = [6,3];
statePositions["IA"] = [5,3];
statePositions["KS"] = [4,5];
statePositions["KY"] = [6,4];
statePositions["LA"] = [5,6];
statePositions["ME"] = [11,.01];
statePositions["MD"] = [9,4];
statePositions["MA"] = [11,2];
statePositions["MI"] = [8,2];
statePositions["MN"] = [5,2];
statePositions["MS"] = [6,6];
statePositions["MO"] = [5,4];
statePositions["MT"] = [3,2];
statePositions["NE"] = [4,4];
statePositions["NV"] = [2,3];
statePositions["NH"] = [11,1];
statePositions["NJ"] = [9,3];
statePositions["NM"] = [3,5];
statePositions["NY"] = [9,2];
statePositions["NC"] = [7,5];
statePositions["ND"] = [4,2];
statePositions["OH"] = [7,3];
statePositions["OK"] = [4,6];
statePositions["OR"] = [1,3];
statePositions["PA"] = [8,3];
statePositions["RI"] = [10,2];
statePositions["SC"] = [8,5];
statePositions["SD"] = [4,3];
statePositions["TN"] = [6,5];
statePositions["TX"] = [4,7];
statePositions["UT"] = [2,4];
statePositions["VT"] = [10,1];
statePositions["VA"] = [8,4];
statePositions["WA"] = [1,2];
statePositions["WV"] = [7,4];
statePositions["WI"] = [7,2];
statePositions["WY"] = [3,3];


//draw the legend
var legendColors = ["#67000d", "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272",
					"#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"];

var legendValues = ["50%+", "50% to 40%", "40% to 30%", "30% to 20%", "20% to 10%", "10% to 0%",
					"0% to 10%", "10% to 20%", "20% to 30%", "30% to 40%", "40% to 50%", "50%+"];
var i;
for(i=0; i<12; ++i){


	canvas.append("rect")
		.attr("x", 100+(i*66.67))
		.attr("y", 500)
		.attr("width", 66.67)
		.attr("height", 20)
		.attr("fill", legendColors[i]);

	canvas.append("text")
		.attr("x", 107+(i*66.67))
		.attr("y", 530)
		.attr("font-family", "arial")
		.attr("font-weight", "bold")
		.attr("font-size", 10)
		.attr("fill", "black")
		.text(legendValues[i]);
}

canvas.append("text")
		.attr("x", 50)
		.attr("y", 515)
		.attr("font-family", "arial")
		.attr("font-weight", "bold")
		.attr("font-size", 10)
		.attr("fill", "black")
		.text("R win %");

canvas.append("text")
		.attr("x", 915)
		.attr("y", 515)
		.attr("font-family", "arial")
		.attr("font-weight", "bold")
		.attr("font-size", 10)
		.attr("fill", "black")
		.text("D win %");


//create necessary divs / headings for tool tip
var toolTip = d3.select(".toolTip");

toolTip.append("h4");

var stateTitle = d3.select("h4");

toolTip.append("div")
	.attr("class", "electoralVotes");

var stateElectoralVotes = d3.select(".electoralVotes");

toolTip.append("div")
	.attr("class", "repCandidate");

var repCandidate = d3.select(".repCandidate");

toolTip.append("div")
	.attr("class", "demCandidate");
	
var demCandidate = d3.select(".demCandidate"); 




//draw map. also update opacity / populate tooltip div on mouseover/mouseout 
d3.csv("election-results.csv", function(data) {

	data.forEach(function(row){

		canvas.append("rect")
			.attr("x", (statePositions[row[""]][0]*80))
			.attr("y", statePositions[row[""]][1]*55)
			.attr("width", 70)
			.attr("height", 45)

			.attr("fill", function() {

				var percentDem = row["% Clinton"];
				var demNum = parseFloat(percentDem.substring(0, percentDem.length - 1));

				var percentRep = row["% Trump"];
				var repNum = parseFloat(percentRep.substring(0, percentRep.length - 1));

				var diff = demNum - repNum;


				if(diff<=0){								//republican (red)
					diff = Math.abs(diff);

					if(diff > 50){
						return "#67000d";

					} else if (diff <= 50 && diff > 40){
						return "#a50f15";

					} else if (diff <= 40 && diff > 30){
						return "#cb181d";

					} else if (diff <= 30 && diff > 20){
						return "#ef3b2c";

					} else if (diff <= 20 && diff > 10){
						return "#fb6a4a";

					} else {
						return "#fc9272";
					}

				} else {

					if(diff > 50){							//democrat(blue)
						return "#08306b";

					} else if (diff <= 50 && diff > 40){
						return "#08519c";

					} else if (diff <= 40 && diff > 30){
						return "#2171b5";

					} else if (diff <= 30 && diff > 20){
						return "#4292c6";

					} else if (diff <= 20 && diff > 10){
						return "#6baed6";

					} else {
						return "#9ecae1";
					}
				}
			})
			.attr("stroke", "black")
			.on("mouseover", function(d){

				var percentDem = row["% Clinton"];
				var demNum = parseFloat(percentDem.substring(0, percentDem.length - 1));

				var percentRep = row["% Trump"];
				var repNum = parseFloat(percentRep.substring(0, percentRep.length - 1));

				var stateHeadingColor = "";

				if(percentRep > percentDem){
					stateHeadingColor = "red";
				} else {
					stateHeadingColor = "blue";
				}
				
				toolTip.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 27) + "px")
					.style("opacity", 1);

				stateTitle.html(row["State or district"])
					.style("color", stateHeadingColor);

				var totalElectoralVotes = parseInt(row["Electoral Votes Clinton"]) + parseInt(row["Electoral Votes Trump"]);
				stateElectoralVotes.html("State Electoral Votes: " + totalElectoralVotes)
					.style("color", "black");

				repCandidate.html("Trump: " + row["# Trump"] + " (" + row["% Trump"] + ")")
					.style("color", "red");

				demCandidate.html("Clinton: " + row["# Clinton"] + " (" + row["% Clinton"] + ")")
					.style("color", "blue");



			})
			.on("mouseout", function(d){
				toolTip.style("opacity", 0);
			});


		canvas.append("text")
			.attr("x", (statePositions[row[""]][0]*80)+22.5)
			.attr("y", (statePositions[row[""]][1]*55)+26)
			.attr("font-family", "arial")
			.attr("font-weight", "bold")
			.style("cursor", "default")
			.attr("fill", "black")
			.text(row[""])
			.on("mouseover", function(d){

				var percentDem = row["% Clinton"];
				var demNum = parseFloat(percentDem.substring(0, percentDem.length - 1));

				var percentRep = row["% Trump"];
				var repNum = parseFloat(percentRep.substring(0, percentRep.length - 1));

				var stateHeadingColor = "";

				if(percentRep > percentDem){
					stateHeadingColor = "red";
				} else {
					stateHeadingColor = "blue";
				}
				
				toolTip.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 27) + "px")
					.style("opacity", 1);

				stateTitle.html(row["State or district"])
					.style("color", stateHeadingColor);

				var totalElectoralVotes = parseInt(row["Electoral Votes Clinton"]) + parseInt(row["Electoral Votes Trump"]);
				stateElectoralVotes.html("State Electoral Votes: " + totalElectoralVotes)
					.style("color", "black");

				repCandidate.html("Trump: " + row["# Trump"] + " (" + row["% Trump"] + ")")
					.style("color", "red");

				demCandidate.html("Clinton: " + row["# Clinton"] + " (" + row["% Clinton"] + ")")
					.style("color", "blue");



			})
			.on("mouseout", function(d){
				toolTip.style("opacity", 0);
			})
		});

});