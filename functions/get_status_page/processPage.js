const cheerio = require('cheerio');

const NOTHING_WRONG_IMAGE = 'status0.gif';

function tables(doc) {
  return doc('#current_events_block table.fullWidth tbody');
}

function removeHappyRows(doc, table) {
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

module.exports = (pageBody) => {
  const doc = cheerio.load(pageBody)

  tables(doc).each((_, table) => {
    removeHappyRows(doc, doc(table));
  });

  pageBody = doc.html();
  pageBody = pageBody.replace('Current Status', 'Kujo &lt; Ethel');
  return pageBody;
};
