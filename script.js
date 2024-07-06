let searchInput = document.querySelector('.search-input');
let searchBtn = document.querySelector('.search-icon');
let imagesContainer = document.querySelector('.images-container');

let preloader = document.querySelector('.preloader');
let dark = document.querySelector('.dark');

let favorites = [];

searchInput.focus();

document.querySelector('.clear-input').addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
});

async function getData(text) {
    try {
        const url = `https://api.unsplash.com/search/photos?query=${text}&per_page=18&orientation=landscape&client_id=bkYBpv2kwxdNBZFJOXD4yEtciY-TJlN0pPdCZoPvCKA`
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
    
        let urls = [];
        
        if (data.results.length == 0) {
            imagesContainer.innerHTML = `<div class="error-box"><img class="not-found" src="images/search_no_result.png" width="320" height="320">
            <p class="error">Нечего не нашлось.<br>Попробуй другой запрос.</p></div>`;
        } else {
            data.results.forEach(item => {
                urls.push(item.urls.regular);
            });
            showImages(urls);
        }
    } catch {
        imagesContainer.innerHTML = `<div class="error-box"><img class="not-found" src="images/search_no_result.png" width="320" height="320">
        <p class="error">Слишком много запросов.<br>Проверь мою работу попозже пожалуйстаю.</p></div>`;
    }


}

function showImages(urls) {
    imagesContainer.innerHTML = ``;
    imagesContainer.style.transition = 'opacity 0s';
    imagesContainer.style.opacity = 0;
    imagesContainer.style.height = `calc(100vh - 150px)`;
    dark.style.width = 0;
    dark.style.opacity = 1;
    preloader.style.opacity = 1;
    favorites = JSON.parse(localStorage.getItem('favorites'));
    if (!favorites) {
        favorites = [];
    }
    urls.forEach(item => {
        let like = `<svg class="like" id=${item} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>`
        if (favorites.includes(item)) {
            like = `<svg class="like liked" id=${item} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>`
        }
            
        imagesContainer.innerHTML += `
        <div class="box">
            ${like}
            <img class="stock" src="${item}">
        </div>
        `;
    });
    let stockImages = imagesContainer.querySelectorAll('img');
    let loadCounter = 0;
    stockImages.forEach(img => {
        img.onload = () => {
            loadCounter++;
            console.log(loadCounter)
            dark.style.width = `calc((300px / ${stockImages.length}) * ${loadCounter})`;
            if (300 / stockImages.length * loadCounter > 299) {
                dark.style.opacity = 0;
                preloader.style.opacity = 0;
                setTimeout(() => {
                    imagesContainer.style.transition = 'opacity 0.5s';
                    imagesContainer.style.opacity = 1;
                    imagesContainer.style.height = 'auto'
                    updateLikes();
                }, 500);
            }
        }
    });
}

getData('spring');

searchBtn.addEventListener('click', () => {
    searchText = searchInput.value;
    getData(searchText);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        searchText = searchInput.value;
        getData(searchText);
    }
});

function togleTheme() {
    document.body.classList.toggle('dark-theme');
    document.querySelector('header').classList.toggle('dark-theme');
    document.querySelector('.logo-text').classList.toggle('dark-theme');
    document.querySelector('.logo-icon').classList.toggle('dark-theme');
    document.querySelector('.search-input').classList.toggle('dark-theme');
}

document.querySelector('#switch').addEventListener('change', togleTheme);

function updateLikes() {
    document.querySelectorAll('.like').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('liked');
            favorites = JSON.parse(localStorage.getItem('favorites'));
            if (!favorites) {
                favorites = [];
            }
            if (favorites.includes(item.id)) {
                console.log(favorites.indexOf(item.id))
                favorites.splice(favorites.indexOf(item.id), 1);
            } else {
                favorites.push(item.id);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });
}

document.querySelector('.favorites').addEventListener('click', () => {
    searchInput.value = ``;
    favorites = JSON.parse(localStorage.getItem('favorites'));
    if (favorites && favorites.length > 0) {
        showImages(favorites)
    } else {
        imagesContainer.innerHTML = `<div class="error-box"><img class="not-found" src="images/search_no_result.png" width="320" height="320">
        <p class="error">Нет любимых изображений.<br>Нажимай на сердечки на изображениях.</p></div>`;
    }
});