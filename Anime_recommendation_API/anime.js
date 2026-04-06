let allAnime = [];
let favorites = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    document.getElementById('search-input').addEventListener('input', updateUI);
    document.getElementById('sort-select').addEventListener('change', updateUI);
    document.getElementById('theme-btn').addEventListener('click', toggleTheme);

    const genreButtons = document.querySelectorAll('.genre-btn');
    genreButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            genreButtons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            updateUI();
        });
    });
});

async function fetchData() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime');
        const data = await response.json();
        allAnime = data.data;
        updateUI();
    } catch (error) {
        document.getElementById('anime-list').innerHTML = '<p class="error-msg">Failed to load data.</p>';
    }
}

function updateUI() {
    const searchKeyword = document.getElementById('search-input').value.toLowerCase();
    const sortValue = document.getElementById('sort-select').value;
    const activeGenreButton = document.querySelector('.genre-btn.active');
    const genreValue = activeGenreButton ? activeGenreButton.dataset.genre.toLowerCase() : 'all';

    let filteredAnime = allAnime.filter(anime => {
        const matchesTitle = anime.title.toLowerCase().includes(searchKeyword);
        return matchesTitle;
    });

    if (genreValue !== 'all') {
        filteredAnime = filteredAnime.filter(anime => {
            const hasGenre = anime.genres.some(genre => genre.name.toLowerCase() === genreValue);
            return hasGenre;
        });
    }

    if (sortValue === 'alphabetical') {
        filteredAnime.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'alphabetical-desc') {
        filteredAnime.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortValue === 'rank') {
        filteredAnime.sort((a, b) => (a.rank || 0) - (b.rank || 0));
    } else if (sortValue === 'score') {
        filteredAnime.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (sortValue === 'episodes') {
        filteredAnime.sort((a, b) => (a.episodes || 0) - (b.episodes || 0));
    }

    renderAnime(filteredAnime);
}

function renderAnime(animeArray) {
    const container = document.getElementById('anime-list');
    
    if (animeArray.length === 0) {
        container.innerHTML = '<p class="error-msg">No anime matches your criteria.</p>';
        return;
    }

    const htmlArray = animeArray.map(anime => {
        const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
        const score = anime.score || '-';
        const episodes = anime.episodes || '?';
        const type = anime.type || 'TV';
        
        const isFavorite = favorites.find(favId => favId === anime.mal_id);
        const favoriteText = isFavorite ? '❤️' : '🤍';
        const favClass = isFavorite ? 'fav-btn active' : 'fav-btn';

        return `
            <div class="anime-card">
                <div class="card-img-wrapper">
                    <img src="${imageUrl}" alt="${anime.title}">
                    <div class="card-badges">
                        <span class="badge quality">CC</span>
                        <span class="badge ep">EP ${episodes}</span>
                    </div>
                    <div class="card-overlay">
                        <button class="play-btn">▶</button>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${anime.title}</h3>
                    <div class="card-meta">
                        <span class="type">${type}</span>
                        <span class="dot">•</span>
                        <span class="score">⭐ ${score}</span>
                    </div>
                    <div class="card-actions">
                        <button class="${favClass}" onclick="toggleFavorite(${anime.mal_id})">${favoriteText}</button>
                        <button class="toggle-btn" onclick="toggleViewMore(this)">Details</button>
                    </div>
                    <p class="more-info" style="display: none;">${anime.synopsis ? anime.synopsis.substring(0, 110) + '...' : 'No details available.'}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = htmlArray.join('');
}

function toggleFavorite(id) {
    const isLoved = favorites.find(favId => favId === id);
    if (isLoved) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    updateUI();
}

function toggleViewMore(button) {
    const moreInfo = button.parentElement.nextElementSibling;
    if (moreInfo.style.display === 'none') {
        moreInfo.style.display = 'block';
    } else {
        moreInfo.style.display = 'none';
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
}