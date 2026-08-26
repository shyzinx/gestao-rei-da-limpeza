const navItems = document.querySelectorAll(".nav-item");

const pageTitle = document.querySelector(".page-header h1");
const pageBreadcrumb = document.querySelector(".page-breadcrumb");
const pageDescription = document.querySelector(".page-header p");

const pageContent = document.querySelector("#page-content");


const pages = {
    dashboard: {
        title: "Dashboard",
        breadcrumb: "Visão geral",
        description: "Acompanhe o desempenho do Rei da Limpeza."
    },

    clientes: {
        title: "Clientes",
        breadcrumb: "Gestão",
        description: "Cadastre e gerencie os clientes do Rei da Limpeza."
    },

    servicos: {
        title: "Serviços",
        breadcrumb: "Gestão",
        description: "Gerencie os serviços realizados e cadastrados."
    },

    agenda: {
        title: "Agenda",
        breadcrumb: "Gestão",
        description: "Visualize e organize os próximos serviços."
    },

    funcionarios: {
        title: "Funcionários",
        breadcrumb: "Gestão",
        description: "Gerencie os funcionários do Rei da Limpeza."
    },

    financeiro: {
        title: "Financeiro",
        breadcrumb: "Gestão",
        description: "Acompanhe entradas, pagamentos e movimentações."
    },

    relatorios: {
        title: "Relatórios",
        breadcrumb: "Gestão",
        description: "Consulte os relatórios do negócio."
    }
};


// =====================================================
// CLIENTES
// =====================================================

function pegarClientes() {

    const dados = localStorage.getItem("clientesReiDaLimpeza");

    if (!dados) {
        return [];
    }

    try {
        return JSON.parse(dados);
    } catch (erro) {
        console.error("Erro ao carregar clientes:", erro);
        return [];
    }
}


function salvarClientes(clientes) {

    localStorage.setItem(
        "clientesReiDaLimpeza",
        JSON.stringify(clientes)
    );

}


// =====================================================
// TELA DE CLIENTES
// =====================================================

function renderClientes() {

    pageContent.innerHTML = `

        <div class="clientes-page">

            <div class="clientes-toolbar">

                <div class="clientes-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        id="buscar-cliente"
                        placeholder="Buscar cliente..."
                    >

                </div>


                <button
                    class="primary-button"
                    id="novo-cliente"
                >
                    + Novo cliente
                </button>

            </div>


            <div class="panel">

                <div class="panel-header">

                    <div>

                        <h2>
                            Clientes cadastrados
                        </h2>

                        <p id="total-clientes">
                            0 clientes cadastrados
                        </p>

                    </div>

                </div>


                <div class="table-container">

                    <table>

                        <thead>

                            <tr>
                                <th>Cliente</th>
                                <th>Telefone</th>
                                <th>E-mail</th>
                                <th>Endereço</th>
                                <th>Ações</th>
                            </tr>

                        </thead>


                        <tbody id="clientes-tabela">

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    `;


    atualizarTabelaClientes();


    document
        .querySelector("#novo-cliente")
        .addEventListener("click", () => {

            abrirFormularioCliente();

        });


    document
        .querySelector("#buscar-cliente")
        .addEventListener("input", (event) => {

            atualizarTabelaClientes(event.target.value);

        });

}


// =====================================================
// TABELA
// =====================================================

function atualizarTabelaClientes(busca = "") {

    const tabela = document.querySelector("#clientes-tabela");

    if (!tabela) {
        return;
    }


    const clientes = pegarClientes();

    const termo = busca.toLowerCase().trim();


    const filtrados = clientes.filter(cliente => {

        return (
            cliente.nome.toLowerCase().includes(termo) ||
            cliente.telefone.toLowerCase().includes(termo) ||
            (cliente.email || "").toLowerCase().includes(termo)
        );

    });


    tabela.innerHTML = "";


    filtrados.forEach(cliente => {

        const iniciais = cliente.nome
            .split(" ")
            .map(nome => nome.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();


        const linha = document.createElement("tr");


        linha.innerHTML = `

            <td>

                <div class="client-cell">

                    <div class="client-avatar">
                        ${iniciais}
                    </div>

                    <strong>
                        ${cliente.nome}
                    </strong>

                </div>

            </td>


            <td>
                ${cliente.telefone}
            </td>


            <td>
                ${cliente.email || "-"}
            </td>


            <td>
                ${cliente.endereco || "-"}
            </td>


            <td>

                <div class="client-actions">

                    <button
                        class="action-button edit"
                        data-id="${cliente.id}"
                    >
                        ✎
                    </button>

                    <button
                        class="action-button delete"
                        data-id="${cliente.id}"
                    >
                        ×
                    </button>

                </div>

            </td>

        `;


        tabela.appendChild(linha);

    });


    const total = document.querySelector("#total-clientes");

    if (total) {

        total.textContent =
            `${clientes.length} clientes cadastrados`;

    }


    // EDITAR

    document
        .querySelectorAll(".action-button.edit")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id = Number(button.dataset.id);

                editarCliente(id);

            });

        });


    // EXCLUIR

    document
        .querySelectorAll(".action-button.delete")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id = Number(button.dataset.id);

                excluirCliente(id);

            });

        });

}


// =====================================================
// NOVO / EDITAR CLIENTE
// =====================================================

