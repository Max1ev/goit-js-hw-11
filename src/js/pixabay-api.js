import axios from 'axios';

const API_KEY = '52480069-e3f81e86b58f6705753339629';
const api = axios.create({
  baseURL: 'https://pixabay.com/api/',
  timeout: 12000,
});

export function getImagesByQuery(query) {
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
