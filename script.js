// api-key: 9b2c8894f1dac9b8e9b2f47ce9f2cb67
// use MVC
// 1. create model, which include a movie list, a liked movie list, tags for movie type
// 2. call API to load default movies

const apiKey = "9b2c8894f1dac9b8e9b2f47ce9f2cb67";
const baseUrl = "https://api.themoviedb.org/3/movie";

const TABS = {
  POPULAR: "POPULAR",
  NOWPLAYING: "NOWPLAYING",
  TOPRATED: "TOPRATED",
  UPCOMING: "UPCOMING",
};

const model = {
  movieList: [],
  likedMovieList: [],
  activeTab: TABS.POPULAR,
  genres: {},
  currPage: 1,
};

const getMovieCardArea = () => document.querySelector(".movie-card-area");

const createMovieCard = (data) => {
  const movieCard = document.createElement("div");
  movieCard.className = "movie-card";
  const movieImg = document.createElement("img");
  movieImg.className = "movie-img";
  const poster_path = data.poster_path;
  movieImg.src = `https://image.tmdb.org/t/p/w500${poster_path}`;
  const title = document.createElement("h2");
  title.className = "movie-title";
  title.innerHTML = data.title;
  const movieFooter = document.createElement("div");
  movieFooter.className = "movie-footer";
  const movieRatingArea = document.createElement("div");
  movieRatingArea.className = "movie-rating-area";
  const starIcon = document.createElement("div");
  starIcon.className = "ion-star";
  const movieRating = document.createElement("div");
  movieRating.innerHTML = data.vote_average;
  movieRatingArea.appendChild(starIcon);
  movieRatingArea.appendChild(movieRating);
  const movieHeartIcon = document.createElement("div");
  movieHeartIcon.classList.add("movie-heart-icon");
  const same = model.likedMovieList.filter((movie) => {
    return movie.id == data.id;
  });
  if (same.length !== 0) {
    movieHeartIcon.classList.add("ion-ios-heart");
  } else {
    movieHeartIcon.classList.add("ion-ios-heart-outline");
  }
  movieFooter.appendChild(movieRatingArea);
  movieFooter.appendChild(movieHeartIcon);
  movieCard.appendChild(movieImg);
  movieCard.appendChild(title);
  movieCard.appendChild(movieFooter);
  return movieCard;
};

const dimBackground = () => {
  const html = document.querySelector("html");
  html.style.backgroundColor = "grey";
  const lis = document.querySelectorAll("li");
  lis.forEach((li) => {
    li.style.backgroundColor = "grey";
  });
  //   const imgs = document.querySelectorAll(".movie-img");
  //   imgs.forEach((img) => {
  //     img.style.filter = "brightness(50%)";
  //   });
};

const loadMovieData = (e) => {
  const movieTitle = e.target.innerHTML;
  const movieDataList = model.movieList.filter((movie) => {
    return movie.title === movieTitle;
  });

  if (movieDataList.length > 0) {
    return movieDataList[0];
  }

  return null;
};

const loadProvidersLogo = (movieId) => {
  const movieDetailUrl = `${baseUrl}/${movieId}?api_key=${apiKey}`;
  fetch(movieDetailUrl)
    .then((resp) => resp.json())
    .then((data) => {
      const productionLogoArea = document.querySelector(
        ".production-logos-area"
      );
      const productionCompanies = data.production_companies;
      productionCompanies.forEach((company) => {
        const logoPath = company.logo_path;
        if (logoPath !== null) {
          console.log(`logoPath`, logoPath);
          const logoUrl = `https://image.tmdb.org/t/p/w200${logoPath}`;
          const logoItem = document.createElement("div");
          logoItem.className = "production-logo-item";
          const logoImg = document.createElement("img");
          logoImg.src = logoUrl;
          logoImg.alt = "logo-img";
          logoImg.className = "production-logo-img";
          logoItem.appendChild(logoImg);
          productionLogoArea.appendChild(logoItem);
        }
      });
    });
};

