/* eslint-disable */
import {exception as displayException} from 'core/notification';
import Templates from 'core/templates';
import ChartJS from 'core/chartjs';
import $ from 'jquery';

export const init = (results, a11yresults) => {

  function renderQueueStats() {
    // Create the data for the chart.
    // [0] = text, [1] = language, [3] = layout
    const data = [
      results.scanned.total,
      results.inqueue.total,
      results.notinqueue.total
    ];

    // Create the progress element.
    const elementArray = ['Scanned', 'In Queue', 'Not in Queue'].map((mod, index) => {
      let background;
      if (mod === 'Scanned') {
        background = 'bg-success'
      }
      if (mod === 'In Queue') {
        background = 'bg-secondary'
      }
      if (mod === 'Not in Queue') {
        background = 'bg-warning'
      }
      // layout gets default progressbar

      return `<div class="progress-bar ${background}" role="progressbar" aria-label="${mod}" aria-valuenow="${data[index]}" aria-valuemin="0" aria-valuemax="${results.totalpdfs}" style="width: ${data[index]}%"></div>`;

    })


    const html = `<div class="progress">${elementArray.join(' ').replace(/\n\s+/g, '')}</div>\
      <ul class="list-unstyled">\
      <li class="mb-2 p-1"><strong>${results.totalpdfs} PDFs found</strong></li>\
      <li class="bg-success text-white p-1">${results.scanned.total} PDFs scanned</li>\
      <li class="bg-secondary p-1">${results.inqueue.total} PDFs in queue</li>
      `;

    // Add to DOM
    $('#a11yDetailsProgress').html(html)

  }

//  function renderA11yScanChart() {
//    const canvas = document.querySelector('#a11yScanChart')
//
//    if (!canvas) {
//      throw new Error('Could not find canvas {#a11yRadarChart}')
//    }
//
//    const ctx = canvas.getContext('2d')
//
//    new ChartJS(ctx, {
//      type: 'pie',
//      data: {
//        labels: ['Scanned', 'In queue', 'Not in queue'],
//        datasets: [{
//          label: 'Scan Queue',
//          data: [results.scanned.total, results.inqueue.total, results.notinqueue.total],
//          backgroundColor: ['blue', 'green', 'orange']
//        }],
//      }
//    })
//  }
//
//  function renderA11yDetailsChart() {
//    const canvas = document.querySelector('#a11yRadarChart')
//
//    if (!canvas) {
//      throw new Error('Could not find canvas {#a11yRadarChart}')
//    }
//
//    const ctx = canvas.getContext('2d')
//
//    const chartData = {
//      labels: [
//        'Has Text',
//        'Has Title',
//        'Has Language',
//        'Is Tagged'
//      ],
//      datasets: [{
//        label: 'A11y Breakdown',
//        data: [80, 70, 55, 99],
//        fill: true,
//        backgroundColor: 'rgba(255, 99, 132, 0.2)',
//        borderColor: 'rgb(255, 99, 132)',
//        pointBackgroundColor: 'rgb(255, 99, 132)',
//        pointBorderColor: '#fff',
//        pointHoverBackgroundColor: '#fff',
//        pointHoverBorderColor: 'rgb(255, 99, 132)'
//      }]
//    }
//
//    new ChartJS(ctx, {
//      type: 'radar',
//      data: chartData
//    })
//
//  }

  function renderA11yPieChart() {
    const canvas = document.querySelector('#a11yPieChart')

    if (!canvas) {
      throw new Error('Could not find canvas {#a11yPieChart}')
    }

    const ctx = canvas.getContext('2d')

    const chartData = {
      labels: [`Pass (${a11yresults.pass.total})`, `Warn (${a11yresults.warn.total})`, `Fail (${a11yresults.fail.total})`],
      datasets: [{
        label: 'A11y Check',
        data: [a11yresults.pass.total, a11yresults.warn.total, a11yresults.fail.total],
        backgroundColor: ['#5cb85c', '#f0ad4e', '#d9534f']
      }]
    }
    new ChartJS(ctx, {
      type: 'pie',
      data: chartData
    })
  }

  const context = {
    name: 'A11y Check',
    results: results,
    a11yresults: a11yresults
  };

  // This will call the function to load and render our template.
  Templates.renderForPromise('block_a11y_check/summary', context)
    .then(({ html, js }) => {

      // Render the template.
      Templates.appendNodeContents("#block_a11y_check_root", html, js);

      // Render the charts.
      renderQueueStats()
      renderA11yPieChart()
  })
  // Deal with this exception (Using core/notify exception function is recommended).
  .catch((error) => displayException(error));
};
