$(document).ready(function() {
    // Variables para controlar la paginación
    let offset = 0;
    const limit = 20;
    let currentPage = 1;
    let totalPages = 0;
  
    // Función para obtener los datos de los Pokémon de la API
    function getPokemonData() {
      const apiUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
  
      axios.get(apiUrl)
        .then(function(response) {
          const pokemonList = response.data.results;
          totalPages = Math.ceil(response.data.count / limit);
  
          // Limpia el contenedor de Pokémon
          $("#pokemonContainer").empty();
  
          // Recorre la lista de Pokémon y crea las tarjetas
          pokemonList.forEach(function(pokemon) {
            createPokemonCard(pokemon);
          });
  
          // Actualiza los enlaces de paginación
          updatePagination();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  
    // Función para crear una tarjeta de Pokémon
    function createPokemonCard(pokemon) {
      const cardHtml = `
        <div class="card">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.url)}.png" class="card-img-top" alt="${pokemon.name}">
          <div class="card-body">
            <h5 class="card-title">${capitalizeFirstLetter(pokemon.name)}</h5>
            <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#pokemonModal" data-url="${pokemon.url}">Ver detalles</a>
          </div>
        </div>
      `;
  
      $("#pokemonContainer").append(cardHtml);
    }
  
    // Función para obtener el ID de un Pokémon a partir de su URL
    function getPokemonId(url) {
      const parts = url.split("/");
      return parts[parts.length - 2];
    }
  
    // Función para convertir la primera letra de una cadena a mayúscula
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  
    // Función para actualizar los enlaces de paginación
    function updatePagination() {
      $("#currentPage").text(currentPage);
      $("#previousPage").toggleClass("disabled", currentPage === 1);
      $("#nextPage").toggleClass("disabled", currentPage === totalPages);
    }
  
    // Función para mostrar la ventana modal con los detalles de un Pokémon
    function showPokemonModal(url) {
      axios.get(url)
        .then(function(response) {
          const pokemon = response.data;
  
          // Limpia el contenido de la ventana modal
          $("#pokemonSpecs").empty();
  
          // Agrega los detalles del Pokémon a la ventana modal, Agrega los detalles de los pokemones obtenidos de la API
          $("#pokemonModalLabel").text(capitalizeFirstLetter(pokemon.name));
          $("#pokemonSpecs").append(`<li class="list-group-item"><strong>Altura:</strong> ${pokemon.height}</li>`);
          $("#pokemonSpecs").append(`<li class="list-group-item"><strong>Peso:</strong> ${pokemon.weight}</li>`);
          $("#pokemonSpecs").append(`<li class="list-group-item"><strong>Habilidades:</strong></li>`);
          pokemon.abilities.forEach(function(ability) {
            $("#pokemonSpecs").append(`<li class="list-group-item">${capitalizeFirstLetter(ability.ability.name)}</li>`);
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  
    // Evento de clic para el botón de paginación "Previous", Me deja ir a la anterior pagina 
    $("#previousPage").click(function() {
      if (currentPage > 1) {
        currentPage--;
        offset -= limit;
        getPokemonData();
      }
    });
  
    // Evento de clic para el botón de paginación "Next", Me permite cambiar de pagina asi mostrando mas pokémon
    $("#nextPage").click(function() {
      if (currentPage < totalPages) {
        currentPage++;
        offset += limit;
        getPokemonData();
      }
    });
  
    // Evento de clic para el botón "Ver detalles" en la tarjeta de Pokémon, Me permite que al dar click en ver detalles se muestre una ventana
    $(document).on("click", ".card .btn", function() {
      const url = $(this).data("url");
      showPokemonModal(url);
    });
  
    // Obtiene los datos iniciales de los Pokémon, Muy importante para saber que se muestra obtenido de la API
    getPokemonData();
  });
  