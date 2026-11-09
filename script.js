
const telaInicial = document.getElementById("telaInicial");
const telaModo = document.getElementById("telaModo");
const telaEscolha = document.getElementById("telaEscolha");
const telaJogo = document.getElementById("telaJogo");

const btnIniciar = document.getElementById("btnIniciar");
const btnIA = document.getElementById("btnIA");
const btnDoisJogadores = document.getElementById("btnDoisJogadores");
const btnVoltar = document.getElementById("btnVoltar");
const btnNovamente = document.getElementById("btnNovamente");

const casas = document.querySelectorAll(".casa");
const turno = document.getElementById("turno");

const modal = document.getElementById("modal");
const modalConteudo = document.getElementById("modalConteudo");

const resultado = document.getElementById("resultado");
const mensagemResultado = document.getElementById("mensagemResultado");

const linhaVitoria = document.getElementById("linhaVitoria");

// Elementos do placar
const vitoriasElemento = document.getElementById("vitorias");
const empatesElemento = document.getElementById("empates");
const derrotasElemento = document.getElementById("derrotas");

const labelVitorias = document.getElementById("labelVitorias");
const labelDerrotas = document.getElementById("labelDerrotas");

// Variáveis do jogo
let tabuleiro = ["", "", "", "", "", "", "", "", ""];

let jogador;
let ia;
let jogadorAtual;

let modo = "";
let jogoAtivo = false;
let vezJogador = true;

// Placar salvo no navegador
let placar = JSON.parse(localStorage.getItem("placarJogo")) || {
    vitorias: 0,
    empates: 0,
    derrotas: 0
};

// Combinações vencedoras
const combinacoes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Atualizar placar na tela
function atualizarPlacar() {

    vitoriasElemento.textContent = placar.vitorias;
    empatesElemento.textContent = placar.empates;
    derrotasElemento.textContent = placar.derrotas;

    localStorage.setItem("placarJogo", JSON.stringify(placar));

}

// Carregar placar
atualizarPlacar();

// Iniciar
btnIniciar.addEventListener("click", () => {

    telaInicial.classList.add("escondido");
    telaModo.classList.remove("escondido");

});

// Escolher modo IA
btnIA.addEventListener("click", () => {

    modo = "ia";

    telaModo.classList.add("escondido");
    telaEscolha.classList.remove("escondido");

});

// Escolher modo 2 jogadores
btnDoisJogadores.addEventListener("click", () => {

    modo = "duplas";

    // No modo de dois jogadores:
    // Jogador 1 = X
    // Jogador 2 = O

    jogador = "X";

    iniciarJogo();

});

// Escolher símbolo contra IA
document.querySelectorAll(".escolher").forEach(botao => {

    botao.addEventListener("click", () => {

        jogador = botao.dataset.simbolo;
        ia = jogador === "X" ? "O" : "X";

        iniciarJogo();

    });

});

// Iniciar ou reiniciar jogo
function iniciarJogo() {

    tabuleiro = ["", "", "", "", "", "", "", "", ""];

    jogadorAtual = "X";
    vezJogador = true;
    jogoAtivo = true;

    casas.forEach(casa => {

        casa.textContent = "";
        casa.className = "casa";

    });

    linhaVitoria.style.width = "0";

    linhaVitoria.style.transform = "rotate(0deg)";

    modal.classList.add("escondido");

    telaInicial.classList.add("escondido");
    telaModo.classList.add("escondido");
    telaEscolha.classList.add("escondido");
    telaJogo.classList.remove("escondido");

    // Atualizar nomes do placar
    if (modo === "duplas") {

        labelVitorias.textContent = "Vitórias P1";
        labelDerrotas.textContent = "Derrotas P1";

    } else {

        labelVitorias.textContent = "Vitórias";
        labelDerrotas.textContent = "Derrotas";

    }

    atualizarTurno();

}

// Atualizar informação de turno
function atualizarTurno() {

    if (modo === "ia") {

        if (vezJogador) {
            turno.textContent = `Sua vez! (${jogador})`;
        } else {
            turno.textContent = `Vez da IA (${ia})...`;
        }

    } else {

        if (jogadorAtual === "X") {
            turno.textContent = "Vez do Jogador 1 (X)";
        } else {
            turno.textContent = "Vez do Jogador 2 (O)";
        }

    }

}

// Clique nas casas
casas.forEach(casa => {

    casa.addEventListener("click", () => {

        const indice = Number(casa.dataset.index);

        if (!jogoAtivo || tabuleiro[indice] !== "") {
            return;
        }

        // Modo contra IA
        if (modo === "ia") {

            if (!vezJogador) return;

            fazerJogada(indice, jogador);

            if (!jogoAtivo) return;

            vezJogador = false;
            atualizarTurno();

            setTimeout(jogadaIA, 500);

        }

        // Modo de dois jogadores
        else if (modo === "duplas") {

            fazerJogada(indice, jogadorAtual);

            if (!jogoAtivo) return;

            jogadorAtual = jogadorAtual === "X" ? "O" : "X";

            atualizarTurno();

        }

    });

});

// Registrar jogada
function fazerJogada(indice, simbolo) {

    tabuleiro[indice] = simbolo;

    casas[indice].textContent = simbolo;
    casas[indice].classList.add(simbolo.toLowerCase());

    verificarResultado();

}

