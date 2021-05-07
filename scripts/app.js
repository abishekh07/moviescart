"use strict"

import { generateCard } from "./helpers.js"

let page_api = 1
let api_url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&language=en-US&include_video=false&page=${page_api}`

const movieForm = document.querySelector(".movie__form")
const moviesContainer = document.querySelector("main.movies")
const loader = document.querySelector(".loader")

function toggleLoader(shouldDisplay) {
  if (shouldDisplay) {
    loader.style.display = "flex"
    document.body.style.overflow = "hidden"
  } else {
    setTimeout(() => {
      loader.style.display = "none"
      document.body.style.overflow = "unset"
    }, 400)
  }
}

function init(url) {
  toggleLoader(1)

  fetch(url)
    .then((response) => response.json())
    .then((movies) => {
      let validResponse = movies.total_results

      if (!validResponse) {
        init(api_url)
      }

      toggleLoader(0)
      document.querySelector(".footer").style.visibility = "visible"
      return displayMovies(movies.results)
    })
    .catch((error) => {
      console.log(error)
    })
}

function renderSearchResults(newUrl) {
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

  renderSearchResults(url)

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

  for (let movie of movies) {
    let movie_id = movie.id

    movie.addEventListener("click", () => {
      location.assign(`./movie.html#${movie_id}`)
    })
  }
}

// Pagination

const prevBtn = document.querySelector(".prev-btn")
const nextBtn = document.querySelector(".next-btn")
const pageNum = document.querySelector(".pagination__number")
let pageNumValue = pageNum.textContent

prevBtn.addEventListener("click", () => {
  getPageNumber(pageNumValue, "decrement")
})

nextBtn.addEventListener("click", () => {
  getPageNumber(pageNumValue, "increment")
})

function getPageNumber(currPageNum, status) {
  if (
    (currPageNum <= 1 && status === "decrement") ||
    (currPageNum === 100 && status === "increment")
  ) {
    return
  }

  console.log(currPageNum)

  switch (status) {
    case "increment":
      currPageNum = Number(currPageNum) + 1
      pageNumValue = currPageNum
      break

    case "decrement":
      currPageNum = Number(currPageNum) - 1
      pageNumValue = currPageNum
      break
  }

  pageNum.textContent = pageNumValue
  page_api = pageNumValue

  api_url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&language=en-US&include_video=false&page=${page_api}`

  moviesContainer.innerHTML = ""
  init(api_url)
}

init(api_url) // Load Application
