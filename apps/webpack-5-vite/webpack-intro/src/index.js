import _ from 'lodash';
import './page.js'
import './css/page.css'

const h1 = document.createElement('h1');
h1.innerText = 'Hello, Webpack!';
document.body.appendChild(h1);

const btn = document.createElement('button');
btn.innerText = _.join(['Click', 'me', 'to', 'load', 'async', 'module'], ' ');
btn.onclick = async () => {
  const { default: fn } = await import(/* webpackChunkName: 'my-custom-chunk-name.js' */'./async.js');
  fn()
};
document.body.appendChild(btn);

btn.onclick = async () => {
  const { default: click } = await import ('./click.js')
  click()
}