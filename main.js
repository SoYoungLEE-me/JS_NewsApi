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

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
  try {
    url.searchParams.set("page", page); // &page=page
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getLatestNews = async () => {
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );

  getNews();
};

const getNewsByCategory = async (event) => {
  page = 1;
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?&category=${category}`
  );
  getNews();
};

const searchNews = async () => {
  page = 1;
  const keyword = searchInput.value;
  console.log(keyword);
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?&q=${keyword}`
  );
  getNews();
  searchInput.value = "";
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
  </div>`;
  document.getElementById("news-board").innerHTML = errorHtml;
};

/* 페이지네이션 */
const paginationRender = () => {
  const pageGroup = Math.ceil(page / groupSize);
  const totalPage = Math.ceil(totalResults / pageSize);
  const lastPage = Math.min(totalPage, pageGroup * groupSize);
  const firstPage =
    lastPage - (groupSize - 1) > 0 ? lastPage - (groupSize - 1) : 1;

  let paginationHTML = "";

  // 처음 페이지 버튼, 1페이지가 아닐 때만 비활성화
  paginationHTML += `
    <li class="page-item ${page === 1 ? "disabled" : ""}"${
    page === 1 ? "" : `onclick="moveToPage(${1})"`
  }>
      <a class="page-link" aria-label="First">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>`;

  //이전 버튼, 페이지가 아닐 때만 비활성화
  paginationHTML += `
    <li class="page-item ${page === 1 ? "disabled" : ""}" ${
    page === 1 ? "" : `onclick="moveToPage(${page - 1})"`
  }>
      <a class="page-link" aria-label="Previous">
        <span aria-hidden="true">&lt;</span>
      </a>
    </li>`;

  // 페이지 버튼
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `
      <li class="page-item ${
        i === page ? "active" : ""
      }" onclick="moveToPage(${i})">
        <a class="page-link">${i}</a>
      </li>`;
  }

  //다음 버튼, 마지막 페이지가 아닐 때만 비활성화
  paginationHTML += `
    <li class="page-item ${page === totalPage ? "disabled" : ""}" ${
    page === totalPage ? "" : `onclick="moveToPage(${page + 1})"`
  }> <a class="page-link" aria-label="Next">
        <span aria-hidden="true">&gt;</span>
      </a>
    </li>`;

  //마지막 페이지 버튼, 마지막 페이지가 아닐 때만 비활성화
  paginationHTML += `
    <li class="page-item ${page === totalPage ? "disabled" : ""}" ${
    page === totalPage ? "" : `onclick="moveToPage(${totalPage})"`
  }>
      <a class="page-link" aria-label="Last">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`;

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
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
