// Coding Test
// Make an app to search GitHub repositories - Please implement incremental search
// - Please do not use any libraries
// - Please add API request throttling
// - The design can be as simple as you like Please use the API for github below:
// https://docs.github.com/en/rest/reference/search
//
// 20211205 Author: zhc

const THROTTLE_TIME = 500; // Time to wait after the user stops typing, in milliseconds.
const GITHUB_PATH = "https://api.github.com/search/repositories";
const GITHUB_TOKEN = "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";
const PAGE_LIMIT = 30;

const input = document.querySelector(".instant_search");
const debounceGetSearchResult = debounce(getSearchResult, THROTTLE_TIME);
input.addEventListener("input", debounceGetSearchResult);

// A simple version debounce function, equivalent to lodash debounce/throttle.
// The curried function will be fired after THROTTLE_TIME(milliseconds) when user stops input.
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(this, args);
    }, wait);
  };
}

// Requests search result from GitHub API, and updates the result upon success.
function getSearchResult(event) {
  const keyword = event.target.value.trim();
  const resultArea = document.querySelector(".result");

  // Remove all previous results immediately after user input changes.
  while (resultArea.firstChild) {
    resultArea.removeChild(resultArea.firstChild);
  }

  if (!keyword) return;

  const xhr = getXmlHttpRequest();
  if (xhr == null) {
    alert("Browser does not support HTTP Request");
    return;
  }

  // Callback upon request success.
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 || xhr.readyState == "complete") {
      const result = JSON.parse(xhr.responseText);
      result.items.forEach((item) => {
        const child = document.createElement("div");
        const btnStar = `<iframe src="https://ghbtns.com/github-btn.html?user=${item.owner.login}&repo=${item.name}&type=star&count=true" frameborder="0" scrolling="0" width="140" height="20" title="GitHub"></iframe>`;
        const resultTitle = `<div class="result_title">${btnStar}<span>${item.full_name}</span></div>`;
        const resultDesc = `<div class="result_desc"><span>${item.description}</span></div>`;
        child.innerHTML = `${resultTitle}${resultDesc}`;
        resultArea.appendChild(child);
      });
    }
  };

  const url = `${GITHUB_PATH}?q=${keyword}+in:name&sort=stars&page=1&per_page=${PAGE_LIMIT}`;
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  // xhr.setRequestHeader("Authorization", "Bearer " + GITHUB_TOKEN)
  xhr.send(null);
}

// Creates a XmlHttpRequest object.
function getXmlHttpRequest() {
  let xhr = null;
  try {
    // Firefox, Opera 8.0+, Safari
    xhr = new XMLHttpRequest();
  } catch (e) {
    // Internet Explorer
    try {
      xhr = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  return xhr;
}
