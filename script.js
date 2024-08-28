const inputNomeProduto = document.getElementById("productName");
const inputPrecoProduto = document.getElementById("productPrice");
const inputCategoriaProduto = document.getElementById("categoryInput");
const botaoRegistrar = document.getElementById("botaoCadastro");
const corpoTabela = document.getElementById("bodyTable");
const filtroCategoria = document.getElementById("seletorCategoria");

function inicializarProdutos() {
    return JSON.parse(localStorage.getItem("produtosLista")) || [];
}

function adicionarProduto() {
    const nomeProduto = inputNomeProduto.value;
    const precoProduto = inputPrecoProduto.value;
    const categoriaProduto = inputCategoriaProduto.value;

    if (nomeProduto && precoProduto && categoriaProduto) {
        const novoProduto = {
            id: Date.now(),
            Nome: nomeProduto,
            Preco: precoProduto,
            Categoria: categoriaProduto,
        };

        const produtosArmazenados = inicializarProdutos();
        produtosArmazenados.push(novoProduto);

        localStorage.setItem("produtosLista", JSON.stringify(produtosArmazenados));
        exibirProdutos();

        inputNomeProduto.value = "";
        inputPrecoProduto.value = "";
        inputCategoriaProduto.value = "";

        atualizarFiltroCategorias();
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

function exibirProdutos(filtro = "") {
    const produtosArmazenados = inicializarProdutos();
    let linhasTabela = "";

    produtosArmazenados.forEach((produto) => {
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

    corpoTabela.innerHTML = linhasTabela;
}

function removerProduto(id) {
    let produtosArmazenados = inicializarProdutos();
    produtosArmazenados = produtosArmazenados.filter(produto => produto.id !== id);

    localStorage.setItem("produtosLista", JSON.stringify(produtosArmazenados));
    exibirProdutos();
    atualizarFiltroCategorias();
}

function atualizarFiltroCategorias() {
    const produtosArmazenados = inicializarProdutos();
    const categoriasDisponiveis = [...new Set(produtosArmazenados.map(produto => produto.Categoria))];

    filtroCategoria.innerHTML = '<option value="">Todas</option>';

    categoriasDisponiveis.forEach(categoria => {
        const opcao = document.createElement("option");
        opcao.value = categoria;
        opcao.textContent = categoria;
        filtroCategoria.appendChild(opcao);
    });
}

function aplicarFiltro() {
    const categoriaSelecionada = filtroCategoria.value;
    exibirProdutos(categoriaSelecionada);
}

function editarProduto(id) {
    const produtosArmazenados = inicializarProdutos();
    const produtoSelecionado = produtosArmazenados.find(p => p.id === id);

    if (produtoSelecionado) {
        const nomeNovo = prompt("Novo Nome do Produto:", produtoSelecionado.Nome);
        const precoNovo = prompt("Novo Preço do Produto:", produtoSelecionado.Preco);
        const categoriaNova = prompt("Nova Categoria do Produto:", produtoSelecionado.Categoria);

        if (nomeNovo && precoNovo && categoriaNova) {
            produtoSelecionado.Nome = nomeNovo;
            produtoSelecionado.Preco = precoNovo;
            produtoSelecionado.Categoria = categoriaNova;

            localStorage.setItem("produtosLista", JSON.stringify(produtosArmazenados));
            exibirProdutos();
            atualizarFiltroCategorias();
        } else {
            alert("Todos os campos são obrigatórios.");
        }
    }
}

botaoRegistrar.addEventListener("click", function (e) {
    e.preventDefault();
    adicionarProduto();
});

document.addEventListener("DOMContentLoaded", () => {
    exibirProdutos();
    atualizarFiltroCategorias();
});
