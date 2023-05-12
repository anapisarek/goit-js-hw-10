import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const searchEl = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const API_URL = 'https://restcountries.com/v3.1/name/';
const FILTER = `?fields=name,capital,population,flags,languages`;

const clearFields = () => {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
};

searchEl.addEventListener(
  'input',
  debounce(e => {
    if (e.target.value.trim() !== '') {
      fetchCountries(`${API_URL}${e.target.value.trim()}${FILTER}`)
        .then(countriesData => renderCountry(countriesData))
        .catch(error => console.log(error));
    } else {
      clearFields();
    }
  }, DEBOUNCE_DELAY)
);

function renderCountry(countriesData) {
  if (countriesData.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (countriesData.length === 1) {
    clearFields();
    countryInfo.innerHTML = `<div class="country-info__container">
    <img class="country-info__img" src="${
      countriesData[0].flags.svg
    }" width="100px" alt=""/>
    <h1> ${countriesData[0].name.official}</h1>
    </div>
    <p><b>Capital</b>: ${countriesData[0].capital}</p>
    <p><b>Population</b>: ${countriesData[0].population}</p>
    <p><b>Languages</b>: ${Object.values(countriesData[0].languages).join(', ')}
    </p>`;
  }

  if (countriesData.length > 1 && countriesData.length <= 10) {
    clearFields();
    const markup = countriesData
      .map(country => {
        return `<a href="http://" target="_blank" rel="noopener noreferrer"><li class="country-list__item">
        <img class="country-list__img" src="${country.flags.svg}" width="50px" alt=""/>
        <p> ${country.name.official}</p>
        </li></a>`;
      })
      .join('');
    countryList.innerHTML = markup;
  }
}