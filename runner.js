const func = require('./functions/get_status_page/index.js');
process.chdir('functions/get_status_page');
global.isLocal = true;
const e = {
  Records: [
    { cf: {
      request: {
        uri: '/'
      }
    } }
  ]
}
func.handle(e, 0, (first, result) => {
  console.log("result = ", result);
});
