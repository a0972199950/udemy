import './css/click.scss'

export default () => {
  if (document.querySelector('#notice')) {
    return;
  }

  const p = document.createElement('p');
  p.setAttribute('id', 'notice');
  p.innerText = 'Created by click.js';
  document.body.appendChild(p);
}