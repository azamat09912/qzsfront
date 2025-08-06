import React from 'react';
import './Home5page.css';

const imageUrls = [
  'https://gorod-812.ru/content/uploads/2022/12/kash.jpg',
  'https://optim.tildacdn.pro/tild3363-6431-4530-a539-326332323330/-/format/webp/filminginkazakhstan4.jpg.webp',
  'https://optim.tildacdn.pro/tild3238-3465-4437-a335-643565343431/-/format/webp/IMG-4290.JPG.webp',
  'https://optim.tildacdn.pro/tild3566-3962-4665-b866-656636396132/-/format/webp/Naryn_Igilik.jpg.webp',
  'https://optim.tildacdn.pro/tild6333-6465-4661-b339-366139336264/-/format/webp/Dinara_Baktybayeva__.jpg.webp',
  'https://optim.tildacdn.pro/tild3237-6262-4939-b639-363535666337/-/format/webp/Sjemki_v_pavillione.jpg.webp',
  'https://optim.tildacdn.pro/tild6235-3463-4430-b439-643433353538/-/format/webp/NAP_8855.jpg.webp',
  'https://optim.tildacdn.pro/tild3633-3636-4434-a638-393133303735/-/format/webp/NAP_9198.jpg.webp',
  'https://optim.tildacdn.pro/tild6335-6237-4638-b063-383239643031/-/format/webp/IPO_1696.jpg.webp',
  'https://optim.tildacdn.pro/tild6130-3936-4161-b133-643934633639/-/format/webp/939ED165-8869-42A3-B.JPG.webp',
  'https://optim.tildacdn.pro/tild3566-3935-4335-a665-336436393163/-/format/webp/filminginkazakhstan1.jpg.webp',
  'https://optim.tildacdn.pro/tild6333-6339-4164-a533-623365353431/-/format/webp/54437121_10158207640.jpg.webp',

];

export default function Home5page() {
  return (
    <div className="korzina-container">
      <h1 className="korzina-title"> Моя Корзина</h1>
      <div className="korzina-grid">
        {imageUrls.map((url, index) => (
          <div className="korzina-item" key={index}>
            <img src={url} alt={`item-${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
