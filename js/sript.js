let elForm = document.querySelector(".js-form");
let elInput = document.querySelector(".js-input");
let elSelect = document.querySelector(".js-select");
let elList = document.querySelector(".js-list");
let elTemplate = document.querySelector("#js-template").content;

let elBtns = document.querySelectorAll(".list-pagination-item");
let elPage = document.querySelector(".page-text");

let elBookmark = document.querySelector(".bookmark");
let elBookmarkOppen = document.querySelector(".bookmark-oppen");
let elBookmarkClouse = document.querySelector(".bookmark-clouse");
let elBookmarkList = document.querySelector(".bookmark-list");

let elLader = document.querySelector(".js-loader");

let page = 1;
let movieTitle = "hulk";

let bookmarkArr = JSON.parse(localStorage.getItem("movies")) || [];

//ServerFetching

const fetchingMovies = async (movieTitle, movieType = "movie") => {
   try{
    let response = await fetch(`https://omdbapi.com/?apikey=a75504ec&s=${movieTitle}&page=${page}&type=${movieType}`)
    let data = await response.json()
    rendringList(data.Search);
   }catch (e) {
    console.log(e.message);
   }finally{
        elLader.classList.add("d-none")
   }
}

const fetchingMovie = async (movieImdbId) => {
    try{
     let response = await fetch(`https://omdbapi.com/?apikey=a75504ec&i=${movieImdbId}`)
     let data = await response.json()
     bookmarkAddMovie(data);
    }catch (e) {
     console.log(e.message);
    }
}

fetchingMovies(movieTitle)

//ListRender

const createItem = (movie) => {
    let elItem = elTemplate.cloneNode(true);
    elItem.querySelector(".js-img").src = movie.Poster;
    elItem.querySelector(".js-img").alt = movie.Title;
    elItem.querySelector(".js-title").textContent = movie.Title.slice(0,12) + "...";
    elItem.querySelector(".js-type").textContent = movie.Type;
    elItem.querySelector(".js-year").textContent = movie.Year;
    elItem.querySelector(".js-more").dataset.imdbID = movie.imdbID;
    elItem.querySelector(".js-bookmark").dataset.imdbID = movie.imdbID;

    return elItem
} 

function rendringList (movies) {
    elList.innerHTML = null;
    
    modalRender(movies)
    let wrapperList = document.createDocumentFragment();

    movies.forEach(movie => {
        wrapperList.appendChild(createItem(movie));
    })

    elList.appendChild(wrapperList);
}

//FormSubmit

elForm.addEventListener("submit", evt => {
    evt.preventDefault();
    elList.innerHTML = null;

    elLader.classList.remove("d-none")

    page = 1
    elPage.textContent = page

    movieTitle = elInput.value.trim();
    fetchingMovies(movieTitle, elSelect.value);

    elInput.value = "";

})

//Pagination  

elBtns[0].addEventListener("click", () => {
    if(page > 1) {
        page--
        elPage.textContent = page
        fetchingMovies(movieTitle, elSelect.value);
    } 
})

elBtns[2].addEventListener("click", () => {
    if(page) {
        page++
        elPage.textContent = page
        fetchingMovies(movieTitle, elSelect.value);
    } 
})

//Modal

function modalRender (movies) {
    elList.addEventListener("click", (evt) => {
        if(evt.target.matches(".js-more")) {
            let movieId = evt.target.dataset.imdbID;
            console.log(movieId);
            let findMovie = movies.find(movie => movie.imdbID === movieId);
            let elModalImg = document.querySelector(".modal-img").src = findMovie.Poster
                elModalImg = document.querySelector(".modal-img").alt = findMovie.Title

            let elModalTitle = document.querySelector(".modal-title").textContent = findMovie.Title;
            let elModalType = document.querySelector(".modal-type").textContent ="Type: " + findMovie.Type;
            let elModaltext = document.querySelector(".modal-year").textContent ="Year: " + findMovie.Year
        }
    }) 
}   

//BookMark


elList.addEventListener("click", (evt) => {
    if(evt.target.matches(".js-bookmark")) {
        let movieId = evt.target.dataset.imdbID;

        fetchingMovie(movieId)
    }
}) 

function bookmarkAddMovie (movie) {
    bookmarkArr.push(movie);
    bookmarkListRender(bookmarkArr)
    localStorage.setItem("movies", JSON.stringify(bookmarkArr))
}                               

function bookmarkListRender (bookMovies) {
    elBookmarkList.innerHTML = null;

    bookMovies.forEach(bookMovie => {
        elBookmarkList.innerHTML += `
            <li class="col-12 col-sm-6 px-0">
                <div class="card mx-auto d-flex flex-column justify-content-between" style="width: 200px; min-height:280px">
                    <img class="card-img js-img" src="${bookMovie.Poster}" alt="" width="200" height="200px">
                    <h3 class="card-title mb-0 js-title text-center fs-5 mt-1">${bookMovie.Title}</h3>
                    <button class="btn btn-danger w-100 delete-item" id ="${bookMovie.imdbID}">Delete</button>
                </div>           
            </li>
        `
    })
}

bookmarkListRender(bookmarkArr)

function bookmarkRemoveMovie () {
   elBookmarkList.addEventListener("click",evt => {
    if(evt.target.matches(".delete-item")) {
        let movieId = evt.target.id

       let movieIndex =  bookmarkArr.findIndex(movie => movie.imdbID == movieId)
       bookmarkArr.splice(movieIndex,1)

       bookmarkListRender(bookmarkArr)
       localStorage.setItem("movies", JSON.stringify(bookmarkArr))
    }
   })
}

bookmarkRemoveMovie()


elBookmarkOppen.addEventListener("click", () => {
    elBookmark.style.right = "0"
    document.body.style.backgroundColor = "#000"
})    

elBookmarkClouse.addEventListener("click", () => {
    elBookmark.style.right = "-500px"
})  
