import _ from 'lodash';

export default () => {
  const p = document.createElement('p');
  p.innerText = _.join(['Async', 'module', 'loaded'], ' ');
  document.body.appendChild(p);
}