import '../css/styles.css';
import '../css/search.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { findCountry } from './api';
import countryList from '../templates/card-country-list.hbs';
import countryInfo from '../templates/card-country-info.hbs';

const inputEl = document.querySelector('#search-box');
const countyListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
const emojiFail = String.fromCodePoint(0x1f621);
const emojiInfo = String.fromCodePoint(0x1f606);

const DEBOUNCE_DELAY = 300;
let findText = '';

inputEl.addEventListener('input', debounce(searchData), DEBOUNCE_DELAY);

function searchData(ev) {
  findText = ev.target.value.trim();
  if (!findText) {
    countyListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }
  findCountry(findText)
    .then(data => {
      if (data.length > 10) {
        countyListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
        Notiflix.Notify.info(
          `${emojiInfo} Too many matches found. Please enter a more specific name.`
        );
      } else if (data.length < 10 && data.length > 1) {
        countryInfoEl.innerHTML = '';
        renderList(data);
      } else {
        renderInfo(data);
      }
    })
    .catch(err => {
      countyListEl.innerHTML = '';
      countryInfoEl.innerHTML = '';
      Notiflix.Notify.failure(
        `${emojiFail} Oops, there is no country with that name`
      );
    });
}

function render(string, value) {
  if (value > 1) {
    countyListEl.innerHTML = string;
  } else {
    countryInfoEl.innerHTML = string;
  }
}

function renderList(data) {
  let value = data.length;
  console.log(data);
  countryInfoEl.innerHTML = '';
  const resultHbs = countryList(data);
  return render(resultHbs, value);
}

function renderInfo(data) {
  let value = data.length;
  countyListEl.innerHTML = '';
  let country = {};
  ({
    capital: [country.capital],
    flags: { svg: country.flag },
    name: { common: country.name },
    languages: country.languages,
    population: country.population,
  } = data[0]);
  country.lang = Object.values(country.languages).join(', ');

  const resultHbs = countryInfo(country);
  return render(resultHbs, value);
}
