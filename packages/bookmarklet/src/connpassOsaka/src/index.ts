(function () {
  const url = new URL('https://connpass.com/search/');
  url.searchParams.set(
    'start_from',
    new Date().toISOString().slice(0, 10).replace(/-/g, '/')
  );
  url.searchParams.set('prefectures', 'osaka');
  url.searchParams.set('selectItem', 'osaka');

  location.href = url.toString();
})();
