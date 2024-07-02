
const DATA = {
    countries: [],
    date: "2024-06-18T10:09:34.561Z"
};
let countries = [];


document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api-dos-paises-xuyr5hgg2a-rj.a.run.app/countries')
        .then(response => response.json())
        .then(data => {
            DATA.countries = data;
            countries = data; // Atualiza countries com os dados carregados
            init(); // Chama init após os dados serem carregados
        })
});

let selectedCol = 'country_name';
let selectedSortDir = 'asc';

function parseSortItem(item) {
    if (typeof item === 'string') {
        const s = item.toLowerCase();
        const prefixes = ['the ', 'an ', 'a '];

        for (const p of prefixes) {
            if (s.startsWith(p)) {
                return s.replace(p, '');
            }
        }

        return s;
    }

    return item;
}

function formatDate(str) {
    const date = new Date(str);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${d}-${m}-${y}`;
}

function displayCountries(col, sort_dir) {
    if (!Array.isArray(countries) || countries.length === 0) {
        console.warn('A lista de países ainda não foi carregada.');
        return;
    }

    selectedCol = col;
    selectedSortDir = sort_dir;

    countries.sort((a, b) => {
        a = parseSortItem(a[col]);
        b = parseSortItem(b[col]);

        if (typeof a === 'string' || typeof b === 'string') {
            if (sort_dir === 'desc') {
                return `${b}`.localeCompare(a);
            }
            return `${a}`.localeCompare(b);
        }

        return sort_dir === 'desc' ? b - a : a - b;
    });

    let html = '';

    for (const country of countries) {
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


    
        html += `</tr>`;
    }
    document.querySelector('#maps tbody').innerHTML = html;

    document.getElementById('maps').classList.toggle('is-hidden', countries.length === 0);

    for (const th of document.querySelectorAll('#maps th[data-sortable]')) {
        if (th.dataset.col === col) {
            th.dataset.sortDir = sort_dir;
        } else {
            th.dataset.sortDir = undefined;
        }
    }
}


function filterList() {
    const searchVal = document.getElementById('search').value.toLowerCase().trim();
    const shouldSearch = (!!searchVal && searchVal.length > 0);
    const filterList = {
        license_plate_color: document.getElementById('filter-locs').value,
        driving_side: document.getElementById('filter-type').value,
        continent: document.getElementById('filter-category').value,
        unique_features: document.getElementById('filter-tag').value.trim(),
        highway_color: document.getElementById('filter-highway-color').value,
        pedestrian_sign: document.getElementById('filter-pedestrian-sign').value,
        follow_cars: document.getElementById('filter-follow-cars').value,
    };

    // Limpa e mapeia as características únicas
    filterList.unique_features = filterList.unique_features ? filterList.unique_features.split(',').map(tag => tag.trim()) : [];

    countries = DATA.countries.filter(country => {
        // Aplica filtros individuais
        for (const key in filterList) {
            if (key === 'unique_features') {
                // Verifica se todas as características únicas correspondem
                const features = country.unique_features ? country.unique_features.split(',').map(tag => tag.trim().toLowerCase()) : [];
                const matches = filterList.unique_features.every(tag => features.includes(tag.toLowerCase()));
                if (!matches) return false;
            } else if (filterList[key] && filterList[key] !== country[key]) {
                // Compara os filtros padrão
                return false;
            }
        }

        // Verifica a pesquisa por texto
        if (shouldSearch) {
            const terms = searchVal.split(' ');
            let matched = 0;

            termSearch: for (let term of terms) {
                term = term.trim();
                if (term.length === 0) continue;

                // Verifica em várias colunas
                for (const col of ['country_name', 'domain', 'continent', 'license_plate_color', 'highway_color', 'pedestrian_sign', 'follow_cars']) {
                    if (typeof country[col] !== 'string') continue;
                    if (country[col].toLowerCase().includes(term)) {
                        matched++;
                        continue termSearch;
                    }
                }

                // Verifica nas características únicas
                if (country.unique_features) {
                    for (const tag of country.unique_features.split(',').map(tag => tag.trim())) {
                        if (tag.toLowerCase().includes(term)) {
                            matched++;
                            continue termSearch;
                        }
                    }
                }
            }

            // Retorna verdadeiro se todos os termos de pesquisa coincidirem
            return matched === terms.length;
        }

        return true;
    });

    displayCountries(selectedCol, selectedSortDir); // Atualiza a exibição dos países
}












function init() {

    // Função para popular filtros genéricos
    function populateFilter(filterId, dataKey) {
        const filterElement = document.getElementById(filterId);
        let dataSet = new Set();

        DATA.countries.forEach(country => {
            if (country[dataKey]) {
                dataSet.add(country[dataKey]);
            }
        });

        const dataArray = Array.from(dataSet).sort();

        // Limpar as opções anteriores
        filterElement.innerHTML = '<option value="">Não Sei</option>';

        // Adicionar as novas opções
        dataArray.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            filterElement.appendChild(option);
            
        });
    }

    populateFilter('filter-locs', 'license_plate_color');
    populateFilter('filter-type', 'driving_side');
    populateFilter('filter-category', 'continent');
    populateFilter('filter-highway-color', 'highway_color');
    populateFilter('filter-pedestrian-sign', 'pedestrian_sign');
    populateFilter('filter-follow-cars', 'follow_cars');


    

    // Populando as opções do filtro "Unique Features" manualmente
    const uniqueFeaturesFilter = document.getElementById('filter-tag');
    let uniqueFeaturesSet = new Set();
    
    DATA.countries.forEach(country => {
        if (country.unique_features) {
            country.unique_features.split(',').forEach(feature => {
                uniqueFeaturesSet.add(feature.trim());
            });
        }
    });
    
    const uniqueFeaturesArray = Array.from(uniqueFeaturesSet).sort();
    
    uniqueFeaturesFilter.innerHTML = '<option value="">Não Sei</option>';
    uniqueFeaturesArray.forEach(feature => {
        const option = document.createElement('option');
        option.value = feature;
        option.textContent = feature;
        uniqueFeaturesFilter.appendChild(option);
    });

    // Adicionando event listeners
    document.getElementById('search').addEventListener('change', filterList);
    document.getElementById('search').addEventListener('keyup', filterList);
    document.getElementById('filter-locs').addEventListener('change', filterList);
    document.getElementById('filter-type').addEventListener('change', filterList);
    document.getElementById('filter-category').addEventListener('change', filterList);
    document.getElementById('filter-tag').addEventListener('change', filterList);
    document.getElementById('filter-highway-color').addEventListener('change', filterList);
    document.getElementById('filter-pedestrian-sign').addEventListener('change', filterList);
    document.getElementById('filter-follow-cars').addEventListener('change', filterList);

    // Exibindo os países inicialmente
    if (countries && countries.length >= 0) {
        displayCountries(selectedCol, selectedSortDir);
    } else {
        console.warn('A lista de países não está disponível ao inicializar.');
    }

    // Definindo o foco no campo de busca
    document.getElementById('search').focus();
}

// Adicionando listener para o formulário de adicionar país
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-country-form');
    const tableBody = document.querySelector('#maps tbody');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        renderTable(countries); 



        const formData = new FormData(form);
        const countryData = {};
        formData.forEach((value, key) => {
            countryData[key] = value;
        });

        fetch('https://api-dos-paises-xuyr5hgg2a-rj.a.run.app/countries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(countryData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showSuccessPopup('País adicionado com sucesso.');
            fetchAndRenderCountries(); // Atualiza a tabela após adicionar o país
            resetForm();
        })
        .catch(error => {
            console.error('Error adding country:', error);
            showErrorPopup('Erro ao adicionar país. Verifique os dados e tente novamente.');
        });
    });
    
    // Função para buscar e renderizar os países na tabela
    async function fetchAndRenderCountries() {
        try {
            const response = await fetch('https://api-dos-paises-xuyr5hgg2a-rj.a.run.app/countries');
            if (!response.ok) {
                throw new Error('Erro ao buscar dados dos países.');
            }
            const countries = await response.json();
            renderTable(countries); // Renderiza a tabela com os países atualizados
        } catch (error) {
            console.error('Erro ao buscar e renderizar países:', error.message);
        }
    }
    

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

    // Função para exibir popup de sucesso
    function showSuccessPopup(message) {
        alert(message); // Você pode substituir alert por outra forma de popup, se desejar
    }

    // Função para exibir popup de erro
    function showErrorPopup(message) {
        alert(message); // Você pode substituir alert por outra forma de popup, se desejar
    }

    // Função para limpar o formulário após adicionar o país
    function resetForm() {
        form.reset();
    }

    // Inicializa a tabela após o carregamento do DOM
    fetchAndRenderCountries();
});
