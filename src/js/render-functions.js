import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';

const gallery = document.getElementById('gallery');
const loaderOverlay = document.getElementById('loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

export function clearGallery() {
  gallery.innerHTML = '';
}

export function createGallery(images) {
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

export function showLoader() {
  loaderOverlay.classList.remove('is-hidden');
}

export function hideLoader() {
  loaderOverlay.classList.add('is-hidden');
}