function abrirFormularioCliente(id = null) {

    const clientes = pegarClientes();

    const cliente = id
        ? clientes.find(cliente => cliente.id === id)
        : null;


    const modal = document.createElement("div");

    modal.className = "modal-overlay";


    modal.innerHTML = `

        <div class="modal">

            <div class="modal-header">

                <div>

                    <h2>
                        ${cliente ? "Editar cliente" : "Novo cliente"}
                    </h2>

                    <p>
                        ${cliente
                            ? "Atualize os dados do cliente."
                            : "Cadastre um novo cliente."
                        }
                    </p>

                </div>


                <button
                    class="modal-close"
                    type="button"
                >
                    ×
                </button>

            </div>


            <form id="cliente-form">

                <div class="form-group">

                    <label>
                        Nome completo
                    </label>

                    <input
                        type="text"
                        id="cliente-nome"
                        placeholder="Digite o nome completo"
                        value="${cliente ? cliente.nome : ""}"
                        required
                    >

                </div>


                <div class="form-row">

                    <div class="form-group">

                        <label>
                            Telefone
                        </label>

                        <input
                            type="text"
                            id="cliente-telefone"
                            placeholder="(43) 99999-9999"
                            value="${cliente ? cliente.telefone : ""}"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            E-mail
                        </label>

                        <input
                            type="email"
                            id="cliente-email"
                            placeholder="cliente@email.com"
                            value="${cliente ? cliente.email : ""}"
                        >

                    </div>

                </div>


                <div class="form-group">

                    <label>
                        Endereço
                    </label>

                    <input
                        type="text"
                        id="cliente-endereco"
                        placeholder="Rua, número, bairro..."
                        value="${cliente ? cliente.endereco : ""}"
                    >

                </div>


                <div class="modal-actions">

                    <button
                        type="button"
                        class="secondary-button"
                        id="cancelar-cliente"
                    >
                        Cancelar
                    </button>


                    <button
                        type="submit"
                        class="primary-button"
                    >
                        ${cliente
                            ? "Salvar alterações"
                            : "Cadastrar cliente"
                        }
                    </button>

                </div>

            </form>

        </div>

    `;


    document.body.appendChild(modal);


    modal
        .querySelector(".modal-close")
        .addEventListener("click", () => {

            modal.remove();

        });


    modal
        .querySelector("#cancelar-cliente")
        .addEventListener("click", () => {

            modal.remove();

        });


    // =================================================
    // SALVAR FORMULÁRIO
    // =================================================

    modal
        .querySelector("#cliente-form")
        .addEventListener("submit", (event) => {

            event.preventDefault();


            const nome =
                modal.querySelector("#cliente-nome").value.trim();


            const telefone =
                modal.querySelector("#cliente-telefone").value.trim();


            const email =
                modal.querySelector("#cliente-email").value.trim();


            const endereco =
                modal.querySelector("#cliente-endereco").value.trim();


            if (!nome || !telefone) {

                alert("Nome e telefone são obrigatórios.");

                return;

            }


            const clientesAtuais = pegarClientes();


            if (cliente) {

                // EDITAR
                // Localiza o cliente pelo ID e substitui os dados

                const indice = clientesAtuais.findIndex(
                    clienteAtual => clienteAtual.id === cliente.id
                );


                if (indice !== -1) {

                    clientesAtuais[indice] = {

                        ...clientesAtuais[indice],

                        nome: nome,

                        telefone: telefone,

                        email: email,

                        endereco: endereco

                    };


                    salvarClientes(clientesAtuais);

                }

            } else {

                // NOVO CLIENTE

                clientesAtuais.push({

                    id: Date.now(),

                    nome: nome,

                    telefone: telefone,

                    email: email,

                    endereco: endereco

                });


                salvarClientes(clientesAtuais);

            }


            modal.remove();


            renderClientes();

        });

}


// =====================================================
// EDITAR
// =====================================================

function editarCliente(id) {

    abrirFormularioCliente(id);

}


// =====================================================
// EXCLUIR
// =====================================================

function excluirCliente(id) {

    const clientes = pegarClientes();

    const cliente = clientes.find(
        cliente => Number(cliente.id) === Number(id)
    );

    if (!cliente) {
        return;
    }

    abrirConfirmacaoExclusao(
        id,
        cliente.nome,
        "clientes"
    );

}


// =====================================================
// NAVEGAÇÃO
// =====================================================

navItems.forEach(button => {

    button.addEventListener("click", function () {

        const page = this.getAttribute("data-page");

        if (!pages[page]) {
            return;
        }

        // Remove active de todos
        navItems.forEach(item => {
            item.classList.remove("active");
        });

        // Ativa o botão clicado
        this.classList.add("active");

        // Atualiza o cabeçalho
        pageTitle.textContent = pages[page].title;
        pageBreadcrumb.textContent = pages[page].breadcrumb;
        pageDescription.textContent = pages[page].description;

        // Limpa completamente a tela atual
        pageContent.innerHTML = "";

        // Renderiza a página escolhida
        if (page === "dashboard") {

            renderDashboard();

        } else if (page === "clientes") {

            renderClientes();

        } else if (page === "servicos") {

            renderServicos();

        } else if (page === "agenda") {

            renderAgenda();

        } else if (page === "funcionarios") {

            pageContent.innerHTML = `
                <div class="empty-page">

                    <div class="empty-icon">
                        ${getPageIcon(page)}
                    </div>

                    <h2>Funcionários</h2>

                    <p>
                        Essa área será desenvolvida na próxima etapa.
                    </p>

                </div>
            `;

        } else if (page === "financeiro") {

            pageContent.innerHTML = `
                <div class="empty-page">

                    <div class="empty-icon">
                        ${getPageIcon(page)}
                    </div>

                    <h2>Financeiro</h2>

                    <p>
                        Essa área será desenvolvida na próxima etapa.
                    </p>

                </div>
            `;

        } else if (page === "relatorios") {

            pageContent.innerHTML = `
                <div class="empty-page">

                    <div class="empty-icon">
                        ${getPageIcon(page)}
                    </div>

                    <h2>Relatórios</h2>

                    <p>
                        Essa área será desenvolvida na próxima etapa.
                    </p>

                </div>
            `;

        }

    });

});

