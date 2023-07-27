const btn = document.querySelector('.j-btn-test');

btn.addEventListener('click', () => {

  btn.querySelectorAll('.arrow').forEach(arrow => {
    arrow.classList.toggle('arrow-hidden');
  })
});