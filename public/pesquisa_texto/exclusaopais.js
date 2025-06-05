document.addEventListener('DOMContentLoaded', async function() {
    const tableBody = document.querySelector('#maps tbody');
    const messageBox = document.getElementById('messageBox');

    // Função para verificar se o usuário é admin
    async function fetchIsAdmin() {
        try {
            const response = await fetch('/is-admin');
            if (!response.ok) {
                throw new Error('Erro ao verificar permissões de administrador.');
            }
            const data = await response.json();
            return data.isAdmin;
        } catch (error) {
            console.error('Erro ao verificar permissões de administrador:', error.message);
            return false; // Retorna falso em caso de erro
        }
    }

    // Função para buscar os dados dos países
    async function fetchCountriesData() {
        try {
            const response = await fetch('https://api.geohelper.xyz/countries/');
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

    // Função para renderizar a tabela com os dados dos países
    async function renderTable(countries, isAdmin) {
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

            // Renderiza o botão "Excluir" somente se for admin
            if (isAdmin) {
                html += `<td><button class="delete-button" data-country="${country.country_name}">Excluir</button></td>`;
            } else {
                html += `<td></td>`; // Coluna vazia se não for admin
            }
            html += `</tr>`;
        });
        tableBody.innerHTML = html;

        // Evento de clique nos botões de Excluir (somente se for admin)
        if (isAdmin) {
            tableBody.addEventListener('click', async (event) => {
                if (event.target.classList.contains('delete-button')) {
                    const countryName = event.target.dataset.country;
                    try {
                        const response = await fetch(`https://api.geohelper.xyz/countries/${encodeURIComponent(countryName)}`, {
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
                        const isAdmin = await fetchIsAdmin();
                        await renderTable(countries, isAdmin); // Renderiza a tabela com os novos dados
                        showPopup('País excluído com sucesso.'); // Exibe popup de sucesso
                    } catch (error) {
                        console.error('Erro ao excluir país:', error.message);
                    }
                }
            });
        }
    }

    // Função para exibir popup na tela
    function showPopup(message) {
        alert(message); // Exibe um popup com a mensagem
    }

    // Inicializa a tabela
    async function init() {
        try {
            const [countries, isAdmin] = await Promise.all([fetchCountriesData(), fetchIsAdmin()]);
            await renderTable(countries, isAdmin);
        } catch (error) {
            console.error('Erro ao inicializar a tabela:', error.message);
        }
    }
    init();
});
