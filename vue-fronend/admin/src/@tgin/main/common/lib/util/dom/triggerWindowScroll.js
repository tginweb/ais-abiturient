
export default function triggerWindowScroll(){
  window.scrollTo(window.scrollX, window.scrollY + 1);
  window.scrollTo(window.scrollX, window.scrollY - 1);
}
