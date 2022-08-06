export default {
  set: function (key, value, useSessionStorage) {
    if (typeof window === 'undefined') {
      return;
    }
    var localStorage = useSessionStorage ? window.sessionStorage : window.localStorage,
      jsonValue = JSON.stringify(value);

    try {
      localStorage.setItem(key, jsonValue);
      return true;

    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        return false;
      }

    }

  },

  get: function (key, parseJson, useSessionStorage) {

    parseJson = !!parseJson;

    if (typeof window === 'undefined') {
      return;
    }

    var localStorage = false,
      data,
      res;

    //NOTE: throws 'DOM Exception 18' Errors on IOS 9.2 Safari if block all cookies is on
    try {
      localStorage = useSessionStorage ? window.sessionStorage : window.localStorage;
      data = localStorage.getItem(key);
    } catch (err) {
      return false;
    }

    try {
      res = JSON.parse(data);

      if (res === 'true') {
        res = true;
      }

      if (res === 'false') {
        res = false;
      }

      if (parseFloat(res) === res) {
        res = parseFloat(res);
      }

    } catch (e) {
    }

    return parseJson ? JSON.parse(res) : res;

  },

  delete: function (key, useSessionStorage) {
    if (typeof window === 'undefined') {
      return;
    }
    var localStorage = useSessionStorage ? window.sessionStorage : window.localStorage;

    localStorage.removeItem(key);

  }
}