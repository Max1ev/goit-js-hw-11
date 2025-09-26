import './css/styles.css';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';


const api = axios.create({
  baseURL: 'https://pixabay.com/api/',
  timeout: 12000,
});


const API_KEY = '52480069-e3f81e86b58f6705753339629';


const form = document.getElementById('search-form');
const input = document.getElementById('search-text');
const gallery = document.getElementById('gallery');
const statusMessage = document.getElementById('status-message');


const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});


function clearGallery() {
  gallery.innerHTML = '';
}
function createGallery(images) {
  const markup = images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <li class="card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
        </a>
        <div class="meta">
          <div><b>Likes</b>${likes}</div>
          <div><b>Views</b>${views}</div>
          <div><b>Comments</b>${comments}</div>
          <div><b>Downloads</b>${downloads}</div>
        </div>
      </li>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}


function setStatusLoading() {
  statusMessage.textContent = 'Loading images, please wait...';
  statusMessage.className = 'status-message loading';
}
function clearStatusMessage() {
  statusMessage.textContent = '';
  statusMessage.className = 'status-message';
}


function getImagesByQuery(query) {
  return api
    .get('', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 20,
      },
    })
    .then(res => res.data);
}


form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  const query = input.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Oops',
      message: 'Please type something to search.',
      position: 'topRight',
      maxWidth: 300,
      timeout: 1500,
    });
    return;
  }

  clearGallery();
  setStatusLoading();

  getImagesByQuery(query)
    .then(data => {
      const hits = Array.isArray(data?.hits) ? data.hits : [];

      if (hits.length === 0) {
        clearStatusMessage();
        iziToast.error({
          title: 'No results',
          message: 'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
          maxWidth: 300,
          timeout: 2000,
        });
        return;
      }

      createGallery(hits);
      clearStatusMessage();

      iziToast.success({
        title: 'Success',
        message: `Found ${hits.length} images`,
        position: 'topRight',
        maxWidth: 300,
        timeout: 1500,
      });
    })
    .catch(err => {
      console.error(err);
      clearStatusMessage();
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong. Please, try again later.',
        position: 'topRight',
        maxWidth: 300,
        timeout: 2000,
      });
    });
}
