
// Remova quaisquer declarações globais de 'canvas' e 'ctx' se elas existirem fora deste listener.
// Elas serão definidas dentro do 'load' listener.

window.addEventListener("load", function () {
    //  Certifique-se que 'canvas' e 'ctx' são definidos aqui.
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    //  Ajusta o tamanho do canvas para preencher a tela na inicialização
    // Isso é importante para que os joysticks calculem suas posições baseadas no tamanho correto.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(canvas.width, canvas.height, ctx);
    
    game.run();

    window.restartGame = () => {
        game.restart();
    };

    // A lógica de fading para instruções UI deve ser gerenciada pelo InputHandler
    // ou pela sua UI, para garantir que as instruções corretas (desktop vs mobile)
    // sejam mostradas/escondidas. Por enquanto, mantenho o seu setTimeout.
    setTimeout(() => {
        const instructionsUi = document.getElementById("instructions-ui");
        if (instructionsUi) { // Verifica se o elemento existe antes de tentar acessar
            instructionsUi.classList.add("fade-out");
        }
    }, 7000);
});