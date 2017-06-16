/**
 * Created by xueyingchen.
 */
const request = require('superagent');

class HttpException extends Error {
  constructor(error, url) {
    const {message, status, statusType} = error;
    super(message);
    this.status = status;
    this.statusType = statusType;
    this.url = url;
  }
}

class BaseXhr {
  constructor({baseUrl, token = null}, ...features) {
    this.baseUrl = baseUrl;
    this.credentials = (token !== null && token.length > 0) ? `token ${token}` : null;
    this.headers = {
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3.full+json",
      "Authorization": this.credentials
    };

    return Object.assign(this, ...features);
  }

  baseXhr = (errHandler) => ({path, data = null, method = 'GET'}) => {
    const url = this.baseUrl + path;
    const headers = this.headers;
    return new Promise((resolve, reject) => {
      request(method, url)
        .set(headers)
        .send(data)
        .on('error', err => reject(new HttpException(err, url)))
        .end(res => {
          if (res.statusType < 4)
            resolve(res.body);
          else
            reject(new HttpException({
              message: `HttpException[${method}]`,
              status: res.status,
              statusType: res.statusType
            }, url))
        })
    }).catch(errHandler)
  };

  enhancedXhr = this.baseXhr(exception => {
    throw exception;
  });

  httpGet = (path) => this.enhancedXhr({path});

  httpPost = (path, data) => this.enhancedXhr({path, method: "POST", data});

  httpPut = (path, data) => this.enhancedXhr({path, method: "PUT", data});

  httpDel = (path) => this.enhancedXhr({path, method: "DELETE"});
}