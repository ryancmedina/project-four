//import jsonData from './neows_clusters.csv';
const csvData = await importCSV('/Resources/neo_predictions.csv');

async function importCSV(file) 
{
  try {
    const response = await fetch(file);
    const text = await response.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',');

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      if (currentLine.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].trim()] = currentLine[j].trim();
        }
        data.push(obj);
      }
    }
    return data;
  } catch (error) {
    console.error('Error reading the CSV file:', error);
    return [];
  }
}

function makeChart()
{
  let x_marks = csvData.map(item => item.estimated_diameter_km_min);
  let y_marks = csvData.map(item => item.relative_velocity_kph);
  let names = csvData.map(item => item.Name);
  let colors = csvData.map(item => item.cluster)

  let trace  ={
    x: x_marks,
    y: y_marks,
    text: names,
    type: "scatter",
    mode: "markers",
    marker: {
      size: 10,
      color: colors,
      hovertemplate: "h"
    },
    hoverinfo: "text"
  }

  let scatter = [trace];

  let layout = {
    title: "Velocity vs Diameter of Asteroids Near Earth",
    xaxis: {
      title : "Estimated Max Diameter (KM)"
      //range: [0, 130000]
    },
    yaxis: {
      title: "Relative Velocity (Kph) "
      //range: [0, 1.5]
    },
    height: 800,
    hovermode : "closest"
  }

  Plotly.newPlot("plot", scatter, layout);

}

function displayStats(cluster)
{
  //console.log(csvData[0])
  let avg_absmag = 0;
  let x = 0;

  for(let i = 0; i < csvData.length; i++)
  {
    if(csvData[i].cluster == cluster)
    {
      avg_absmag += parseFloat(csvData[i].absolute_magnitude_h);
      //console.log(avg_absmag);
      x += 1;
    }
  }
  avg_absmag = avg_absmag/x;

  console.log(avg_absmag);
}

function numberChanged()
{
  displayStats(c)
}

function init()
{
  let dropdown = d3.select("#cluster");
  dropdown.append("option").text("Cluster 1")
  dropdown.append("option").text("Cluster 2")
  dropdown.append("option").text("Cluster 3")
  dropdown.append("option").text("Cluster 4")
  dropdown.append("option").text("Cluster 5")
  
  console.log(csvData);
  makeChart();
  displayStats();
}

init();