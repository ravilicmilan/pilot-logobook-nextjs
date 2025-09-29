export function printContent(elements) {
  let divToPrint = document.getElementById('logbook-table');
  let htmlToPrint = `
    <style type="text/css">
      #header,
      #button-wrapper,
      #pagination-wrapper,
      #search-params-wrapper,
      #logbook-table th:nth-child(1),
      #logbook-table .td-action:nth-child(1),
      #row-total td:nth-child(1),
      #row-subtotal td:nth-child(1),
      .td_action {
        display: none !important;
      }
      body {
        overflow-x: hidden;
        font-family: Arial;
      }
      #table-wrapper {
        overflow-x: hidden;
      }
      table {
        border: 1px inset #333;
        border-collapse: collapse;
      }
      table th, table td {
        border: 1px inset #333;
        color: #333;
        border-collapse: collapse;
        border-spacing: 0;
        font-size: 10px;
        text-align: center;
      }
      table td {
        padding: 10px 0;
      }
      .td_date {
        min-width: 65px !important;
      }
      #row-total td, #row-subtotal td {
        font-weight: bold;
      }
    </style>
  `;

  let additionalStyles = `<style>`;

  elements.forEach((element) => {
    if (!element.checked) {
      const { key } = element;
      additionalStyles += `.td_${key}, .th_${key}, .subtotal_${key}, .total_${key} { display: none !important; } `;
    }
  });

  additionalStyles += `</style> `;

  htmlToPrint += additionalStyles;
  htmlToPrint += divToPrint.outerHTML;
  const newWin = window.open('');
  newWin.document.body.innerHTML = htmlToPrint;
  newWin.print();
  newWin.close();
}
