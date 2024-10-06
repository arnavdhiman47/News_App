const API_KEY = "pub_5549886736dfda8ae5285cf2ae6a772b8fe3f";
const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&q=`;

window.addEventListener("load", () => fetchNews("pizza"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  try {
    const res = await fetch(`${url}${query}`);
    const data = await res.json();

    // Check if results exist and are in the right format
    if (data.results && Array.isArray(data.results)) {
      bindData(data.results);
    } else {
      console.error("No articles found in response");
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  // Ensure articles is an array
  if (!articles || articles.length === 0) {
    console.log("No articles to display.");
    return;
  }

  articles.forEach((article) => {
    if (!article.image_url) return;

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.image_url;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description || "No description available.";

  const date = new Date(article.pubDate).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source_id} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.link, "_blank");
  });
}

let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
