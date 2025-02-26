const API_KEY = `c046d6901c3744e088e883ae50240333`;
let newsList = [];
const getLatestNews = async () => {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  console.log("ddd", newsList);

  render();
};

const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `<div class="row news">
          <div class="col-lg-4">
            <img
              class="news-img-size"
              src=${news.urlToImage}
            />
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>
              ${news.description}
            </p>
            <div>${news.source.name} * ${news.publishedAt}</div>
          </div>
        </div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

// 사이드메뉴 열고 닫기
const toggleMenu = () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.left = sidebar.style.left === "-260px" ? "0px" : "-260px";
};

//검색창 열고 닫기
const toggleSearch = () => {
  const searchBox = document.getElementById("search-box");
  searchBox.style.display =
    searchBox.style.display === "none" ? "block" : "none";
};

getLatestNews();