// =====================================================
// ÍCONES
// =====================================================

function getPageIcon(page) {

    const icons = {

        servicos: "✓",
        agenda: "□",
        funcionarios: "♙",
        financeiro: "R$",
        relatorios: "▤"

    };


    return icons[page] || "•";

}

// =====================================================
// DASHBOARD
// =====================================================

function renderDashboard() {

    const clientes = pegarClientes();
    const servicos = pegarServicos();

    const hoje = new Date();

    const diaHoje =
        String(hoje.getDate()).padStart(2, "0");

    const mesHoje =
        String(hoje.getMonth() + 1).padStart(2, "0");

    const anoHoje =
        hoje.getFullYear();

    const dataHoje =
        `${diaHoje}/${mesHoje}/${anoHoje}`;


    // =================================================
    // SERVIÇOS DO DIA
    // =================================================

    const servicosHoje = servicos
        .filter(servico => servico.data === dataHoje)
        .sort((a, b) =>
            a.horario.localeCompare(b.horario)
        );


    // =================================================
    // SERVIÇOS PENDENTES
    // =================================================

    const servicosPendentes = servicos.filter(
        servico =>
            servico.status === "Pendente"
    );


    // =================================================
    // SERVIÇOS CONCLUÍDOS
    // =================================================

    const servicosConcluidos = servicos.filter(
        servico =>
            servico.status === "Concluído"
    );


    // =================================================
    // SERVIÇOS AGENDADOS
    // =================================================

    const servicosAgendados = servicos.filter(
        servico =>
            servico.status === "Agendado"
    );


    // =================================================
    // FATURAMENTO
    // =================================================

    const faturamento =
        servicosConcluidos.reduce(
            (total, servico) =>
                total + Number(servico.valor || 0),
            0
        );


    // =================================================
    // FORMATAR DINHEIRO
    // =================================================

    function formatarMoeda(valor) {

        return valor
            .toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

    }


    // =================================================
    // PRÓXIMOS SERVIÇOS
    // =================================================

    const proximosServicos = servicos
        .filter(servico => {

            const partes = servico.data.split("/");

            if (partes.length !== 3) {
                return false;
            }

            const dataServico = new Date(
                Number(partes[2]),
                Number(partes[1]) - 1,
                Number(partes[0])
            );

            const dataAtual = new Date(
                anoHoje,
                Number(mesHoje) - 1,
                Number(diaHoje)
            );

            return dataServico >= dataAtual;

        })
        .sort((a, b) => {

            const [diaA, mesA, anoA] =
                a.data.split("/").map(Number);

            const [diaB, mesB, anoB] =
                b.data.split("/").map(Number);

            const dataA = new Date(
                anoA,
                mesA - 1,
                diaA
            );

            const dataB = new Date(
                anoB,
                mesB - 1,
                diaB
            );

            if (dataA - dataB !== 0) {
                return dataA - dataB;
            }

            return a.horario.localeCompare(
                b.horario
            );

        })
        .slice(0, 5);


    // =================================================
    // CONTEÚDO
    // =================================================

    pageContent.innerHTML = `

        <div class="dashboard-page">


            <!-- =========================================
                 CARDS
            ========================================== -->

            <div class="dashboard-stats">


                <div class="dashboard-stat-card">

                    <div class="dashboard-stat-icon blue">
                        👥
                    </div>

                    <div class="dashboard-stat-content">

                        <span>
                            Clientes cadastrados
                        </span>

                        <strong>
                            ${clientes.length}
                        </strong>

                        <small>
                            Clientes registrados
                        </small>

                    </div>

                </div>


                <div class="dashboard-stat-card">

                    <div class="dashboard-stat-icon purple">
                        ✓
                    </div>

                    <div class="dashboard-stat-content">

                        <span>
                            Total de serviços
                        </span>

                        <strong>
                            ${servicos.length}
                        </strong>

                        <small>
                            Serviços cadastrados
                        </small>

                    </div>

                </div>


                <div class="dashboard-stat-card">

                    <div class="dashboard-stat-icon orange">
                        ◷
                    </div>

                    <div class="dashboard-stat-content">

                        <span>
                            Serviços pendentes
                        </span>

                        <strong>
                            ${servicosPendentes.length}
                        </strong>

                        <small>
                            Aguardando atendimento
                        </small>

                    </div>

                </div>


                <div class="dashboard-stat-card">

                    <div class="dashboard-stat-icon green">
                        R$
                    </div>

                    <div class="dashboard-stat-content">

                        <span>
                            Faturamento
                        </span>

                        <strong>
                            ${formatarMoeda(faturamento)}
                        </strong>

                        <small>
                            Serviços concluídos
                        </small>

                    </div>

                </div>


            </div>


            <!-- =========================================
                 PARTE PRINCIPAL
            ========================================== -->

            <div class="dashboard-main-grid">


                <!-- SERVIÇOS DE HOJE -->

                <div class="panel dashboard-panel">

                    <div class="panel-header">

                        <div>

                            <h2>
                                Serviços de hoje
                            </h2>

                            <p>
                                ${dataHoje}
                            </p>

                        </div>

                        <span class="dashboard-count">
                            ${servicosHoje.length}
                            ${
                                servicosHoje.length === 1
                                    ? " serviço"
                                    : " serviços"
                            }
                        </span>

                    </div>


                    <div class="dashboard-service-list">

                        ${
                            servicosHoje.length === 0

                                ? `

                                    <div class="dashboard-empty">

                                        <div>
                                            📅
                                        </div>

                                        <strong>
                                            Nenhum serviço hoje
                                        </strong>

                                        <span>
                                            Não existem serviços agendados para hoje.
                                        </span>

                                    </div>

                                `

                                : servicosHoje.map(servico => {

                                    const cliente =
                                        clientes.find(
                                            cliente =>
                                                Number(cliente.id) ===
                                                Number(servico.clienteId)
                                        );


                                    const nomeCliente =
                                        cliente
                                            ? cliente.nome
                                            : "Cliente não encontrado";


                                    let classeStatus =
                                        "scheduled";


                                    if (
                                        servico.status ===
                                        "Concluído"
                                    ) {
                                        classeStatus =
                                            "completed";
                                    }


                                    if (
                                        servico.status ===
                                        "Pendente"
                                    ) {
                                        classeStatus =
                                            "pending";
                                    }


                                    if (
                                        servico.status ===
                                        "Cancelado"
                                    ) {
                                        classeStatus =
                                            "cancelled";
                                    }


                                    return `

                                        <div
                                            class="dashboard-service"
                                        >

                                            <div
                                                class="dashboard-service-time"
                                            >

                                                <strong>
                                                    ${servico.horario}
                                                </strong>

                                            </div>


                                            <div
                                                class="dashboard-service-info"
                                            >

                                                <strong>
                                                    ${nomeCliente}
                                                </strong>

                                                <span>
                                                    ${servico.tipo}
                                                </span>

                                            </div>


                                            <span
                                                class="status ${classeStatus}"
                                            >
                                                ${servico.status}
                                            </span>

                                        </div>

                                    `;

                                }).join("")

                        }

                    </div>

                </div>


                <!-- STATUS -->

                <div class="panel dashboard-panel">

                    <div class="panel-header">

                        <div>

                            <h2>
                                Resumo dos serviços
                            </h2>

                            <p>
                                Situação atual
                            </p>

                        </div>

                    </div>


                    <div class="dashboard-status-list">


                        <div class="dashboard-status-item">

                            <div class="dashboard-status-left">

                                <span
                                    class="dashboard-status-dot scheduled"
                                ></span>

                                <span>
                                    Agendados
                                </span>

                            </div>

                            <strong>
                                ${servicosAgendados.length}
                            </strong>

                        </div>


                        <div class="dashboard-status-item">

                            <div class="dashboard-status-left">

                                <span
                                    class="dashboard-status-dot pending"
                                ></span>

                                <span>
                                    Pendentes
                                </span>

                            </div>

                            <strong>
                                ${servicosPendentes.length}
                            </strong>

                        </div>


                        <div class="dashboard-status-item">

                            <div class="dashboard-status-left">

                                <span
                                    class="dashboard-status-dot completed"
                                ></span>

                                <span>
                                    Concluídos
                                </span>

                            </div>

                            <strong>
                                ${servicosConcluidos.length}
                            </strong>

                        </div>


                        <div class="dashboard-status-item">

                            <div class="dashboard-status-left">

                                <span
                                    class="dashboard-status-dot cancelled"
                                ></span>

                                <span>
                                    Cancelados
                                </span>

                            </div>

                            <strong>
                                ${
                                    servicos.filter(
                                        servico =>
                                            servico.status ===
                                            "Cancelado"
                                    ).length
                                }
                            </strong>

                        </div>


                    </div>

                </div>

            </div>


            <!-- =========================================
                 PRÓXIMOS SERVIÇOS
            ========================================== -->

            <div class="panel dashboard-panel">

                <div class="panel-header">

                    <div>

                        <h2>
                            Próximos serviços
                        </h2>

                        <p>
                            Próximos atendimentos agendados
                        </p>

                    </div>


                    <button
                        class="dashboard-link"
                        id="dashboard-ir-agenda"
                    >
                        Ver agenda →
                    </button>

                </div>


                <div class="dashboard-service-list">

                    ${
                        proximosServicos.length === 0

                            ? `

                                <div class="dashboard-empty">

                                    <div>
                                        📅
                                    </div>

                                    <strong>
                                        Nenhum próximo serviço
                                    </strong>

                                    <span>
                                        Cadastre um serviço para vê-lo aqui.
                                    </span>

                                </div>

                            `

                            : proximosServicos.map(servico => {

                                const cliente =
                                    clientes.find(
                                        cliente =>
                                            Number(cliente.id) ===
                                            Number(servico.clienteId)
                                    );


                                const nomeCliente =
                                    cliente
                                        ? cliente.nome
                                        : "Cliente não encontrado";


                                let classeStatus =
                                    "scheduled";


                                if (
                                    servico.status ===
                                    "Concluído"
                                ) {
                                    classeStatus =
                                        "completed";
                                }


                                if (
                                    servico.status ===
                                    "Pendente"
                                ) {
                                    classeStatus =
                                        "pending";
                                }


                                if (
                                    servico.status ===
                                    "Cancelado"
                                ) {
                                    classeStatus =
                                        "cancelled";
                                }


                                return `

                                    <div
                                        class="dashboard-service"
                                    >

                                        <div
                                            class="dashboard-service-time"
                                        >

                                            <strong>
                                                ${servico.horario}
                                            </strong>

                                            <span>
                                                ${servico.data}
                                            </span>

                                        </div>


                                        <div
                                            class="dashboard-service-info"
                                        >

                                            <strong>
                                                ${nomeCliente}
                                            </strong>

                                            <span>
                                                ${servico.tipo}
                                            </span>

                                        </div>


                                        <span
                                            class="status ${classeStatus}"
                                        >
                                            ${servico.status}
                                        </span>

                                    </div>

                                `;

                            }).join("")

                    }

                </div>

            </div>


        </div>

    `;


    // =================================================
    // BOTÃO → AGENDA
    // =================================================

    const botaoAgenda =
        document.querySelector(
            "#dashboard-ir-agenda"
        );


    if (botaoAgenda) {

        botaoAgenda.addEventListener(
            "click",
            () => {

                const botao =
                    document.querySelector(
                        '.nav-item[data-page="agenda"]'
                    );


                if (botao) {
                    botao.click();
                }

            }
        );

    }

}

