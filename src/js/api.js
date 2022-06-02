const ROOT_URL = 'https://restcountries.com/v3.1/name/';


export const findCountry = name => {
  return fetch(
    `${ROOT_URL}${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};











