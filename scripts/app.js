"use strict"

import { generateCard } from "./helpers.js"

const api_url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&sort_by=popularity.desc&include_video=false&page=1`

const moviesContainer = document.querySelector("main.movies")

fetch(api_url)
  .then((response) => response.json())
  .then((movies) => displayMovies(movies.results))
  .catch((error) => {
    console.log(error)
  })

function displayMovies(movieList) {
  let movieCard = undefined

  movieList.forEach((movie) => {
    const {
      id,
      title,
      poster_path: poster,
      release_date: release_year,
      vote_average: rating,
      id: movie_id,
    } = movie

    movieCard = generateCard(id, title, poster, release_year, movie_id, rating)
    moviesContainer.appendChild(movieCard)
  })

  const movies = moviesContainer.children

  for (let i = 0; i < movies.length; i++) {
    let movie_id = movies[i].id

    movies[i].addEventListener("click", () => {
      location.assign(`./movie.html#${movie_id}`)
    })
  }
}
