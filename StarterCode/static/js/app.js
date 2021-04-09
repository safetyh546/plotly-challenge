// load json
d3.json("samples.json").then(function(data){ 
    console.log('Test 1')
    console.log(data)

   // var names = unpack(data.names.data, 0);
    var names = data[0].names;

    console.log(names)

    var dropdown = d3.select("#selDataset");


    //loop through names and add to dropdown
    names.forEach((item) => 
    {
        //append dropdown
        dropdown.append("option").text(item);
    });

    //------------------------------------------------------------------------- 
    //run function when dropdown changes
     dropdown.on("change", function(optionChanged){
        var inputValue= dropdown.property("value");
        console.log(inputValue)
        var inputValueData = data[0].samples.filter(item => item.id === inputValue);
        console.log(inputValueData);


            //create lists for the first 10 of selected subject ID
            var top10_OTUIDs = [];
            inputValueData[0].otu_ids.slice(0,10).forEach(item => {
                var substring = top10_OTUIDs.push(`OTU ${item}`)
            });
    
            console.log(top10_OTUIDs)
    
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
             y: top10_OTUIDs,
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
            
            Plotly.newPlot('bubble',bubbleChartData, bubbleChartLayout);



    });

});