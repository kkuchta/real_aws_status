
const https = require('https');
const zlib = require('zlib');
const processPage = require('./processPage')

// A thin promise wrapper around node's http get
const httpGet = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        return resolve([data, response.headers])
      });
    }).on("error", (err) => reject(err));
  });
};

exports.handle = function(e, ctx, cb) {
  const request = e.Records[0].cf.request;

  // If it's not the root page, pass it through
  if (request.uri !== '/') {
    cb(null, request);
  } else {
    httpGet('https://status.aws.amazon.com/').then(([page, headers]) => {
      const bodyRaw = processPage(page);

      // Write to a local file so I can test this without redeploying to lambda.
      // The CSS won't load, but it'll at least display the basic html.
      if (global.isLocal) {
        let fs = require('fs');
        fs.writeFile("/tmp/status.html", bodyRaw, () => {})
      }

      const bodyBuffer = zlib.gzipSync(bodyRaw);
      const base64EncodedBody = bodyBuffer.toString('base64');

      cb(null, {
        body: base64EncodedBody,
        headers: {
          'content-type': [{key:'Content-Type', value: 'text/html; charset=utf-8'}],
          'content-encoding' : [{key:'Content-Encoding', value: 'gzip'}]
        },
        bodyEncoding: 'base64',
        status: 200
      });
    }).catch( (err) => {
      console.log('Got error from status page:', err);
      cb(null, { status: 500 })
    });
  }
}
