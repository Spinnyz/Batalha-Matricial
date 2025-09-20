// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Seleção de elementos DOM
    const cart = document.querySelector('.cart');
    const titulo = document.querySelector('.titulo');
    const matriz1El = document.getElementById('matriz1');
    const matriz2El = document.getElementById('matriz2');
    const mensagemEl = document.querySelector('.mensagem');
    const vidaEl = document.querySelector('.kalli p:nth-child(2)');
    const opBtns = document.querySelectorAll('.op-btn');
    const respostaInput = document.getElementById('resposta');
    const enviarBtn = document.getElementById('enviar');

    if (!cart || !titulo || !matriz1El || !matriz2El || !mensagemEl || !vidaEl || !respostaInput) {
        console.error('Alguns elementos DOM não foram encontrados');
        return;
    }

    let cartas = [
        {tipo: '2x2', m1: [1,2,3,4], m2: [1,2,3,5]},
        {tipo: '2x2', m1: [2,1,4,3], m2: [3,1,2,4]},
        {tipo: '2x2', m1: [1,3,2,4], m2: [2,3,1,5]},
        {tipo: '2x2', m1: [4,3,2,1], m2: [1,2,3,5]},
        {tipo: '2x2', m1: [1,2,4,3], m2: [2,1,3,5]},
        {tipo: '2x2', m1: [3,1,4,2], m2: [1,3,2,5]},
        {tipo: '2x2', m1: [2,3,1,4], m2: [3,2,1,5]},
        {tipo: '3x3', m1: [1,2,3,4,5,6,7,8,9], m2: [1,2,3,4,5,6,7,8,9]},
        {tipo: '3x3', m1: [9,8,7,6,5,4,3,2,1], m2: [1,2,3,4,5,6,7,8,9]},
        {tipo: '3x3', m1: [2,4,6,8,1,3,5,7,9], m2: [1,2,3,4,5,6,7,8,9]}
    ];

    let cartaAtual = 0;
    let vida = 100;
    let operacaoAtual = null;
    let jogoIniciado = false;

    function formatarMatriz(arr, tipo) {
        try {
            if (tipo === '2x2') {
                return `${arr[0]} ${arr[1]}\n${arr[2]} ${arr[3]}`;
            }
            if (tipo === '3x3') {
                return `${arr[0]} ${arr[1]} ${arr[2]}\n${arr[3]} ${arr[4]} ${arr[5]}\n${arr[6]} ${arr[7]} ${arr[8]}`;
            }
            return '';
        } catch (error) {
            console.error('Erro ao formatar matriz:', error);
            return 'Erro na matriz';
        }
    }

    function matriz2D(arr, tipo) {
        try {
            if (tipo === '2x2') {
                return [[arr[0], arr[1]], [arr[2], arr[3]]];
            }
            if (tipo === '3x3') {
                return [
                    [arr[0], arr[1], arr[2]], 
                    [arr[3], arr[4], arr[5]], 
                    [arr[6], arr[7], arr[8]]
                ];
            }
            return [];
        } catch (error) {
            console.error('Erro ao converter para matriz 2D:', error);
            return [];
        }
    }

    function determinante(m) {
        try {
            if (!m || !Array.isArray(m)) return 0;
            
            if (m.length === 2) {
                return m[0][0] * m[1][1] - m[0][1] * m[1][0];
            }
            
            if (m.length === 3) {
                return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
                     - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
                     + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
            }
            
            return 0;
        } catch (error) {
            console.error('Erro ao calcular determinante:', error);
            return 0;
        }
    }

    // Operações matriciais
    function somar(a, b) {
        try {
            if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
                throw new Error('Arrays inválidos para soma');
            }
            return a.map((v, i) => v + b[i]);
        } catch (error) {
            console.error('Erro na soma:', error);
            return [];
        }
    }

    function subtrair(a, b) {
        try {
            if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
                throw new Error('Arrays inválidos para subtração');
            }
            return a.map((v, i) => v - b[i]);
        } catch (error) {
            console.error('Erro na subtração:', error);
            return [];
        }
    }

    function multiplicar(m1, m2) {
        try {
            if (!Array.isArray(m1) || !Array.isArray(m2) || m1.length !== m2.length) {
                throw new Error('Matrizes inválidas para multiplicação');
            }
            
            let size = m1.length;
            let res = Array.from({length: size}, () => Array(size).fill(0));
            
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    for (let k = 0; k < size; k++) {
                        res[i][j] += m1[i][k] * m2[k][j];
                    }
                }
            }
            
            return res.flat();
        } catch (error) {
            console.error('Erro na multiplicação:', error);
            return [];
        }
    }

    function exibirMatrizes() {
        try {
            if (cartaAtual >= cartas.length) return;
            
            const c = cartas[cartaAtual];
            matriz1El.style.display = 'block';
            matriz2El.style.display = 'block';
            matriz1El.textContent = formatarMatriz(c.m1, c.tipo);
            matriz2El.textContent = formatarMatriz(c.m2, c.tipo);
            respostaInput.placeholder = (c.tipo === '2x2') ? '1,2,3,4' : '1,2,3,4,5,6,7,8,9';
        } catch (error) {
            console.error('Erro ao exibir matrizes:', error);
        }
    }

    function atualizarCarta() {
        try {
            if (cartaAtual < cartas.length) {
                const cartasRestantes = cartas.length - cartaAtual;
                const cartP = cart.querySelector('p');
                if (cartP) {
                    cartP.textContent = cartasRestantes;
                }
                exibirMatrizes();
                limparMensagem();
            }
        } catch (error) {
            console.error('Erro ao atualizar carta:', error);
        }
    }

    function limparMensagem() {
        if (mensagemEl) {
            mensagemEl.textContent = '';
            mensagemEl.className = 'mensagem';
        }
    }

    function mostrarMensagem(texto, tipo = '') {
        if (mensagemEl) {
            mensagemEl.textContent = texto;
            mensagemEl.className = `mensagem ${tipo}`;
        }
    }

    function verificar() {
        try {
            if (!jogoIniciado) {
                mostrarMensagem("Clique na carta para começar!");
                return;
            }

            if (!operacaoAtual) {
                mostrarMensagem("Escolha uma operação primeiro!");
                return;
            }

            if (cartaAtual >= cartas.length) {
                finalizarJogo();
                return;
            }

            const c = cartas[cartaAtual];
            const m1 = matriz2D(c.m1, c.tipo);
            const m2 = matriz2D(c.m2, c.tipo);
            
            const inputValue = respostaInput.value.trim();
            if (!inputValue) {
                mostrarMensagem("Digite uma resposta!");
                return;
            }

            const input = inputValue.split(',').map(v => {
                const num = parseFloat(v.trim());
                if (isNaN(num)) {
                    throw new Error('Valor inválido');
                }
                return num;
            });

            let resultado = [];

            switch (operacaoAtual) {
                case '+':
                    resultado = somar(c.m1, c.m2);
                    break;
                case '-':
                    resultado = subtrair(c.m1, c.m2);
                    break;
                case '*':
                    resultado = multiplicar(m1, m2);
                    break;
                case 'det':
                    // Soma dos determinantes das duas matrizes
                    const det1 = determinante(m1);
                    const det2 = determinante(m2);
                    resultado = [det1 + det2];
                    break;
                default:
                    throw new Error('Operação inválida');
            }

            let correto = input.length === resultado.length && 
                         input.every((v, i) => Math.abs(v - resultado[i]) < 0.001);

            if (correto) {
                mostrarMensagem('Acertou! 🎉', 'acerto');
                vida -= (c.tipo === '2x2') ? 10 : 15;
                vida = Math.max(0, vida);
                vidaEl.textContent = `Vida: ${vida}`;
            } else {
                mostrarMensagem(`Errado! Resultado correto: ${resultado.join(', ')}`, 'erro');
            }

            cartaAtual++;
            operacaoAtual = null;
            respostaInput.value = '';

            opBtns.forEach(btn => btn.style.backgroundColor = '');

            setTimeout(() => {
                if (cartaAtual >= cartas.length || vida <= 0) {
                    finalizarJogo();
                } else {
                    atualizarCarta();
                }
            }, 2000);

        } catch (error) {
            console.error('Erro ao verificar resposta:', error);
            mostrarMensagem('Erro: ' + error.message, 'erro');
        }
    }

    function finalizarJogo() {
        try {
            matriz1El.style.display = 'none';
            matriz2El.style.display = 'none';
            cart.style.display = 'none';
            respostaInput.style.display = 'none';
            enviarBtn.style.display = 'none';
            opBtns.forEach(btn => btn.style.display = 'none');

            if (vida <= 0) {
                mostrarMensagem('kalli foi derrotado! Você venceu! 🎉', 'vitoria');
            } else {
                mostrarMensagem('Fim das cartas! kalli sobreviveu! 💀', 'derrota - 1000 de aura');
            }
        } catch (error) {
            console.error('Erro ao finalizar jogo:', error);
        }
    }


    if (cart) {
        cart.addEventListener('click', () => {
            try {
                if (!jogoIniciado) {
                    titulo.style.display = 'none';
                    jogoIniciado = true;
                    atualizarCarta();
                }
            } catch (error) {
                console.error('Erro ao iniciar jogo:', error);
            }
        });
    }

    opBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                if (!jogoIniciado) {
                    mostrarMensagem("Clique na carta para começar!");
                    return;
                }
                
                opBtns.forEach(b => b.style.backgroundColor = '');
                
                btn.style.backgroundColor = 'rgba(14, 87, 14, 0.3)';
                
                operacaoAtual = btn.dataset.op;
                mostrarMensagem(`Operação ${operacaoAtual} selecionada. Digite sua resposta!`);
            } catch (error) {
                console.error('Erro ao selecionar operação:', error);
            }
        });
    });

    if (enviarBtn) {
        enviarBtn.addEventListener('click', verificar);
    }

    if (respostaInput) {
        respostaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verificar();
            }
        });
    }

    const cartP = cart.querySelector('p');
    if (cartP) {
        cartP.textContent = cartas.length;
    }
});