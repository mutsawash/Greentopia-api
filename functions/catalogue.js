const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const sheetId = '1xLhW9E7yjqIqiOACIj5UZK_X2XpbnA5xiGty2KiV8R4';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    const res = await fetch(url);
    const text = await res.text();

    // Clean up Google Sheets JSON response
    const json = JSON.parse(text.substring(47).slice(0, -2));

    // Map rows into array of objects
    const headers = json.table.cols.map(c => c.label);
    const rows = json.table.rows.map(r => {
      let obj = {};
      r.c.forEach((cell, i) => {
        obj[headers[i]] = cell ? cell.v : null;
      });
      return obj;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
      headers: { "Content-Type": "application/json" }
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
