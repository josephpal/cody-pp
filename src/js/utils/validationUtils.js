export const validateIp = (ip) => {
  // check wether the passed ip parameter is a valid ip (xxx.xxx.xxx.xxx, only numbers and bullets allowed) or not

  let pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return pattern.test(ip);
}

export const isEmpty = (str) => {
  // check whether a string is empty or not

  return (!str || 0 === str.length);
}

export const browserType = () => {
  // check the type of the browser
  // the result will be stored in M[0]
  // link: https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser/5916928

  let ua= navigator.userAgent, tem,M;
  M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

  if(/trident/i.test(M[1])) {
      tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE '+(tem[1] || '');
  }

  if(M[1]=== 'Chrome') {
      tem= ua.match(/\b(OPR|Edge)\/(\d+)/);

      if(tem!= null) {
        return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
  }

  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

  if((tem= ua.match(/version\/(\d+)/i))!= null) {
    M.splice(1, 1, tem[1]);
  }

  return M[0];
}
