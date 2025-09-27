import './css/styles.css';
import './css/loader.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import { createGallery, clearGallery, showLoader, hideLoader } from './js/render-functions';

const form = document.getElementById('search-form');
const input = document.getElementById('search-text');
const statusMessage = document.getElementById('status-message');

form.addEventListener('submit', onSubmit);


function setStatusLoading() {
  statusMessage.textContent = 'Loading images, please wait...';
  statusMessage.className = 'status-message loading';
}
function clearStatusMessage() {
  statusMessage.textContent = '';
  statusMessage.className = 'status-message';
}

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
  showLoader();
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
    })
    .finally(() => {
      hideLoader();
    });
}
