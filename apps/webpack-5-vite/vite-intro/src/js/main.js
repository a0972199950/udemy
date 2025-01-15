import '@/css/main.scss';
import imageLondon from '@/assets/london.png';

const button = document.createElement('button');
button.innerText = 'Click me to load lazy file';
button.onclick = async () => {
  const { default: click } = await import('@/js/click.js');
  click();
};

document.body.appendChild(button);

const img = document.createElement('img');
img.src = imageLondon;
document.body.appendChild(img);