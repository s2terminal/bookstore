// 例: https://www.kaggle.com/code/alexisbcook/titanic-tutorial
(function (src: string) {
  window.open(src, "_blank");
})(document.querySelector("iframe")?.getAttribute('src') as string);
