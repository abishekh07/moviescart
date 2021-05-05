"use strict"

import { generateCard } from "./helpers.js"

const api_url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&language=en-US&include_video=false&page=1`

const movieForm = document.querySelector(".movie__form")
const moviesContainer = document.querySelector("main.movies")
const loader = document.querySelector(".loader")

function init(url) {
  fetch(url)
    .then((response) => response.json())
    .then((movies) => displayMovies(movies.results))
    .catch((error) => {
      console.log(error)
    })
}

function setAPIUrl(newUrl) {
  document.querySelector(".movies").innerHTML = ""
  init(newUrl)
}

movieForm.addEventListener("submit", (e) => {
  e.preventDefault()

  let searchQuery = e.target.movieInput.value.trim()

  if (!searchQuery) {
    init(api_url)
    return
  }

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&page=1&include_adult=false&query=${searchQuery}`

  setAPIUrl(url)

  setTimeout(() => {
    e.target.movieInput.value = ""
  }, 200)
})

function displayMovies(movieList) {
  let movieCard = undefined

  movieList.forEach((movie, index) => {
    const {
      id,
      title,
      poster_path: poster,
      release_date: release_year,
      vote_average: rating,
      id: movie_id,
    } = movie

    movieCard = generateCard(
      index,
      id,
      title,
      poster,
      release_year,
      movie_id,
      rating
    )
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

if (loader) {
  document.body.style.overflow = "hidden"
}

window.addEventListener("load", () => {
  loader.style.display = "none"
  document.body.style.overflow = "unset"
})

init(api_url) // Load Application
