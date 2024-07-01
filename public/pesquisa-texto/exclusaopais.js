document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#maps tbody');
    const messageBox = document.getElementById('messageBox');

    // Função para renderizar a tabela com os dados dos países
    function renderTable(countries) {
        let html = '';
        countries.forEach(country => {
            html += `<tr>`;
            html += `<td><a href="#" class="country-link">${country.country_name}</a></td>`;
            html += `<td>${country.domain}</td>`;
            html += `<td>${country.driving_side}</td>`;
            html += `<td>${country.continent}</td>`;
            html += `<td>${country.license_plate_color}</td>`;
            html += `<td>${country.highway_color}</td>`;
            html += `<td>${country.pedestrian_sign}</td>`;
            html += `<td>${country.follow_cars}</td>`;
            html += `<td title="${new Date(country.updated).toString()}">${formatDate(country.updated)}</td>`;
            html += `<td><div class="tags">`;
            if (country.unique_features && country.unique_features.trim() !== '') {
                const tags = country.unique_features.split(',').map(tag => tag.trim());
                tags.forEach(tag => {
                    html += `<span class="tag">${tag}</span>`;
                });
            } else {
                html += `&nbsp;`;
            }
            html += `</div></td>`;
            html += `<td><button class="delete-button" data-country="${country.country_name}">Excluir</button></td>`; // Botão de Excluir
            html += `</tr>`;
        });
        tableBody.innerHTML = html;
    }

    // Evento de clique nos botões de Excluir
    tableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-button')) {
            const countryName = event.target.dataset.country;
            try {
                const response = await fetch(`https://api-dos-paises-xuyr5hgg2a-rj.a.run.app/countries/${encodeURIComponent(countryName)}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Erro ao excluir país.');
                }
                // Após excluir, remova o país da tabela
                const countries = await fetchCountriesData(); // Busca novamente os países
                renderTable(countries); // Renderiza a tabela com os novos dados
                showPopup('País excluído com sucesso.'); // Exibe popup de sucesso
            } catch (error) {
                console.error('Erro ao excluir país:', error.message);
            }
        }
    });

    // Função para exibir popup na tela
    function showPopup(message) {
        alert(message); // Exibe um popup com a mensagem
    }

    // Função para buscar os dados dos países
    async function fetchCountriesData() {
        try {
            const response = await fetch('https://api-dos-paises-xuyr5hgg2a-rj.a.run.app/countries/');
            if (!response.ok) {
                throw new Error('Erro ao buscar dados dos países.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar dados dos países:', error.message);
            return [];
        }
    }

    // Inicializa a tabela
    async function init() {
        try {
            const countries = await fetchCountriesData();
            renderTable(countries);
        } catch (error) {
            console.error('Erro ao inicializar a tabela:', error.message);
        }
    }

    init(); // Inicializa a tabela após o carregamento do DOM
});