// Verificar vitória ou empate
function verificarResultado() {

    for (let combinacao of combinacoes) {

        const [a, b, c] = combinacao;

        if (
            tabuleiro[a] !== "" &&
            tabuleiro[a] === tabuleiro[b] &&
            tabuleiro[b] === tabuleiro[c]
        ) {

            jogoAtivo = false;

            desenharLinha(combinacao);

            if (modo === "ia") {

                if (tabuleiro[a] === jogador) {
                    mostrarResultado("vitoria");
                } else {
                    mostrarResultado("derrota");
                }

            } else {

                if (tabuleiro[a] === "X") {
                    mostrarResultado("vitoria", "Jogador 1");
                } else {
                    mostrarResultado("derrota", "Jogador 2");
                }

            }

            return true;

        }

    }

    // Verificar empate
    if (!tabuleiro.includes("")) {

        jogoAtivo = false;
        mostrarResultado("empate");

        return true;

    }

    return false;

}

// Desenhar linha da vitória
function desenharLinha(combinacao) {

    const primeira = casas[combinacao[0]];
    const ultima = casas[combinacao[2]];

    const tabuleiroRect = document
        .getElementById("tabuleiro")
        .getBoundingClientRect();

    const primeiraRect = primeira.getBoundingClientRect();
    const ultimaRect = ultima.getBoundingClientRect();

    const x1 = primeiraRect.left + primeiraRect.width / 2 - tabuleiroRect.left;
    const y1 = primeiraRect.top + primeiraRect.height / 2 - tabuleiroRect.top;

    const x2 = ultimaRect.left + ultimaRect.width / 2 - tabuleiroRect.left;
    const y2 = ultimaRect.top + ultimaRect.height / 2 - tabuleiroRect.top;

    const distancia = Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
    );

    const angulo = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    linhaVitoria.style.left = `${x1}px`;
    linhaVitoria.style.top = `${y1}px`;
    linhaVitoria.style.transform = `rotate(${angulo}deg)`;

    setTimeout(() => {

        linhaVitoria.style.width = `${distancia}px`;

    }, 50);

}

// Inteligência artificial
function jogadaIA() {

    if (!jogoAtivo) return;

    let melhorJogada = encontrarMelhorJogada();

    fazerJogada(melhorJogada, ia);

    if (!jogoAtivo) return;

    vezJogador = true;

    atualizarTurno();

}

// Encontrar melhor jogada da IA
function encontrarMelhorJogada() {

    // Tentar vencer
    for (let i = 0; i < 9; i++) {

        if (tabuleiro[i] === "") {

            tabuleiro[i] = ia;

            if (verificarVencedor(ia)) {
                tabuleiro[i] = "";
                return i;
            }

            tabuleiro[i] = "";

        }

    }

    // Bloquear vitória do jogador
    for (let i = 0; i < 9; i++) {

        if (tabuleiro[i] === "") {

            tabuleiro[i] = jogador;

            if (verificarVencedor(jogador)) {
                tabuleiro[i] = "";
                return i;
            }

            tabuleiro[i] = "";

        }

    }

    // Preferir o centro
    if (tabuleiro[4] === "") {
        return 4;
    }

    // Preferir os cantos
    const cantos = [0, 2, 6, 8].filter(i => tabuleiro[i] === "");

    if (cantos.length > 0) {

        return cantos[Math.floor(Math.random() * cantos.length)];

    }

    // Qualquer casa disponível
    const disponiveis = tabuleiro
        .map((valor, indice) => valor === "" ? indice : null)
        .filter(valor => valor !== null);

    return disponiveis[Math.floor(Math.random() * disponiveis.length)];

}

// Verificar vitória de um símbolo
function verificarVencedor(simbolo) {

    return combinacoes.some(combinacao => {

        return combinacao.every(indice => {
            return tabuleiro[indice] === simbolo;
        });

    });

}

// Mostrar resultado
function mostrarResultado(tipo, nomeVencedor = "") {

    modal.classList.remove("escondido");

    modalConteudo.className = "modal-conteudo";

    // Registrar vitória
    if (tipo === "vitoria") {

        placar.vitorias++;

        modalConteudo.classList.add("vitoria");

        resultado.textContent = modo === "duplas"
            ? `${nomeVencedor} venceu!`
            : "Você venceu!";

        mensagemResultado.textContent = modo === "duplas"
            ? "Parabéns! O Jogador 1 ganhou a partida."
            : "Parabéns! Você ganhou da inteligência artificial.";

    }

    // Registrar derrota
    else if (tipo === "derrota") {

        placar.derrotas++;

        modalConteudo.classList.add("derrota");

        resultado.textContent = modo === "duplas"
            ? `${nomeVencedor} venceu!`
            : "Você perdeu!";

        mensagemResultado.textContent = modo === "duplas"
            ? "O Jogador 2 ganhou a partida."
            : "A inteligência artificial venceu desta vez.";

    }

    // Registrar empate
    else {

        placar.empates++;

        modalConteudo.classList.add("empate");

        resultado.textContent = "Deu velha!";

        mensagemResultado.textContent = "Ninguém venceu. Foi uma partida equilibrada!";

    }

    atualizarPlacar();

}

// Jogar novamente
btnNovamente.addEventListener("click", () => {

    iniciarJogo();

});

// Voltar ao início
btnVoltar.addEventListener("click", () => {

    jogoAtivo = false;

    telaJogo.classList.add("escondido");
    telaModo.classList.add("escondido");
    telaEscolha.classList.add("escondido");

    telaInicial.classList.remove("escondido");

});