// =====================================================
// SERVIÇOS
// =====================================================

function pegarServicos() {

    const dados = localStorage.getItem("servicosReiDaLimpeza");

    if (!dados) {
        return [];
    }

    try {
        return JSON.parse(dados);
    } catch (erro) {
        console.error("Erro ao carregar serviços:", erro);
        return [];
    }
}


function salvarServicos(servicos) {

    localStorage.setItem(
        "servicosReiDaLimpeza",
        JSON.stringify(servicos)
    );

}


// =====================================================
// TELA DE SERVIÇOS
// =====================================================

function renderServicos() {

    pageContent.innerHTML = `

        <div class="clientes-page">

            <div class="clientes-toolbar">

                <div class="clientes-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        id="buscar-servico"
                        placeholder="Buscar serviço..."
                    >

                </div>


                <button
                    class="primary-button"
                    id="novo-servico"
                >
                    + Novo serviço
                </button>

            </div>


            <div class="panel">

                <div class="panel-header">

                    <div>

                        <h2>
                            Serviços cadastrados
                        </h2>

                        <p id="total-servicos">
                            0 serviços cadastrados
                        </p>

                    </div>

                </div>


                <div class="table-container">

                    <table>

                        <thead>

                            <tr>
                                <th>Cliente</th>
                                <th>Serviço</th>
                                <th>Data</th>
                                <th>Horário</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>

                        </thead>


                        <tbody id="servicos-tabela">

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    `;


    atualizarTabelaServicos();


    document
        .querySelector("#novo-servico")
        .addEventListener("click", () => {

            abrirFormularioServico();

        });


    document
        .querySelector("#buscar-servico")
        .addEventListener("input", (event) => {

            atualizarTabelaServicos(event.target.value);

        });

}


