let data_url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Calling in the data
function buildData() {
    d3.json(data_url).then((data) => {
    console.log(data);
    let metadata = data.metadata;
    console.log(metadata)
    let samples = data.samples;
    console.log(samples)
    let names = data.names;
    console.log(names)
  })
}
//  Creating a function to allow users to manipulate the panel and a for loop to clear the data
function buildMetaData(sample) {
  d3.json(data_url).then((data) => {
    let metadata = data.metadata;
    let result = metadata.filter(sampeObj => sampeObj.id == sample)[0];

    let panel = d3.select("#sample-metadata");
    panel.html("")
    for (key in result) {
      panel.append("h6").text(`${key}: ${result[key]}`);
    }
    
  })
}
// Setting the data for the charts
function buildCharts(sample) {
    d3.json(data_url).then((data) => {
      let samples = data.samples;
      let result = samples.filter(sampeObj => sampeObj.id == sample)[0];
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;

      // Creating a Bubble Chart
      let bubbleLayout = {
        title: "Amount of Bacteria Types Found",
        xaxis: {
          title: 'OTU ID'
        }
        };

      let bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids
          }
        }
      ];

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

      // Creating a Bar Chart
      let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse()
      let barData = [
        {
            y: yticks,
            x: sample_values.slice(0,10).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: 'h'
        }
       
      ];
    
      let layout = {
        title: "Bacteria Found",
        margin: {t: 30, l: 150 }
      };
    
      Plotly.newPlot("bar", barData, layout);
    });
  }

function init() {
    let selector = d3.select("#selDataset");

    d3.json(data_url).then((data) => {
        let sampleNames = data.names;

        for (i = 0; i < sampleNames.length; i++) {
          selector
            .append("option")
            .text(sampleNames[i])
            .property("values", sampleNames[i]);
        };
        
        let firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetaData(firstSample);
    });
}    
// Create a change the information displayed when choosing another 
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetaData(newSample);
}

init();
