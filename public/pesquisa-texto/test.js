document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.getElementById('modal');
    const tableBody = document.querySelector('#maps tbody');
    let currentCountry = null;

    // Função para buscar os dados de um país na API
    async function fetchCountryData(countryName) {
        const endpoint = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`;
        try {
            // Faz a requisição para a API
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Erro ao buscar o país.');
            }
            const [data] = await response.json();
            return data;
        } catch (error) {
            console.error(`Erro ao buscar país ${countryName}:`, error.message);
            throw new Error(`Erro ao buscar país ${countryName}`);
        }
    }

    // Função para renderizar as linhas da tabela com os dados dos países
    async function renderTable() {
        try {
            const countries = await fetchCountriesData();

            // Limpa o conteúdo atual da tabela
            tableBody.innerHTML = '';

            countries.forEach(country => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="#" class="country-link">${country.name.common}</a></td>
                    <td>${country.tld ? country.tld[0] : '-'}</td>
                    <td>${country.translations.por ? country.translations.por.common : '-'}</td>
                    <td>${country.region}</td>
                    <td>${country.flags ? country.flags.license_plate : '-'}</td>
                    <td>${country.flags ? country.flags.highway : '-'}</td>
                    <td>${country.flags ? country.flags.pedestrian : '-'}</td>
                    <td>${country.flags ? country.flags.follow : '-'}</td>
                    <td>${country.updated ? new Date(country.updated).toString() : '-'}</td>
                    <td>${country.tags ? country.tags.join(', ') : '-'}</td>
                    <td>${country.flags ? country.flags.band : '-'}</td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao renderizar tabela:', error.message);
        }
    }

    // Função para abrir a janela modal com os detalhes do país clicado
    async function openCountryModal(countryName) {
        try {
            const country = await fetchCountryData(countryName);

            // Extrai as informações da moeda
            const currencyKeys = country.currencies ? Object.keys(country.currencies) : [];
            const currencies = currencyKeys.map(key => {
                const currency = country.currencies[key];
                return `${currency.name} (${currency.symbol})`;
            }).join(', ');

            // Monta o HTML com as informações do país
            const modalContent = `
                <div>
                    <button class="close-button" id="closeModal">X</button>
                    <h2>${country.name.common}</h2>
                    <p><strong>Dominio: </strong>${country.tld ? country.tld[0] : '-'}</p>
                    <p><strong>Moeda:</strong> ${currencies || 'N/A'}</p>
                    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                    <p><strong>Línguas:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                    <p><strong>População:</strong> ${country.population ? country.population.toLocaleString() : 'N/A'}</p>
                    <img src="${country.flags?.svg || ''}" alt="Bandeira de ${country.name.common}" class="flag-image">
                </div>
            `;

            // Atualiza o conteúdo da janela modal com as informações do país
            document.getElementById('modalContent').innerHTML = modalContent;

            // Adiciona a classe de animação ao modal e exibe a janela modal
            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('opening');
            }, 50);

            // Adiciona o ouvinte de evento para o botão de fechar
            const closeButton = document.getElementById('closeModal');
            closeButton.addEventListener('click', () => {
                modal.classList.remove('opening'); // Remove a classe de animação
                setTimeout(() => {
                    modal.style.display = 'none'; // Fecha a janela modal após a animação
                }, 800);
            });

        } catch (error) {
            console.error(`Dados não encontrados para o país ${countryName}`);
        }
    }

    // Função para buscar os dados dos países na API
    async function fetchCountriesData() {
        const endpoint = 'https://restcountries.com/v3.1/all';
        try {
            // Faz a requisição para a API
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Erro ao buscar os países.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar países:', error.message);
            return []; // Retorna um array vazio em caso de erro
        }
    }

    renderTable(); // Chama a função para renderizar a tabela inicialmente

    // Ouvinte de evento para abrir a janela modal ao clicar no link do país
    tableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('country-link')) {
            event.preventDefault(); // Evita a ação padrão de navegação do link

            // Obtém o texto do link do país clicado
            const countryName = event.target.textContent.trim();

            // Abre a janela modal com os detalhes do país clicado
            await openCountryModal(countryName);
        }
    });

    // Ouvinte de evento para mostrar a miniatura da bandeira ao passar o mouse sobre o nome do país
    tableBody.addEventListener('mouseover', async (event) => {
        if (event.target.classList.contains('country-link')) {
            const countryName = event.target.textContent.trim();
            const country = await fetchCountryData(countryName);
            const flagImage = document.createElement('img');
            flagImage.classList.add('flag-thumbnail');
            flagImage.src = country.flags?.svg || '';
            event.target.appendChild(flagImage);
        }
    });

    // Ouvinte de evento para remover a miniatura da bandeira ao retirar o mouse do nome do país
    tableBody.addEventListener('mouseout', (event) => {
        if (event.target.classList.contains('country-link')) {
            const flagThumbnail = event.target.querySelector('.flag-thumbnail');
            if (flagThumbnail) {
                flagThumbnail.remove();
            }
        }
    });

    // Ouvinte de evento para fechar o modal ao clicar no nome do país na tabela
    tableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('country-link')) {
            event.preventDefault(); // Evita a ação padrão de navegação do link

            // Obtém o texto do link do país clicado
            const countryName = event.target.textContent.trim();

            // Fecha o modal se já estiver aberto para o mesmo país
            if (currentCountry === countryName && modal.style.display === 'block') {
                modal.classList.remove('opening'); // Remove a classe de animação
                setTimeout(() => {
                    modal.style.display = 'none'; // Fecha a janela modal após a animação
                }, 800);
                currentCountry = null;
                return;
            }

            // Abre a janela modal com os detalhes do país clicado
            await openCountryModal(countryName);
            currentCountry = countryName;
        }
    });

    // Ouvinte de evento para fechar o modal ao clicar fora da janela modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('opening'); // Remove a classe de animação
            setTimeout(() => {
                modal.style.display = 'none'; // Fecha a janela modal após a animação
            }, 800);
            currentCountry = null;
        }
    });

    // Ouvinte de evento para fechar o modal ao pressionar a tecla Esc
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.classList.remove('opening'); // Remove a classe de animação
            setTimeout(() => {
                modal.style.display = 'none'; // Fecha a janela modal após a animação
            }, 800);
            currentCountry = null;
        }
    });

});










document.addEventListener('DOMContentLoaded', function() {
    const selectImage = document.getElementById('select-image');
    const forms = document.querySelectorAll('.add-country-form');


    forms.forEach(form => {
        const closeButton = form.querySelector('.close-btn');
        const formContent = form.querySelector('form');

        closeButton.addEventListener('click', function() {
            form.classList.remove('active');
        });

        form.addEventListener('click', function(event) {
            if (event.target === form) {
                form.classList.remove('active');
            }
        });

        formContent.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });

    const submitButtons = document.querySelectorAll('.botao');
    submitButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const form = this.closest('form');
            const formData = new FormData(form);

            console.log('Formulário enviado com sucesso!');
        });
    });
});





