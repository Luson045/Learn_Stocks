// envUtils.js
function getEnvironment() {
  const currentURL = window.location.href;
  const development = 'http://localhost:5000';
  const production = 'https://learn-stocks.onrender.com';
  if (currentURL.includes('localhost')) {
    return development;
  } else {
    return production;
  }
}

export default getEnvironment;
