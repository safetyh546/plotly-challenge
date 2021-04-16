//build caller function that calls all the pieces (demograph info, charts)
function optionChanged(SubjectID) {
    demographInfo(SubjectID)
    BuildBarAndBubble(SubjectID)
    // barPlot(person)
    // buildChart(person)
  }

//load drop down list
//call optionchanged function for first ID to populate on initial page load
d3.json("./data/samples.json").then((data) =>{ 
    console.log('Test 1')
    console.log(data)

    //var names = unpack(data.names.data, 0);
    var names1 = data.names;

    console.log(names1)

    var dropdown = d3.select("#selDataset");


    //loop through names and add to dropdown
    names1.forEach((item) => 
    {
        //append dropdown
        dropdown.append("option").text(item);
    });

    optionChanged("940")

});

//function to load the demograph info box
function demographInfo(SubjectID) {
        d3.json("./data/samples.json").then((data) => {

        var inputValueData = data.samples.filter(item => item.id === SubjectID);
        console.log(inputValueData);

        //----------------------------------------------------------------------
        //select the demographic box
        var Meta = d3.select("#sample-metadata");

        // clear the table 
        Meta.text("");
        
        console.log('right before demograph table')
        //pull just the meta Data from the full data set (sampleData)
        var demographTable = data.metadata.filter(item => item.id === parseInt(SubjectID));
        console.log(demographTable)

        // Append paragraph tags to the demographic info box
        Meta.append('p').text(`id: ${demographTable[0].id}`);
        Meta.append('p').text(`ethnicity: ${demographTable[0].ethnicity}`);
        Meta.append('p').text(`gender: ${demographTable[0].gender}`);
        Meta.append('p').text(`age: ${demographTable[0].age}`);
        Meta.append('p').text(`location: ${demographTable[0].location}`);
        Meta.append('p').text(`bbtype: ${demographTable[0].bbtype}`);
        Meta.append('p').text(`wfreq: ${demographTable[0].wfreq}`);
    });
}


//function build bubble and bar chart
function BuildBarAndBubble(SubjectID) {
        d3.json("./data/samples.json").then((data) => {

        var inputValueData = data.samples.filter(item => item.id === SubjectID);
        console.log(inputValueData);
          //create lists for the first 10 of selected subject ID
            var top10_SubjectIDs = [];
            inputValueData[0].otu_ids.slice(0,10).forEach(item => {
                var substring = top10_SubjectIDs.push(`OTU ${item}`)
            });
    
            console.log(top10_SubjectIDs)
    
            var top10_sampleValues = inputValueData[0].sample_values.slice(0,10);
            console.log(top10_sampleValues)
            
            var top10_OTULabels = inputValueData[0].otu_labels.slice(0,10);
            console.log(top10_OTULabels )
         
         //--------------------------------------------------------------------
         //bar chart
          var BarChartData =
         [{
             type: 'bar',
             x: top10_sampleValues,
             y: top10_SubjectIDs,
             orientation: 'h',
             text: top10_OTULabels,
             mode: 'markers'
         }]
    
         var BarChartLayout =
         { yaxis:{autorange: 'reversed'}};
    
         Plotly.newPlot('bar',BarChartData, BarChartLayout)

        //-------------------------------------------------------------------
        //bubble chart
        
        //list all otu_IDs along x-axis
        var xaxis = inputValueData[0].otu_ids;
        console.log(xaxis);

        var bubbleChartData = 
            [{
                x: xaxis,
                y: top10_sampleValues,
                mode: 'markers',
                text: top10_OTULabels,
                marker: 
                {
                size: top10_sampleValues,
                color: xaxis,
                colorscale: [[0, 'rgb(51, 70, 255)'], [1, 'rgb(66, 255, 51)']]  //0 color is bluish, 1 color is green from https://htmlcolorcodes.com/
                }
            }];
            
            var bubbleChartLayout = 
            {
                showlegend: false,
                height: 600,
                width: 1200,
                xaxis: {title: 'OTU ID'},
                opacity: 0.6
            };
            
            var guage_wfreq = data.metadata.filter(item => item.id === parseInt(SubjectID))[0].wfreq

            Plotly.newPlot('bubble',bubbleChartData, bubbleChartLayout)
            var data1 = [
                {
                  domain: { x: [0, 1], y: [0, 1] },
                  value: guage_wfreq,
                  title: { text: "Wash Frequency Per Individual" },
                  type: "indicator",
                  mode: "gauge+number",
                  delta: { reference: 400 },
                  gauge: { axis: { range: [null, 9] } }
                }
              ];
              
              var layout1 = { width: 600, height: 400 };
              Plotly.newPlot('gauge', data1, layout1);
              console.log(data)


        });

}
 