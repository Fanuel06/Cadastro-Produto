// Referências aos elementos HTML para captura de entrada e manipulação da tabela
const inputNomeProduto = document.getElementById("productName"); // Captura o campo do nome do produto
const inputPrecoProduto = document.getElementById("productPrice"); // Captura o campo do preço do produto
const inputCategoriaProduto = document.getElementById("categoryInput"); // Captura o campo da categoria do produto
const botaoRegistrar = document.getElementById("botaoCadastro"); // Botão de cadastro de produto
const corpoTabela = document.getElementById("bodyTable"); // Corpo da tabela onde os produtos são exibidos
const filtroCategoria = document.getElementById("seletorCategoria"); // Seletor de categorias para filtrar os produtos

// Função que inicializa a lista de produtos a partir do localStorage ou retorna um array vazio se não houver produtos armazenados
function inicializarProdutos() {
    return JSON.parse(localStorage.getItem("produtosLista")) || [];
}

// Função que adiciona um novo produto à lista
function adicionarProduto() {
    const nomeProduto = inputNomeProduto.value; // Obtém o valor do nome do produto
    const precoProduto = inputPrecoProduto.value; // Obtém o valor do preço do produto
    const categoriaProduto = inputCategoriaProduto.value; // Obtém o valor da categoria do produto

    // Verifica se todos os campos estão preenchidos
    if (nomeProduto && precoProduto && categoriaProduto) {
        const novoProduto = {
            id: Date.now(), // Cria um ID único para o produto usando a data e hora atual
            Nome: nomeProduto,
            Preco: precoProduto,
            Categoria: categoriaProduto,
        };

        const produtosArmazenados = inicializarProdutos(); // Inicializa a lista de produtos do localStorage
        produtosArmazenados.push(novoProduto); // Adiciona o novo produto à lista

        localStorage.setItem("produtosLista", JSON.stringify(produtosArmazenados)); // Atualiza o localStorage com a lista de produtos
        exibirProdutos(); // Atualiza a exibição dos produtos na tabela

        // Limpa os campos de entrada após o cadastro
        inputNomeProduto.value = "";
        inputPrecoProduto.value = "";
        inputCategoriaProduto.value = "";

        atualizarFiltroCategorias(); // Atualiza o seletor de categorias
    } else {
        alert("Por favor, preencha todos os campos."); // Alerta se algum campo estiver vazio
    }
}

// Função que exibe os produtos na tabela, opcionalmente filtrando por categoria
function exibirProdutos(filtro = "") {
    const produtosArmazenados = inicializarProdutos(); // Inicializa a lista de produtos do localStorage
    let linhasTabela = ""; // String para armazenar as linhas da tabela

    produtosArmazenados.forEach((produto) => {
        // Se não houver filtro ou se o produto corresponder ao filtro, ele é adicionado à tabela
        if (!filtro || produto.Categoria === filtro) {
            linhasTabela += `<tr>
                                <td>${produto.Nome}</td>
                                <td>${produto.Preco}</td>
                                <td>${produto.Categoria}</td>
                                <td>
                                    <button class="botao-tabela" onclick="editarProduto(${produto.id})">Editar</button>
                                    <button class="botao-tabela" onclick="removerProduto(${produto.id})">Remover</button>
                                </td>
                              </tr>`;
        }
    });

    corpoTabela.innerHTML = linhasTabela; // Atualiza o corpo da tabela com as linhas de produtos
}

// Função que remove um produto da lista usando seu ID
function removerProduto(id) {
    let produtosArmazenados = inicializarProdutos(); // Inicializa a lista de produtos do localStorage
    produtosArmazenados = produtosArmazenados.filter(produto => produto.id !== id); // Filtra a lista para remover o produto com o ID correspondente

    localStorage.setItem("produtosLista", JSON.stringify(produtosArmazenados)); // Atualiza o localStorage com a lista de produtos
    exibirProdutos(); // Atualiza a exibição dos produtos na tabela
    atualizarFiltroCategorias(); // Atualiza o seletor de categorias
}

// Função que atualiza o seletor de categorias com base nas categorias dos produtos armazenados
function atualizarFiltroCategorias() {
    const produtosArmazenados = inicializarProdutos(); // Inicializa a lista de produtos do localStorage
    const categoriasDisponiveis = [...new Set(produtosArmazenados.map(produto => produto.Categoria))]; // Cria uma lista única de categorias

    filtroCategoria.innerHTML = '<option value="">Todas</option>'; // Adiciona a opção "Todas" ao seletor

    categoriasDisponiveis.forEach(categoria => {
        const opcao = document.createElement("option"); // Cria uma nova opção para cada categoria
        opcao.value = categoria;
        opcao.textContent = categoria;
        filtroCategoria.appendChild(opcao); // Adiciona a nova opção ao seletor
    });
}

// Função que aplica um filtro baseado na categoria selecionada pelo usuário
function aplicarFiltro() {
    const categoriaSelecionada = filtroCategoria.value; // Obtém a categoria selecionada pelo usuário
    exibirProdutos(categoriaSelecionada); // Exibe os produtos filtrados pela categoria
}

// Função que permite a edição de um produto existente
function editarProduto(id) {
    const produtosArmazenados = inicializarProdutos(); // Inicializa a lista de produtos do localStorage
    const produtoSelecionado = produtosArmazenados.find(p => p.id === id); // Encontra o produto pelo ID

    if (produtoSelecionado) {
        // Pede ao usuário novos valores para nome, preço e categoria do produto
        const nomeNovo = prompt("Novo Nome do Produto:", produtoSelecionado.Nome);
        const precoNovo = prompt("Novo Preço do Produto:", produtoSelecionado.Preco);
        const categoriaNova = prompt("Nova Categoria do Produto:", produtoSelecionado.Categoria);

        if (nomeNovo && precoNovo && categoriaNova) {
            // Atualiza o produto com os novos valores
            produtoSelecionado.Nome = nomeNovo;
            produtoSelecionado.Preco = precoNovo;
            produtoSelecionado.Categoria = categoriaNova;

            localStorage.setItem("produtosLista", JSON.stringify(produtosArmazenados)); // Atualiza o localStorage com a lista de produtos
            exibirProdutos(); // Atualiza a exibição dos produtos na tabela
            atualizarFiltroCategorias(); // Atualiza o seletor de categorias
        } else {
            alert("Todos os campos são obrigatórios."); // Alerta se algum campo estiver vazio
        }
    }
}

// Adiciona um evento ao botão de cadastro para que a função adicionarProduto seja chamada ao ser clicado
botaoRegistrar.addEventListener("click", function (e) {
    e.preventDefault(); // Previne o comportamento padrão de submit do formulário
    adicionarProduto(); // Chama a função para adicionar o produto
});

// Evento que garante que os produtos sejam exibidos e o filtro de categorias seja atualizado ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    exibirProdutos(); // Exibe os produtos na tabela
    atualizarFiltroCategorias(); // Atualiza o seletor de categorias
});
