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
      "Accept": "application/json",
      "Authorization": this.credentials
    };

    return Object.assign(this, ...features);
  }

  baseXhr(errHandler) {
    return ({path, method = 'GET', data = null}) => {
      const url = this.baseUrl + path;
      const headers = this.headers;
      return new Promise((resolve, reject) => {
        request(method, url)
          .set(headers)
          .send(data)
          .end((err, res) => {
            if (err instanceof Error)
              return reject(new HttpException(err, url));
            if (res.statusType < 4)
              return resolve(res.body);
            else
              return reject(new HttpException({
                message: `HttpException[${method}]`,
                status: res.status,
                statusType: res.statusType
              }, url))
          })
      }).catch(errHandler)
    };
  }

  enhancedXhr(data) {
    return this.baseXhr(exception => {
      console.error(exception);
    })(data);
  }

  httpGet({path}) {
    return this.enhancedXhr({path});
  }

  httpPost({path, data}) {
    return this.enhancedXhr({path, method: "POST", data});
  }

  httpPut({path, data}) {
    return this.enhancedXhr({path, method: "PUT", data});
  }

  httpDel({path}) {
    return this.enhancedXhr({path, method: "DELETE"});
  }
}

module.exports = {
  BaseXhr
};