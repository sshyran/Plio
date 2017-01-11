import { WebApp } from 'meteor/webapp';
import { readFile } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { _ } from 'meteor/underscore';
import url from 'url';
import checksum from 'checksum';

WebApp.connectHandlers.use('/export', (req, res) => {
  const reqUrl = url.parse(req.url, true);
  const fileName = _.last(reqUrl.pathname.split('/'));

  const queryData = reqUrl.query;
  const filePath = join(tmpdir(), fileName);

  return readFile(filePath, (error, result) => {
    if (error) {
      res.writeHead(200, { 'Content-type': 'application/json' });
      return res.end(JSON.stringify(error));
    }

    const fileChecksum = checksum(result);

    if (fileChecksum !== queryData.token) {
      res.writeHead(200, { 'Content-type': 'application/json' });
      return res.end(JSON.stringify({
        fileChecksum,
        token: queryData.token,
      }));
      // res.writeHead(400);
      // return res.end('The file is corrupted. Please, try export data again.');
    }

    res.writeHead(200, { 'Content-type': 'text/csv' });
    return res.end(result);
  });
});
