const BASE_URL = "https://rancid-tomatillos.herokuapp.com/api/v1/login";

export const fetchUserLogin = (userData) => {
  return fetch(BASE_URL, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((data) => {
      return fetch(
        `https://rancid-tomatillos.herokuapp.com/api/v1/users/${data.user.id}/ratings`
      )
        .then((response) => response.json())
        .then((info) => {
          return { ...data.user, ...info };
        });
    });
};

export const getMovieDetails = (id) => {
  return fetch(
    "https://rancid-tomatillos.herokuapp.com/api/v1/movies/" + id
  ).then((response) => response.json());
};

export const fetchUserRatings = (userId) => {
  return fetch(
    `https://rancid-tomatillos.herokuapp.com/api/v1/users/${userId}/ratings`
  ).then((response) => response.json());
};

export const submitRating = (userId, movieId, rating) => {
  return fetch(
    `https://rancid-tomatillos.herokuapp.com/api/v1/users/${userId}/ratings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movie_id: movieId, rating: rating }),
    }
  ).then((response) => response.json());
};

export const removeRating = (userId, ratingId) => {
  return fetch(
    `https://rancid-tomatillos.herokuapp.com/api/v1/users/${userId}/ratings/${ratingId}	`,
    {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
};

export const fetchMovies = () => {
  return fetch("https://rancid-tomatillos.herokuapp.com/api/v1/movies")
    .then((response) => response.json())
};
