const cheerio = require('cheerio');

const NOTHING_WRONG_IMAGE = 'status0.gif';

function tables(doc) {
  return doc('#current_events_block table.fullWidth tbody');
}

// Ditch any rows in this table that say the service is operating normally and
// increment any other rows
function removeHappiness(doc, table) {
  table.find('tr').each((_, row) => {
    const image = doc(row).find('img')[0];
    if (image.attribs.src.indexOf(NOTHING_WRONG_IMAGE) > -1) {
      row = doc(row)
      const statusNode = doc(row.find('td')[2]);
      if (statusNode && statusNode.text().toLowerCase().indexOf('service is operating normally') == 0) {
        row.remove();
      } else {
        image.attribs.src = image.attribs.src.replace('status2', 'status3');
        image.attribs.src = image.attribs.src.replace('status1', 'status2');
        image.attribs.src = image.attribs.src.replace('status0', 'status1');
      }
    }
  });
}

function addAds(doc) {
  doc('head').append(`
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "ca-pub-8670872531276606",
        enable_page_level_ads: true
      });
    </script>
    `);
}

// Process the given html page and return the modified one.
module.exports = (pageBody) => {
  const doc = cheerio.load(pageBody);

  addAds(doc);

  tables(doc).each((_, table) => {
    table = doc(table)
    removeHappiness(doc, table);
    if (table.find('tr').length == 0) {
      table.remove();
    }
  });

  pageBody = doc.html();
  return pageBody;
};
