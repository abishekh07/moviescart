"use strict"

import { generateCard } from "./helpers.js"

const base_url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&language=en-US&include_video=false&page=1`

let api_url = base_url

const moviesContainer = document.querySelector("main.movies")

function renderSearchResults(url) {
  api_url = url
  moviesContainer.innerHTML = ""

  console.log(api_url)
  init(api_url)
}

function init(url) {
  toggleLoader(1)

  fetch(url)
    .then((response) => response.json())
    .then((movies) => {
      let validResponse = movies.total_results

      if (!validResponse) {
        renderSearchResults(base_url)
      }

      toggleLoader(0)
      document.querySelector(".footer").style.visibility = "visible"
      return displayMovies(movies.results)
    })
    .catch((error) => {
      console.log(error)
    })
}

function displayMovies(movieList) {
  let movieCard = undefined

  movieList.forEach((movie, index) => {
    const {
      id,
      title,
      poster_path: poster,
      release_date: release_year,
      vote_average: rating = 0,
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

  for (let movie of movies) {
    let movie_id = movie.id

    movie.addEventListener("click", () => {
      location.assign(`./movie.html#${movie_id}`)
    })
  }
}

const movieForm = document.querySelector(".movie__form")

movieForm.addEventListener("submit", (e) => {
  e.preventDefault()

  let searchQuery = e.target.movieInput.value.trim()

  if (!searchQuery) {
    init(api_url)
    return
  }

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&page=1&include_adult=false&query=${searchQuery}&page=1`

  renderSearchResults(url)

  setTimeout(() => {
    // e.target.movieInput.value = ""
    e.target.movieInput.blur()
  }, 200)
})

function toggleLoader(shouldDisplay) {
  const loader = document.querySelector(".loader")

  if (shouldDisplay) {
    loader.style.display = "flex"
    document.body.style.overflow = "hidden"
  } else {
    setTimeout(() => {
      loader.style.display = "none"
      document.body.style.overflow = "unset"
    }, 500)
  }
}

const paginationButtons = document.querySelectorAll(".footer button")
const currPageNumber = document.querySelector(".pagination__number")

function implementPagination(e) {
  const shouldIncrement = e.target.classList.contains("next-btn")
  const shouldDecrement = e.target.classList.contains("prev-btn")

  if (currPageNumber.textContent === "1" && shouldDecrement) return
  if (currPageNumber.textContent === "100" && shouldIncrement) return

  let api_page_num = api_url[api_url.length - 1]

  api_page_num = shouldIncrement ? ++api_page_num : --api_page_num

  currPageNumber.textContent = api_page_num
  api_url = api_url.slice(0, -1) + api_page_num

  renderSearchResults(api_url)
}

paginationButtons.forEach((pagination_btn) => {
  pagination_btn.addEventListener("click", implementPagination)
})

init(base_url) // Load Application
