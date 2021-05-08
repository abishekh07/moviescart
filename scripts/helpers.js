"use strict"

function getResponsiveImages() {
  let browserWidth = window.innerWidth
  let posterSize = browserWidth <= 1440 ? "w342" : "w500"

  return posterSize
}

async function getMovieInfo(movie_id) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}
    `
  )

  const infoList = await response.json()
  return infoList
}

function lazyload(target) {
  const io = new IntersectionObserver(
    (entries, observer) => {
      let entry = entries[0]

      const img = entry.target

      if (entry.isIntersecting) {
        img.src = img.dataset.src || "../images/placeholder.jpg"

        observer.disconnect()
      } else {
        img.src = "../images/placeholder.jpg"
      }
    },
    { rootMargin: "0px 0px -100px 0px" }
  )

  io.observe(target)
}

function generateCard(
  index,
  id,
  title,
  poster,
  release_year,
  movie_id,
  rating
) {
  const movieCard = document.createElement("figure")
  const moviePoster = document.createElement("img")
  const movieGenre = document.createElement("div")
  const movieDescription = document.createElement("figcaption")
  const movieDetails = document.createElement("div")
  const movieTitle = document.createElement("h2")
  const movieRuntime = document.createElement("span")
  const movieRating = document.createElement("span")
  const movieReleaseYear = document.createElement("span")

  let posterWidth = getResponsiveImages()

  let image_src = undefined

  if (poster) {
    image_src = `https://image.tmdb.org/t/p/${posterWidth}/${poster}`

    if (index <= 2) {
      moviePoster.setAttribute("src", image_src)
    } else {
      moviePoster.setAttribute("data-src", image_src)
      moviePoster.setAttribute("src", lazyload(moviePoster))
    }
  } else {
    moviePoster.setAttribute("src", "../images/no-image.jpg")
    moviePoster.style.objectPosition = "center center"
  }

  moviePoster.setAttribute("alt", "movie poster")
  moviePoster.setAttribute("class", "movie__img")

  movieTitle.textContent = title.split(":")[0]
  movieTitle.setAttribute("class", "movie__desc--title")
  movieDescription.appendChild(movieTitle)

  movieRating.textContent = rating.toFixed(1)
  movieRating.setAttribute("class", "movie__desc--rating")

  movieReleaseYear.textContent = release_year.split("-")[0]
  movieReleaseYear.setAttribute("class", "movie__desc--release-year")

  getMovieInfo(movie_id).then((infoList) => {
    let [genre1 = "default", genre2 = "default"] = infoList.genres
    let { runtime = 0 } = infoList

    movieGenre.textContent =
      infoList.genres.length >= 2
        ? `${genre1.name + ", " + genre2.name}`
        : `${genre1.name}`
    movieGenre.setAttribute("class", "movie__desc--genre")

    movieRuntime.textContent = `${runtime} mins`
    movieRuntime.setAttribute("class", "movie__desc--runtime")

    movieDetails.append(movieGenre, movieRating, movieRuntime, movieReleaseYear)
  })

  movieCard.append(moviePoster, movieDescription)
  movieDescription.appendChild(movieDetails)

  movieCard.setAttribute("class", "movie")
  movieCard.setAttribute("id", id)
  movieCard.style.width = `${posterWidth.substring(1)}px`
  movieDescription.setAttribute("class", "movie__desc")
  movieDetails.setAttribute("class", "movie__desc--details")

  return movieCard
}

export { generateCard }
