(function (document: Document) {
  navigator.share({
    text:`[${document.title}](${document.location.href})` }
  );
})(window.document);
