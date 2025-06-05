
  const genreSelect = document.getElementById("genreSelect");
  const backgroundContainer = document.getElementById("backgroundContainer");

  const backgroundImages = {
    "all": "images/all.png",
    "action": "images/action.png",
    "comedy": "images/comedy.png",
    "drama": "images/drama.png",
    "horror": "images/horror.png",
    "sci-fi": "images/sci-fi.png",
    "romance": "images/romance.png",
    "thriller": "images/thriller.png",
    "fantasy": "images/abtauchen.png"
  };

  function updateBackground() {
    const selectedGenre = genreSelect.value;
    const imageUrl = backgroundImages[selectedGenre];
    backgroundContainer.style.backgroundImage = `url('${imageUrl}')`;
  }

  genreSelect.addEventListener("change", updateBackground);

  // Initial load
  window.addEventListener("DOMContentLoaded", updateBackground);




//  Your personal OMDb API key
    const apiKey = "51f2c073";

    //  Pre-defined keyword lists to simulate genre filtering
    const genreKeywords = {
      "all": ["life", "story", "dream", "night", "lost", "world", "secret", "mission", "power"],
      "action": ["war", "battle", "fight", "explosion", "chase", "guns", "revenge"],
      "comedy": ["funny", "crazy", "vacation", "party", "family", "friend", "awkward"],
      "drama": ["truth", "family", "life", "past", "story", "journey", "hope"],
      "horror": ["ghost", "haunted", "nightmare", "dark", "death", "killer", "zombie"],
      "sci-fi": ["space", "alien", "future", "robot", "galaxy", "time", "cyber"],
      "romance": ["love", "kiss", "valentine", "heart", "wedding", "sweet", "passion"],
      "thriller": ["crime", "murder", "detective", "spy", "secret", "danger"],
      "fantasy": ["magic", "dragon", "kingdom", "sword", "legend", "elf"]
    };

    //  Main function to fetch and display a random movie
    async function getRandomMovie() {
      //  Get the selected genre from the dropdown
      const genre = document.getElementById("genreSelect").value;

      //  Get a random keyword for the selected genre
      const keywordList = genreKeywords[genre] || genreKeywords["all"];
      const keyword = keywordList[Math.floor(Math.random() * keywordList.length)];

      //  Create a search URL for the OMDb API using the keyword
      const searchUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${keyword}&type=movie`;

      try {
        //  Fetch movies using the keyword
        const res = await fetch(searchUrl);
        const data = await res.json();

        //  If results are found
        if (data.Search && data.Search.length > 0) {
          //  Pick one random movie from the results
          const randomIndex = Math.floor(Math.random() * data.Search.length);
          const movieId = data.Search[randomIndex].imdbID;

          //  Fetch full movie details using imdbID
          const movieRes = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}&plot=short`);
          const movieData = await movieRes.json();

          //  Check if the selected genre is in the actual movie’s genre field
          if (genre === "all" || movieData.Genre.toLowerCase().includes(genre)) {
            //  If genre matches, display it
            displayMovie(movieData);
          } else {
            //  Otherwise, retry and get a new one
            getRandomMovie();
          }
        } else {
          //  No results found
          document.getElementById("movie").innerHTML = "<p>No movie found. Try again!</p>";
        }
      } catch (error) {
        //  Catch any fetch or parsing errors
        document.getElementById("movie").innerHTML = "<p>Error fetching movie data.</p>";
        console.error(error);
      }
    }

    //  Function to insert movie details into the HTML
    function displayMovie(movie) {
      //  Fallback image if poster is missing
      const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400x600?text=No+Image";

      //  Build HTML structure for movie card
      const movieDiv = document.getElementById("movie");
      movieDiv.innerHTML = `
    <div class="movie-container">
     <div class="poster-container">
       <img src="${poster}" alt="${movie.Title} poster"/>
      </div>
      <div class="info-container">
        <h2>${movie.Title} (${movie.Year})</h2>
        <p><span class="label">Director:</span> ${movie.Director}</p>
        <p><span class="label">Rating:</span> ${movie.imdbRating}</p>
        <p><span class="label">Genre:</span> ${movie.Genre}</p>
        <p><span class="label">Plot:</span> ${movie.Plot}</p>
      </div>
    </div>
`;
    }
