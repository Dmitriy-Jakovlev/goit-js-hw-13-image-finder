import './styles.css';
import refs from './js/refs';
import apiService from './js/apiService.js';
import galleryCard from './templats/gallery.hbs'
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';

const debounce = require('debounce');
const basicLightbox = require('basiclightbox')

refs.queryInput.addEventListener('input', debounce(onSearch, 1000));
refs.loadBtn.addEventListener('click', () => { 
  loadImages().catch(error => pushError('Не найдены картинки по вашему запросу!!!')).finally(scroll);
});

refs.gallery.addEventListener('click', openLightBox);




function openLightBox(event) {
  const set = { src: event.target.dataset.source, alt: event.target.alt };
  openImage(set);
}

function openImage({ src, alt }) {
  const instance = basicLightbox.create(`
  <div class="full-image-container">
  <img src="${src}" alt="${alt}" />
  <a class="download" href="${src}" download="${
    alt.split(',')[0]
  }" target="_blank" /><i class="material-icons">cloud_download</i></a>
  </div>
`);
  instance.show();
}

function pushError(err) {
  error({
    text: `${err}`,
  });
}


function loadImages() { 
    return apiService.fetchPictures()
        .then(renderImageCard);
        
    
}


function scroll() {
  const { y } = refs.gallery.getBoundingClientRect();
  const screenHeight = document.documentElement.clientHeight;
   window.scrollTo({
    top: screenHeight - y,
    behavior: 'smooth'
  });
}


function onSearch(e) {
    e.preventDefault();
    clearResult();
    apiService.query = refs.queryInput.value;
    if (apiService.query.length === 0) {
        clearResult();
        refs.loadBtn.classList.remove('btn');
        refs.loadBtn.classList.add('is-hidden');
        
        return;
    } else {
        apiService.resetPage();
        loadImages().catch(error => pushError('Не найдены картинки по вашему запросу!!!'));
        refs.loadBtn.classList.remove('is-hidden');
        refs.loadBtn.classList.add('btn');
        
    }
}


function clearResult() { 
    refs.gallery.innerHTML = '';
}


function renderImageCard(image) {   
    
    const markup = galleryCard(image);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    
    if (image.length === 0) { 
         pushError('Не можем найти картинки по вашему запросу!!!');
    }
    
}


