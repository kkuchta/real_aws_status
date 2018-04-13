const cheerio = require('cheerio');

const NOTHING_WRONG_IMAGE = 'status0.gif';

function tables(doc) {
  return doc('#current_events_block table.fullWidth tbody');
}

// Ditch any rows in this table that say the service is operating normally.
function removeHappiness(doc, table) {
  table.find('tr').each((_, row) => {
    const image = doc(row).find('img')[0];
    if (image.attribs.src.indexOf(NOTHING_WRONG_IMAGE) > -1) {
      row = doc(row)
      const statusNode = doc(row.find('td')[2]);
      if (statusNode && statusNode.text().toLowerCase().indexOf('service is operating normally') == 0) {
        row.remove();
      }
    }
  });
}

// Process the given html page and return the modified one.
module.exports = (pageBody) => {
  const doc = cheerio.load(pageBody)

  tables(doc).each((_, table) => {
    removeHappiness(doc, doc(table));
  });

  pageBody = doc.html();
  return pageBody;
};
