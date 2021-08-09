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
  movieHeartIcon.className = "ion-ios-heart-outline";
  movieHeartIcon.id = "movie-heart-icon";
  movieFooter.appendChild(movieRatingArea);
  movieFooter.appendChild(movieHeartIcon);
  movieCard.appendChild(movieImg);
  movieCard.appendChild(title);
  movieCard.appendChild(movieFooter);
  return movieCard;
};

const loadDefaultData = () => {
  getGereList().then(() => {
    getPopularMovieList(1).then(() => {
      const movieCardContainer = getMovieCardArea();
      const movieList = model.movieList;
      for (let i = 0, len = movieList.length; i < len; i++) {
        const movieCard = createMovieCard(model.movieList[i]);
        movieCardContainer.appendChild(movieCard);
      }
    });
  });
};

const loadEvents = () => {};

loadDefaultData();
loadEvents();
