(function (url: URL) {
  url.pathname = (
    (pathList: string[]) => pathList.slice(pathList.indexOf('dp')).join('/')
  )(url.pathname.split('/'));
  url.search = "";
  url.pathname = url.pathname.replace(/\/ref=[a-zA-Z0-9\_]+/i, "");
  location.href = url.toString();
})(
  new URL(location.href)
);
