const currentmovie_id = location.hash.substring(1)

const api_key = "b60ef7e7cb2510e8ec22600fe402868e"
const movie_url = `https://api.themoviedb.org/3/movie/${currentmovie_id}?api_key=${api_key}&append_to_response=videos`

const loader = document.querySelector(".loader")
const moviePage = document.querySelector(".movie_page")
const movieTitleText = document.querySelector(".title__text")
const movieTitleTagline = document.querySelector(".title__tagline")
const movieOverview = document.querySelector(".overview")
const movieStatsGenre = document.querySelector(".stats__genres")
const movieStatsRatingScore = document.querySelector(".stats__rating--score")
const movieStatsRuntime = document.querySelector(".stats__runtime--mins")
const movieStatsReleaseYear = document.querySelector(".stats__release--year")
const movieWebsiteButton = document.querySelector(".links__btn--website")
const movieTrailerButton = document.querySelector(".links__btn--trailer")
const movieVideoPlayer = document.querySelector("#videoPlayer")
const videoPlayerOverlay = document.querySelector(".modal__overlay")

fetch(movie_url)
  .then((response) => {
    let res

    if (response.ok) {
      res = response.json()

      setTimeout(() => {
        document.querySelector(".content-placeholder").style.display = "none"
        document.querySelector(".real-content").style.display = "block"
      }, 1000)
    }

    return res
  })
  .then((movieInfo) => populateMovieData(movieInfo))

function getGenres(genres) {
  if (!genres) return "Unknown Genre"

  let genreStr = ""
  genres.map((genre) => (genreStr += `${genre.name} / `))

  return genreStr.substring(0, genreStr.length - 2)
}

function populateMovieData(movieInfo) {
  const {
    title,
    tagline,
    overview,
    backdrop_path: bg_image,
    vote_average: rating,
    genres,
    homepage: website,
    videos,
    release_date,
    runtime,
  } = movieInfo

  const image_url = `https://image.tmdb.org/t/p/${
    window.innerWidth >= 600 ? "w1280" : "w780"
  }/${bg_image}`

  document.title = `Movies Directory | ${title}` //HTML page title

  moviePage.style = `background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.8) 5%, rgba(0, 0, 0, 0.3) 98%), url(${image_url}); background-size: cover; background-repeat: no-repeat; background-position: center center`

  movieStatsGenre.textContent = getGenres(genres)
  movieStatsRatingScore.textContent = rating.toFixed(1)
  movieStatsRuntime.textContent = `${runtime} mins`
  movieStatsReleaseYear.textContent = `${release_date.split("-")[0]}`

  movieTitleText.textContent = title
  movieTitleTagline.textContent = tagline

  movieOverview.textContent = overview

  if (website) {
    movieWebsiteButton.setAttribute("href", website)
    movieWebsiteButton.setAttribute("target", "_blank")
  } else {
    movieWebsiteButton.remove()
  }

  const videoKey = videos.results[0]?.key

  const trailerUrl = `https://youtube.com/embed/${videoKey}`

  if (trailerUrl && videoKey) {
    movieVideoPlayer.setAttribute("src", trailerUrl)

    const modal = document.querySelector(".modal")
    const exitModal = document.querySelector(".exit-modal")

    movieTrailerButton.addEventListener("click", () => {
      modal.classList.add("open")

      exitModal.addEventListener("click", () => {
        modal.classList.remove("open")
      })
    })

    videoPlayerOverlay.addEventListener("click", () => {
      const videoSrc = movieVideoPlayer.getAttribute("src")
      movieVideoPlayer.setAttribute("src", "")
      movieVideoPlayer.setAttribute("src", videoSrc)
    })
  } else {
    movieTrailerButton.remove()
  }
}
