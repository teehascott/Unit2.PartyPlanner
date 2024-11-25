document.addEventListener('DOMContentLoaded', function() {
    const list = document.getElementById('list');
    const form = document.getElementById('form');

    function fetchParties() { // pull parties from api
        fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2410-FTB-ET-WEB-FT/events')
        .then(response => response.json())
        .then(parties => {
            if (Array.isArray(parties)) {
                renderParties(parties);
            } else {
                console.error('Fetched data is not an array:', parties);
            }
        })
        .catch(error => console.error('Error fetching parties:', error));
    }

    function renderParties(parties) { // render parties
        list.innerHTML = '';
        parties.forEach((party, index) => {
            const partyElement = document.createElement('div');
            partyElement.className = 'party';
            partyElement.innerHTML = `
                <strong>${party.name}</strong> - ${new Date(party.date).toLocaleString()} at ${party.location}<br>
                ${party.description}
                <span class="delete-button" data-id="${party.id}">Delete</span>
            `;
            list.appendChild(partyElement);
        });

        document.querySelectorAll('.delete-button').forEach(button => {  // delete button
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteParty(id);
            });
        });
    }

    function deleteParty(id) { // deletes party from api
        fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2410-FTB-ET-WEB-FT/events/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            fetchParties();
        })
        .catch(error => console.error('Error deleting party:', error));
    }

    form.addEventListener('submit', function(event) { // add new party
        event.preventDefault();
        const newParty = {
            name: document.getElementById('name').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            location: document.getElementById('loca').value,
            description: document.getElementById('desc').value
        };
        addParty(newParty);
    });

    function addParty(party) { // add new party to api
        const fullParty = {
            ...party,
            date: new Date(party.date + 'T' + party.time).toISOString() // date and time into iso string
        };
        delete fullParty.time; // remove time
        fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2410-FTB-ET-WEB-FT/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fullParty)
        })
        .then(() => {
            fetchParties();
        })
        .catch(error => console.error('Error adding party:', error));
    }
    fetchParties();  // display existing parties
});