// =====================================================
// TABELA DE SERVIÇOS
// =====================================================

function atualizarTabelaServicos(busca = "") {

    const tabela = document.querySelector("#servicos-tabela");

    if (!tabela) {
        return;
    }


    const servicos = pegarServicos();
    const clientes = pegarClientes();

    const termo = busca.toLowerCase().trim();


    const filtrados = servicos.filter(servico => {

        const cliente = clientes.find(
            cliente => cliente.id === servico.clienteId
        );


        const nomeCliente = cliente
            ? cliente.nome
            : "Cliente não encontrado";


        return (
            nomeCliente.toLowerCase().includes(termo) ||
            servico.tipo.toLowerCase().includes(termo) ||
            servico.status.toLowerCase().includes(termo)
        );

    });


    tabela.innerHTML = "";


    filtrados.forEach(servico => {

        const cliente = clientes.find(
            cliente => cliente.id === servico.clienteId
        );


        const nomeCliente = cliente
            ? cliente.nome
            : "Cliente não encontrado";


        const iniciais = nomeCliente
            .split(" ")
            .map(nome => nome.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();


        const linha = document.createElement("tr");


        let classeStatus = "scheduled";


        if (servico.status === "Concluído") {
            classeStatus = "completed";
        }

        if (servico.status === "Pendente") {
            classeStatus = "pending";
        }

        if (servico.status === "Cancelado") {
            classeStatus = "cancelled";
        }


        linha.innerHTML = `

            <td>

                <div class="client-cell">

                    <div class="client-avatar">
                        ${iniciais}
                    </div>

                    <strong>
                        ${nomeCliente}
                    </strong>

                </div>

            </td>


            <td>
                ${servico.tipo}
            </td>


            <td>
                ${servico.data}
            </td>


            <td>
                ${servico.horario}
            </td>


            <td>
                R$ ${Number(servico.valor)
                    .toFixed(2)
                    .replace(".", ",")}
            </td>


            <td>

                <span class="status ${classeStatus}">
                    ${servico.status}
                </span>

            </td>


            <td>

                <div class="client-actions">

                    <button
                        class="action-button edit"
                        data-id="${servico.id}"
                    >
                        ✎
                    </button>


                    <button
                        class="action-button delete"
                        data-id="${servico.id}"
                    >
                        ×
                    </button>

                </div>

            </td>

        `;


        tabela.appendChild(linha);

    });


    const total = document.querySelector("#total-servicos");

    if (total) {

        total.textContent =
            `${servicos.length} serviços cadastrados`;

    }


    // EDITAR

    document
        .querySelectorAll(".action-button.edit")
        .forEach(button => {

            button.addEventListener("click", () => {

                editarServico(
                    Number(button.dataset.id)
                );

            });

        });


    // EXCLUIR

    document
        .querySelectorAll(".action-button.delete")
        .forEach(button => {

            button.addEventListener("click", () => {

                excluirServico(
                    Number(button.dataset.id)
                );

            });

        });

}


// =====================================================
// NOVO / EDITAR SERVIÇO
// =====================================================

function abrirFormularioServico(id = null, origem = "servicos") {

    const servicos = pegarServicos();
    const clientes = pegarClientes();


   const servico = id !== null
    ? servicos.find(servico => Number(servico.id) === Number(id))
    : null;


    const modal = document.createElement("div");

    modal.className = "modal-overlay";


    modal.innerHTML = `

        <div class="modal">

            <div class="modal-header">

                <div>

                    <h2>
                        ${servico
                            ? "Editar serviço"
                            : "Novo serviço"
                        }
                    </h2>

                    <p>
                        ${servico
                            ? "Atualize os dados do serviço."
                            : "Cadastre um novo serviço."
                        }
                    </p>

                </div>


                <button
                    class="modal-close"
                    type="button"
                >
                    ×
                </button>

            </div>


            <form id="servico-form">


                <div class="form-group">

                    <label>
                        Cliente
                    </label>

                    <select
                        id="servico-cliente"
                        required
                    >

                        <option value="">
                            Selecione um cliente
                        </option>

                        ${clientes.map(cliente => `

                            <option
                                value="${cliente.id}"
                                ${servico &&
                                servico.clienteId === cliente.id
                                    ? "selected"
                                    : ""
                                }
                            >
                                ${cliente.nome}
                            </option>

                        `).join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Tipo de serviço
                    </label>

                    <input
                        type="text"
                        id="servico-tipo"
                        placeholder="Ex.: Limpeza residencial"
                        value="${servico ? servico.tipo : ""}"
                        required
                    >

                </div>


                <div class="form-row">

                    <div class="form-group">

                        <label>
                            Data
                        </label>

                        <input
                            type="date"
                            id="servico-data"
                            value="${servico
                                ? converterDataParaInput(servico.data)
                                : ""
                            }"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Horário
                        </label>

                        <input
                            type="time"
                            id="servico-horario"
                            value="${servico ? servico.horario : ""}"
                            required
                        >

                    </div>

                </div>


                <div class="form-row">

                    <div class="form-group">

                        <label>
                            Valor
                        </label>

                        <input
                            type="number"
                            id="servico-valor"
                            placeholder="0,00"
                            min="0"
                            step="0.01"
                            value="${servico ? servico.valor : ""}"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Status
                        </label>

                        <select id="servico-status">

                            <option
                                value="Agendado"
                                ${!servico ||
                                servico.status === "Agendado"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Agendado
                            </option>

                            <option
                                value="Pendente"
                                ${servico &&
                                servico.status === "Pendente"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Pendente
                            </option>

                            <option
                                value="Em andamento"
                                ${servico &&
                                servico.status === "Em andamento"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Em andamento
                            </option>

                            <option
                                value="Concluído"
                                ${servico &&
                                servico.status === "Concluído"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Concluído
                            </option>

                            <option
                                value="Cancelado"
                                ${servico &&
                                servico.status === "Cancelado"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Cancelado
                            </option>

                        </select>

                    </div>

                </div>


                <div class="modal-actions">

                    <button
                        type="button"
                        class="secondary-button"
                        id="cancelar-servico"
                    >
                        Cancelar
                    </button>


                    <button
                        type="submit"
                        class="primary-button"
                    >
                        ${servico
                            ? "Salvar alterações"
                            : "Cadastrar serviço"
                        }
                    </button>

                </div>


            </form>

        </div>

    `;


    document.body.appendChild(modal);


    modal
        .querySelector(".modal-close")
        .addEventListener("click", () => {

            modal.remove();

        });


    modal
        .querySelector("#cancelar-servico")
        .addEventListener("click", () => {

            modal.remove();

        });


    // =================================================
    // SALVAR
    // =================================================

    modal
        .querySelector("#servico-form")
        .addEventListener("submit", event => {

            event.preventDefault();


            const clienteId = Number(
                modal.querySelector("#servico-cliente").value
            );


            const tipo =
                modal.querySelector("#servico-tipo").value.trim();


            const dataInput =
                modal.querySelector("#servico-data").value;


            const horario =
                modal.querySelector("#servico-horario").value;


            const valor =
                Number(
                    modal.querySelector("#servico-valor").value
                );


            const status =
                modal.querySelector("#servico-status").value;


            if (
                !clienteId ||
                !tipo ||
                !dataInput ||
                !horario ||
                valor < 0
            ) {

                alert("Preencha todos os campos obrigatórios.");

                return;

            }


            const data = formatarData(dataInput);


            const servicosAtuais = pegarServicos();


        if (servico) {

    const indice = servicosAtuais.findIndex(
        item => Number(item.id) === Number(servico.id)
    );

    if (indice === -1) {
        alert("Não foi possível encontrar o serviço para editar.");
        return;
    }

    servicosAtuais[indice] = {

        ...servicosAtuais[indice],

        clienteId: clienteId,
        tipo: tipo,
        data: data,
        horario: horario,
        valor: valor,
        status: status

    };

    salvarServicos(servicosAtuais);

} else {

                servicosAtuais.push({

                    id: Date.now(),

                    clienteId: clienteId,

                    tipo: tipo,

                    data: data,

                    horario: horario,

                    valor: valor,

                    status: status

                });


                salvarServicos(servicosAtuais);

            }


modal.remove();

if (origem === "agenda") {
    atualizarAgenda();
} else {
    renderServicos();
}

        });

}


// =====================================================
// EDITAR SERVIÇO
// =====================================================

function editarServico(id) {

    abrirFormularioServico(id);

}


// =====================================================
// EXCLUIR SERVIÇO
// =====================================================

function excluirServico(id) {

    const servicos = pegarServicos();

    const servico = servicos.find(
        servico => Number(servico.id) === Number(id)
    );

    if (!servico) {
        return;
    }

    const clientes = pegarClientes();

    const cliente = clientes.find(
        cliente => Number(cliente.id) === Number(servico.clienteId)
    );

    const nomeCliente = cliente
        ? cliente.nome
        : "este cliente";


    abrirConfirmacaoExclusao(
        id,
        nomeCliente,
        "servicos"
    );

}


// =====================================================
// DATAS
// =====================================================

function formatarData(data) {

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


function converterDataParaInput(data) {

    const partes = data.split("/");

    if (partes.length !== 3) {
        return "";
    }

    return `${partes[2]}-${partes[1]}-${partes[0]}`;

}
// =====================================================
// AGENDA
// =====================================================

let dataAgendaAtual = new Date();


// =====================================================
// TELA DA AGENDA
// =====================================================

function renderAgenda() {

    pageContent.innerHTML = `

        <div class="agenda-page">

            <div class="agenda-toolbar">

                <div class="agenda-date-navigation">

                    <button
                        class="agenda-nav-button"
                        id="agenda-anterior"
                    >
                        ‹
                    </button>

                    <button
                        class="agenda-hoje"
                        id="agenda-hoje"
                    >
                        Hoje
                    </button>

                    <button
                        class="agenda-nav-button"
                        id="agenda-proximo"
                    >
                        ›
                    </button>

                </div>


                <div class="agenda-date-title">

                    <h2 id="agenda-data-titulo"></h2>

                    <span id="agenda-data-subtitulo"></span>

                </div>


                <button
                    class="primary-button"
                    id="agenda-novo-servico"
                >
                    + Novo serviço
                </button>

            </div>


            <div class="panel">

                <div class="panel-header">

                    <div>

                        <h2>
                            Serviços do dia
                        </h2>

                        <p id="agenda-total">
                            0 serviços
                        </p>

                    </div>

                </div>


                <div
                    class="agenda-servicos"
                    id="agenda-servicos"
                ></div>

            </div>

        </div>

    `;


    atualizarAgenda();


    document
        .querySelector("#agenda-anterior")
        .addEventListener("click", () => {

            dataAgendaAtual.setDate(
                dataAgendaAtual.getDate() - 1
            );

            atualizarAgenda();

        });


    document
        .querySelector("#agenda-proximo")
        .addEventListener("click", () => {

            dataAgendaAtual.setDate(
                dataAgendaAtual.getDate() + 1
            );

            atualizarAgenda();

        });


    document
        .querySelector("#agenda-hoje")
        .addEventListener("click", () => {

            dataAgendaAtual = new Date();

            atualizarAgenda();

        });


  document
    .querySelector("#agenda-novo-servico")
    .addEventListener("click", () => {

        abrirFormularioServico(null, "agenda");

    });
}


// =====================================================
// ATUALIZAR AGENDA
// =====================================================

function atualizarAgenda() {

    const container =
        document.querySelector("#agenda-servicos");

    if (!container) {
        return;
    }


    const servicos = pegarServicos();
    const clientes = pegarClientes();


    const dataSelecionada =
        formatarDataAgenda(dataAgendaAtual);


    const servicosDoDia = servicos
        .filter(servico => {

            return servico.data === dataSelecionada;

        })
        .sort((a, b) => {

            return a.horario.localeCompare(
                b.horario
            );

        });


    const titulo =
        document.querySelector("#agenda-data-titulo");

    const subtitulo =
        document.querySelector("#agenda-data-subtitulo");


    if (titulo) {

        titulo.textContent =
            formatarTituloAgenda(dataAgendaAtual);

    }


    if (subtitulo) {

        subtitulo.textContent =
            dataSelecionada;

    }


    const total =
        document.querySelector("#agenda-total");


    if (total) {

        total.textContent =
            `${servicosDoDia.length} ${
                servicosDoDia.length === 1
                    ? "serviço"
                    : "serviços"
            }`;

    }


    container.innerHTML = "";


    if (servicosDoDia.length === 0) {

        container.innerHTML = `

            <div class="agenda-vazia">

                <div class="agenda-vazia-icon">
                    📅
                </div>

                <h3>
                    Nenhum serviço agendado
                </h3>

                <p>
                    Não existem serviços para esta data.
                </p>

                <button
                    class="primary-button"
                    id="agenda-vazia-novo"
                >
                    + Novo serviço
                </button>

            </div>

        `;


        document
    .querySelector("#agenda-vazia-novo")
    .addEventListener("click", () => {

        abrirFormularioServico(null, "agenda");

    });


        return;

    }


    servicosDoDia.forEach(servico => {

        const cliente = clientes.find(
            cliente =>
                Number(cliente.id) ===
                Number(servico.clienteId)
        );


        const nomeCliente = cliente
            ? cliente.nome
            : "Cliente não encontrado";


        const iniciais = nomeCliente
            .split(" ")
            .map(nome => nome.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();


        let classeStatus = "scheduled";


        if (servico.status === "Concluído") {
            classeStatus = "completed";
        }

        if (servico.status === "Pendente") {
            classeStatus = "pending";
        }

        if (servico.status === "Cancelado") {
            classeStatus = "cancelled";
        }


        const item =
            document.createElement("div");


        item.className = "agenda-servico-item";


        item.innerHTML = `

            <div class="agenda-servico-hora">

                <strong>
                    ${servico.horario}
                </strong>

            </div>


            <div class="agenda-servico-info">

                <div class="agenda-servico-cliente">

                    <div class="client-avatar">
                        ${iniciais}
                    </div>

                    <div>

                        <strong>
                            ${nomeCliente}
                        </strong>

                        <span>
                            ${servico.tipo}
                        </span>

                    </div>

                </div>


                <div class="agenda-servico-detalhes">

                    <span>
                        R$ ${Number(servico.valor)
                            .toFixed(2)
                            .replace(".", ",")}
                    </span>

                    <span class="status ${classeStatus}">
                        ${servico.status}
                    </span>

                </div>

            </div>


            <div class="agenda-servico-acoes">

                <button
                    class="action-button edit"
                    title="Editar"
                >
                    ✎
                </button>

                <button
                    class="action-button delete"
                    title="Excluir"
                >
                    ×
                </button>

            </div>

        `;


      item
    .querySelector(".edit")
    .addEventListener("click", () => {

        abrirFormularioServico(
            servico.id,
            "agenda"
        );

    });


        item
            .querySelector(".delete")
            .addEventListener("click", () => {

                excluirServicoAgenda(
                    servico.id
                );

            });


        container.appendChild(item);

    });

}


// =====================================================
// EXCLUIR SERVIÇO PELA AGENDA
// =====================================================

function excluirServicoAgenda(id) {

    const servicos = pegarServicos();

    const servico = servicos.find(
        servico =>
            Number(servico.id) === Number(id)
    );

    if (!servico) {
        return;
    }

    const clientes = pegarClientes();

    const cliente = clientes.find(
        cliente =>
            Number(cliente.id) === Number(servico.clienteId)
    );

    const nomeCliente = cliente
        ? cliente.nome
        : "este cliente";


    abrirConfirmacaoExclusao(
        id,
        nomeCliente,
        "agenda"
    );

}

// =====================================================
// FORMATAÇÃO DAS DATAS
// =====================================================

function formatarDataAgenda(data) {

    const dia =
        String(data.getDate()).padStart(2, "0");

    const mes =
        String(data.getMonth() + 1).padStart(2, "0");

    const ano =
        data.getFullYear();


    return `${dia}/${mes}/${ano}`;

}


function formatarTituloAgenda(data) {

    const hoje = new Date();

    const dataComparacao =
        new Date(
            data.getFullYear(),
            data.getMonth(),
            data.getDate()
        );


    const hojeComparacao =
        new Date(
            hoje.getFullYear(),
            hoje.getMonth(),
            hoje.getDate()
        );


    const diferenca =
        Math.round(
            (dataComparacao - hojeComparacao)
            / (1000 * 60 * 60 * 24)
        );


    if (diferenca === 0) {
        return "Hoje";
    }


    if (diferenca === 1) {
        return "Amanhã";
    }


    if (diferenca === -1) {
        return "Ontem";
    }


    return data.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "2-digit",
            month: "long"
        }
    );

}


// =====================================================
// MODAL DE CONFIRMAÇÃO DE EXCLUSÃO
// =====================================================

function abrirConfirmacaoExclusao(id, nomeCliente, origem) {

    const modal = document.createElement("div");

    modal.className = "modal-overlay";


    modal.innerHTML = `

        <div class="modal confirm-modal">

            <div class="confirm-icon">
                !
            </div>


            <div class="confirm-content">

                <h2>
                    Excluir serviço?
                </h2>

                <p>
                    Tem certeza que deseja excluir o serviço de
                    <strong>${nomeCliente}</strong>?
                </p>

                <span>
                    Essa ação não poderá ser desfeita.
                </span>

            </div>


            <div class="modal-actions">

                <button
                    type="button"
                    class="secondary-button"
                    id="cancelar-exclusao"
                >
                    Cancelar
                </button>


                <button
                    type="button"
                    class="delete-confirm-button"
                    id="confirmar-exclusao"
                >
                    Excluir serviço
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    // CANCELAR

    modal
        .querySelector("#cancelar-exclusao")
        .addEventListener("click", () => {

            modal.remove();

        });


    // CONFIRMAR

    modal
    .querySelector("#confirmar-exclusao")
    .addEventListener("click", () => {

        // =================================================
        // EXCLUIR CLIENTE
        // =================================================

        if (origem === "clientes") {

            const clientes = pegarClientes();

            const novosClientes = clientes.filter(
                cliente =>
                    Number(cliente.id) !== Number(id)
            );

            salvarClientes(novosClientes);

            modal.remove();

            atualizarTabelaClientes();

            return;
        }


        // =================================================
        // EXCLUIR SERVIÇO
        // =================================================

        const servicos = pegarServicos();

        const novosServicos = servicos.filter(
            servico =>
                Number(servico.id) !== Number(id)
        );

        salvarServicos(novosServicos);

        modal.remove();


        // =================================================
        // ATUALIZAR ORIGEM
        // =================================================

        if (origem === "agenda") {

            atualizarAgenda();

        } else {

            atualizarTabelaServicos();

        }

    });

}
// =====================================================
// INICIALIZAÇÃO DO SISTEMA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    renderDashboard();

});