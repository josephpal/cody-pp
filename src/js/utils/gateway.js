export const performRequest = (method, slug, data) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open(method, slug, true);

    request.addEventListener('load', function(event) {
      if (request.status >= 200 && request.status < 300) {
        resolve(request.response);
      } else {
        console.warn(request.statusText, request.responseText);
        reject(request.response);
      }
    });

    request.send(data);
  });
};

export const get = (slug) => performRequest('GET', slug, null);
export const post = (slug, data = null) => performRequest('POST', slug, data);
