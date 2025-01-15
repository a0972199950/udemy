import '@/css/click.scss';

export default () => {
  const p = document.createElement('p');
  p.innerText = 'lazy loaded';
  document.body.appendChild(p);
}