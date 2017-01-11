import { WebApp } from 'meteor/webapp';
import { readFile } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { _ } from 'meteor/underscore';
import url from 'url';
import { getCreatedFileTime, createMd5Hash } from './helpers';

WebApp.connectHandlers.use('/export', (req, res) => {
  const reqUrl = url.parse(req.url, true);
  const fileName = _.last(reqUrl.pathname.split('/'));

  const queryData = reqUrl.query;
  const filePath = join(tmpdir(), fileName);
  const hash = createMd5Hash(getCreatedFileTime(filePath));

  // function sendNotFound() {
  //   res.writeHead(404);
  //   return res.end('Page not found');
  // }

  if (hash !== queryData.token) {
    res.writeHead(200, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify({
      hash,
      token: queryData.token,
      createdFileTime: getCreatedFileTime(filePath),
    }));
  }

  return readFile(filePath, (error, result) => {
    if (error) {
      res.writeHead(200, { 'Content-type': 'application/json' });
      return res.end(JSON.stringify(error));
    }

    res.writeHead(200, { 'Content-type': 'text/csv' });
    return res.end(result);
  });
});
