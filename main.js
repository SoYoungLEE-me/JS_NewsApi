const API_KEY = `c046d6901c3744e088e883ae50240333`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

const sideMenus = document.querySelectorAll(".sidebar-menus button");
sideMenus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

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

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?&category=${category}`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

const render = () => {
  const newsHTML = newsList
    .map((news) => {
      const imgUrl = news.urlToImage ? news.urlToImage : "/assets/no_img.jpg";
      const sourceName = news.source.name ? news.source.name : "no source";
      const description =
        news.description && news.description.length > 200
          ? news.description.slice(0, 200) + "..."
          : news.description || "내용 없음";

      const publishedTime = news.publishedAt
        ? moment(news.publishedAt).fromNow()
        : "Unknown Date";

      return `<div class="row news">
          <div class="col-lg-4 news-img-container">
            <img
              class="news-img-size"
              alt="news image"
              onerror = "this.src = '/assets/no_img.jpg';"
              src=${imgUrl}
            />
          </div>
          <div class="col-lg-8 news-content">
            <h2>${news.title}</h2>
            <p>
              ${description}
            </p>
            <div>${sourceName} * ${publishedTime}</div>
          </div>
        </div>`;
    })
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
