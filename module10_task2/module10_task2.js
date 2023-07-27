const btn = document.querySelector('.j-btn-test');

btn.addEventListener('click', () => {
  alert(`
  Your screen width is ${window.screen.width}px
  Your screen height is ${window.screen.height}px
  `);
});

btn.addEventListener('mousedown', () => {

  btn.querySelectorAll('.screen-icon').forEach(arrow => {
    arrow.classList.toggle('icon-hidden');
  })
});

btn.addEventListener('mouseup', () => {

  btn.querySelectorAll('.screen-icon').forEach(arrow => {
    arrow.classList.toggle('icon-hidden');
  })
});
