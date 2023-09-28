// Import necessary DOM elements
const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const playerForm = document.getElementById('player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-ET-WEB-PT-C';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${2302-ACC-ET-WEB-PT-C}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL + 'players');
        if (!response.ok) {
            throw new Error('Failed to fetch players');
        }
        const players = await response.json();
        return players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + `players/${playerId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch player #${playerId}`);
        }
        const player = await response.json();
        // Handle displaying player details (you can create a modal or another container for this)
        console.log(player);
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL + 'players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        if (!response.ok) {
            throw new Error('Failed to add the new player');
        }
        const newPlayer = await response.json();
        // You can handle the response as needed (e.g., display the new player card)
        console.log('New player added:', newPlayer);
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + `players/${playerId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to remove player #${playerId} from the roster`);
        }
        // Handle success (e.g., remove the player card from the DOM)
        console.log(`Player #${playerId} has been removed from the roster`);
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        // Clear the existing content in the player container
        playerContainer.innerHTML = '';

        // Loop through the playerList and create HTML for each player card
        playerList.forEach((player) => {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');

            // Create card content (you can customize this)
            const playerInfo = `
                <h3>${player.name}</h3>
                <p>Breed: ${player.breed}</p>
                <p>Age: ${player.age} years</p>
                <button class="details-button" data-player-id="${player.id}">See details</button>
                <button class="remove-button" data-player-id="${player.id}">Remove from roster</button>
            `;

            playerCard.innerHTML = playerInfo;
            playerContainer.appendChild(playerCard);

            // Add event listeners for the "See details" and "Remove from roster" buttons
            const detailsButton = playerCard.querySelector('.details-button');
            detailsButton.addEventListener('click', () => {
                const playerId = detailsButton.getAttribute('data-player-id');
                fetchSinglePlayer(playerId);
            });

            const removeButton = playerCard.querySelector('.remove-button');
            removeButton.addEventListener('click', () => {
                const playerId = removeButton.getAttribute('data-player-id');
                removePlayer(playerId);
            });
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        // Event listener for the form submission
        playerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Collect data from the form
            const name = document.getElementById('name').value;
            const breed = document.getElementById('breed').value;
            const age = document.getElementById('age').value;

            // Create a player object
            const newPlayerObj = {
                name,
                breed,
                age,
            };

            // Call the addNewPlayer function to add the player to the database
            await addNewPlayer(newPlayerObj);

            // After adding the player, fetch all players again and render them
            const players = await fetchAllPlayers();
            renderAllPlayers(players);

            // Clear the form fields
            playerForm.reset();
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

const init = async () => {
    // Fetch all players, render them, and render the new player form
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
};

init();