const createMovieDetailsCard = (movieData) => {
  const movieImg = document.querySelector(".movie-details-img");
  const poster_path = movieData.poster_path;
  movieImg.src = `https://image.tmdb.org/t/p/w500${poster_path}`;
  const movieTitle = document.querySelector(".movie-details-title");
  movieTitle.innerHTML = movieData.title;
  const movieDescription = document.querySelector(".movie-details-description");
  movieDescription.innerHTML = movieData.overview;
  const genreContainer = document.querySelector(".genres-container");
  const genreIds = movieData.genre_ids;
  genreIds.forEach((genreId) => {
    const genreItemCollection = Object.values(model.genres).filter(
      (genre) => genre.id === genreId
    );
    if (genreItemCollection.length > 0) {
      const genreName = genreItemCollection[0].name;
      const genreItem = document.createElement("div");
      genreItem.className = "genre-item";
      genreItem.innerHTML = genreName;
      genreContainer.appendChild(genreItem);
    }
  });
  const movieRating = document.querySelector(".movie-details-rating");
  movieRating.innerHTML = movieData.vote_average;
  console.log(`movieData`, movieData);
  loadProvidersLogo(movieData.id);
};

const handleMovieTitleController = (e) => {
  dimBackground();
  const movieData = loadMovieData(e);

  const movieDetailsCard = createMovieDetailsCard(movieData);

  const movieDetailsContainer = document.querySelector(
    ".movie-details-container"
  );
  movieDetailsContainer.style.display = "block";
};

const handleMovieHeartIconController = (e) => {
  const heartIcon = e.target;
  heartIcon.classList.toggle("ion-ios-heart-outline");
  heartIcon.classList.toggle("ion-ios-heart");
  const currMovieCard = heartIcon.parentNode.parentNode;
  const indexRecord = currMovieCard.indexRecord;
  const movieData = model.movieList[indexRecord];

  if (!heartIcon.classList.contains("ion-ios-heart")) {
    model.likedMovieList = model.likedMovieList.filter((movie) => {
      return movie.id != movieData.id;
    });
  } else {
    model.likedMovieList.push(movieData);
  }
};

const handleMovieCardAreaController = (e) => {
  if (e.target.classList.contains("movie-title")) {
    handleMovieTitleController(e);
  } else if (e.target.classList.contains("movie-heart-icon")) {
    handleMovieHeartIconController(e);
  }
};

const brightenBackgroud = () => {
  const html = document.querySelector("html");
  html.style.backgroundColor = "white";
  const lis = document.querySelectorAll("li");
  lis.forEach((li) => {
    li.style.backgroundColor = "white";
  });
  //   const imgs = document.querySelectorAll(".movie-img");
  //   imgs.forEach((img) => {
  //     img.style.filter = "brightness(100%)";
  //   });
};

const handleMovieDetailsCloseController = () => {
  brightenBackgroud();
  const movieDetailsContainer = document.querySelector(
    ".movie-details-container"
  );
  movieDetailsContainer.style.display = "none";
};

const handleNavBarController = (e) => {
  if (e.target.classList.contains("home-button")) {
    loadDefaultData();
  } else if (e.target.classList.contains("liked-list-button")) {
    model.movieList = model.likedMovieList;
    updateView();
  }
};

const updateView = () => {
  const movieCardContainer = getMovieCardArea();
  movieCardContainer.innerHTML = "";
  const movieList = model.movieList;
  for (let i = 0, len = movieList.length; i < len; i++) {
    const movieCard = createMovieCard(model.movieList[i]);
    movieCard.indexRecord = i;
    movieCardContainer.appendChild(movieCard);
  }
};

const getGereList = () => {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
  return fetch(url)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      model.genres = { ...data.genres };
    });
};

const getPopularMovieList = (page) => {
  const url = `${baseUrl}/popular?api_key=${apiKey}&language=en-US&page=${page}`;
  return fetch(url)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      model.movieList = data.results;
    });
};

const loadDefaultData = () => {
  getGereList().then(() => {
    getPopularMovieList(1).then(() => {
      updateView();
    });
  });
};

const loadEvents = () => {
  const movieCard = document.querySelector(".movie-card-area");
  const movieDetailsClose = document.querySelector(".movie-details-close-icon");
  const navBar = document.querySelector(".nav-bar");

  movieCard.addEventListener("click", handleMovieCardAreaController);
  movieDetailsClose.addEventListener(
    "click",
    handleMovieDetailsCloseController
  );
  navBar.addEventListener("click", handleNavBarController);
};

loadDefaultData();
loadEvents();
