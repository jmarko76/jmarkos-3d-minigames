// search.js
// Prototype for handling the search functionality in for user scores
export async function initializeSearch(supabase) {
    const searchBtn = document.querySelector('#search-btn');
    const input = document.querySelector('#game-search-input');
    const resultsContainer = document.querySelector('#results-list');

    searchBtn.addEventListener('click', async () => {
        const searchTerm = input.value.trim();
        
    // Show a loading state
        resultsContainer.innerHTML = '<p>Searching...</p>';

        // The Query (The "Advanced" part)
        // We use .ilike() for case-insensitive search
        const { data, error } = await supabase
            .from('player_stats')
            .select('*')
            .ilike('game_id', `%${searchTerm}%`) 
            .order('score', { ascending: false });

        if (error) {
            resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
            return;
        }

        // Render the results
        renderResults(data, resultsContainer);
    });
}

function renderResults(data, container) {
    if (data.length === 0) {
        container.innerHTML = '<p>No stats found for that game.</p>';
        return;
    }

    container.innerHTML = data.map(stat => `
        <div class="stat-item">
            <strong>${stat.game_id}</strong>: ${stat.score} points 
            <span>(${new Date(stat.created_at).toLocaleDateString()})</span>
        </div>
    `).join('');
}