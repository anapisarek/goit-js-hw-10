import Notiflix from 'notiflix';

export const fetchCountries = name => {
  return fetch(name)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
};