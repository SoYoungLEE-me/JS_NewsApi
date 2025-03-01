const API_KEY = `c046d6901c3744e088e883ae50240333`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchNews();
  }
});

const sideMenus = document.querySelectorAll(".sidebar-menus button");
sideMenus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
);

const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );

  getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?&category=${category}`
  );
  getNews();
};

const searchNews = async () => {
  const keyword = searchInput.value;
  console.log(keyword);
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?&q=${keyword}`
  );
  getNews();
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
            <h2 class="newsTitle">${news.title}</h2>
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

const errorRender = (errorMessage) => {
  const errorHtml = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>;`;
  document.getElementById("news-board").innerHTML = errorHtml;
};

// 사이드메뉴 열고 닫기
const toggleMenu = () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle(
    "open"
  ); /* class.toggle은 클래스가 없으면 추가를 있으면 제거를 하는 방식 */
};

window.addEventListener("resize", () => {
  const sidebar = document.getElementById("sidebar");

  if (window.innerWidth > 768) {
    sidebar.classList.remove("open");
  }
});

/* 카테고리를 클릭 시 사이드바 자동 닫힘 기능 */
document.addEventListener("click", (event) => {
  const sidebar = document.getElementById("sidebar");

  if (
    sidebar.classList.contains("open") &&
    event.target.closest(".sidebar-menus button")
  ) {
    sidebar.classList.remove("open");
  }
});

//검색창 열고 닫기
const toggleSearch = () => {
  const searchBox = document.getElementById("search-box");
  searchBox.style.display =
    searchBox.style.display === "none" ? "block" : "none";
};

getLatestNews();
