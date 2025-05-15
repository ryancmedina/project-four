const csvData = await importCSV('/Resources/neo_predictions.csv');
let dropdown = d3.select("#cluster");
let dropdown2 = d3.select("#type");

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

function demo()
{
  let x_marks = csvData.map(item => item.dm_max);
  let y_marks = csvData.map(item => item.vel);
  let names = csvData.map(item => item.Name);

  let trace  ={
    x: x_marks,
    y: y_marks,
    text: names,
    type: "scatter",
    mode: "markers",
    marker: {
      size: 10,
      color: "red",
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

  Plotly.newPlot("demo", scatter, layout);
}

function makeChart()
{
  let x_marks = csvData.map(item => item.estimated_diameter_km_min);
  let y_marks = csvData.map(item => item.relative_velocity_kph);
  let names = csvData.map(item => item.Name);
  let clusters = csvData.map(item => item.cluster);
  let text = []
  let colors = [];

  for(let i = 0; i < clusters.length; i++)
  {
    if(clusters[i] == 0)
    {
      colors.push("red");
    }
    else if(clusters[i] == 1)
    {
      colors.push("orange");
    }
    else if(clusters[i] == 2)
    {
      colors.push("yellow");
    }
    else if(clusters[i] == 3)
    {
      colors.push("purple");
    }
    else
    {
      colors.push("pink");
    }
  }

  for (let i = 0; i < names.length; i++)
  {
    text.push("Name: " + names[i] + "\nCluster: " + clusters[i]);
  }

  let trace  ={
    x: x_marks,
    y: y_marks,
    text: text,
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
      title : "Estimated Max Diameter (Scaled)"
      //range: [0, 130000]
    },
    yaxis: {
      title: "Relative Velocity (Scaled) "
      //range: [0, 1.5]
    },
    height: 800,
    hovermode : "closest"
  }

  Plotly.newPlot("plot", scatter, layout);

}

function displayStats(cluster, dataset)
{
  let mean = 0;
  let x = 0;
  let c = parseInt(cluster.charAt(8));
  let d = [];
  let unit = "KM";
  let sorted = [];
  let clusterData = [];
  let median = 0;
  let vari = 0;

  if(dataset == "Absolute Magnitude (H)")
  {
    d = csvData.map(item => item.mag);
    unit = "H";
  }
  else if(dataset == "Minimum Estimated Diameter (KM)")
  {
    d = csvData.map(item => item.dm_min);
  }
  else if(dataset == "Maximum Estimated Diameter (KM)")
  {
    d = csvData.map(item => item.dm_max);
  }
  else if(dataset == "Relative Velocity (KPH)")
  {
    d = csvData.map(item => item.vel);
    unit = "KPH"
  }
  else
  {
    d = csvData.map(item => item.miss);
  }

  for(let i = 0; i < d.length; i++)
  {
    if(csvData[i].cluster == c)
    {
      mean += parseFloat(d[i]);
      clusterData.push(parseFloat(d[i]))
      x += 1;
    }
  }
  mean = mean/x;

  
  sorted = clusterData.sort((a, b) => a - b);
  if(c == 2)
  {
    median = clusterData[0];
  }
  else if(clusterData.length % 2 == 0)
  {
    median = sorted[parseInt(sorted.length / 2)];
  }
  else
  {
    median = (sorted[(Math.floor(clusterData.length / 2)) - 1] + sorted[(Math.floor(clusterData.length / 2))]) / 2
  }

  for(let i = 0; i < clusterData.length; i++)
  { 
    vari += ((clusterData[i] - mean) ** 2);
  }
  
  vari = vari / clusterData.length;

  let stdev = Math.sqrt(vari);

  d3.select("#mean").text("Mean: " + mean.toFixed(2) + " " + unit);
  d3.select("#median").text("Median: " + median.toFixed(2) + " " + unit);
  d3.select("#var").text("Variance: " + vari.toFixed(2));
  d3.select("#stdev").text("Standard Deviation: " + stdev.toFixed(2));
}

function init()
{
  dropdown.append("option").text("Cluster 0 (Red)");
  dropdown.append("option").text("Cluster 1 (Orange)");
  dropdown.append("option").text("Cluster 2 (Yellow)");
  dropdown.append("option").text("Cluster 3 (Purple)");
  dropdown.append("option").text("Cluster 4 (Pink)");
  
  dropdown2.append("option").text("Absolute Magnitude (H)");
  dropdown2.append("option").text("Minimum Estimated Diameter (KM)");
  dropdown2.append("option").text("Maximum Estimated Diameter (KM)");
  dropdown2.append("option").text("Relative Velocity (KPH)");
  dropdown2.append("option").text("Miss Distance (KM)");

  console.log(csvData);
  demo();
  makeChart();
  displayStats("Cluster 0", "Absolute Magnitude (H)");
}

function numberChanged()
{
  displayStats(dropdown.property("value"), dropdown2.property("value"));
}

function dataChanged()
{
  displayStats(dropdown.property("value"), dropdown2.property("value"));
}

init();

d3.selectAll("#cluster").on("change", numberChanged);
d3.selectAll("#type").on("change", dataChanged);