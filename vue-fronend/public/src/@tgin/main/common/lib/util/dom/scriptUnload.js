
export default function (src) {
  return new Promise(function (resolve, reject) {
    const el = document.querySelector('script[src="' + src + '"]');

    if (!el) {
      reject();
      return;
    }

    document.head.removeChild(el);

    resolve();
  });
}


