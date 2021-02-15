const quoteContainer = document.getElementById('quote-container');
const quote = document.getElementById('quote');
const author = document.getElementById('author');
const loader = document.getElementById('loader');
const twitter = document.getElementById('twitter');
const newQuote = document.getElementById('new-quote');

const PROXY_URL = 'http://api.allorigins.win/get?url=';
const RANDOM_QUOTE_URL = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json&key=0';
const TWITTER_URL = 'https://twitter.com/intent/tweet?text=';

function showLoadSpinner() {
  loader.classList.remove('hide');
  quoteContainer.classList.add('hide');
}

function hideLoadSpinner() {
  loader.classList.add('hide');
  quoteContainer.classList.remove('hide');
}

function getRandomKey() {
  return Math.floor(Math.random() * 999999);
}

async function getQuote() {
  let retryCount = 0;
  async function getQuoteInner() {
    const KEY = '&key=' + getRandomKey();
    try {
      const response = await fetch(PROXY_URL + encodeURIComponent(RANDOM_QUOTE_URL + KEY));
      const data = await response.json();
      const result = JSON.parse(data.contents);
      return { quote: result.quoteText, author: result.quoteAuthor, retry: retryCount };
    } catch (error) {
      if (retryCount < 10) {
        retryCount++;
        return await getQuoteInner();
      } else {
        console.error(`Oops!. No quote returned. after ${retryCount} retries\n`, error);
        return null;
      }
    }
  }
  return await getQuoteInner();
}

async function loadQuote() {
  showLoadSpinner();
  const data = await getQuote();

  if (data) {
    quote.innerText = data.quote;
    author.innerText = data.author ? data.author : 'Unknown';
  } else {
    quote.innerText = 'Oops!. Unable to fetch quotes. Please try again by clicking "New Quotes"';
    author.innerText = 'Unknown';
  }
  hideLoadSpinner();
}

function tweetQuote() {
  const quoteText = quote.innerText;
  const quoteAuthor = author.innerText;
  const NEW_LINE = encodeURI('\n');
  const newTab = window.open(TWITTER_URL + quoteText + NEW_LINE + '- ' + quoteAuthor, '_blank');
}

newQuote.addEventListener('click', loadQuote);

twitter.addEventListener('click', tweetQuote);

loadQuote();
