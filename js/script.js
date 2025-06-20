window.addEventListener("load", function () {
 

  const game = new Game(canvas.width, canvas.height,ctx);
  game.run();

  window.restartGame = () => {
    game.restart();
  };

  setTimeout(() => {
    document.getElementById("instructions-ui").classList.add("fade-out");
  }, 7000);
});
