
# Guia Seraph Dark

Este guia detalha as mecânicas, personagens e sistemas que compõem o jogo.

## 1. O Jogador
Você controla um mago poderoso com o objetivo de sobreviver o máximo possível contra hordas de inimigos.

### Controles:
- **A/D**: Mover para esquerda/direita  
- **W/Barra de Espaço**: Pular  
- **Mouse**: Mirar o cajado  
- **Clique do Mouse**: Atirar projéteis mágicos  
- **P/Esc**: Pausar o jogo  
- **F1**: Abrir/Fechar Menu de Depuração (testar melhorias)  

### Atributos:
- **Vida (HP)**: Se chegar a zero, o jogo acaba (exceto com melhoria "Fênix")  
- **Experiência (XP)**: Preencher a barra faz subir de nível  
- **Nível**: Aumentar cura parte da vida, remove parasitas e abre tela de melhorias  

---

## 2. Inimigos (Mobs)
### Atirador (Quadrado Vermelho)
- **Comportamento**: Desce do topo até altura fixa, depois paira e move horizontalmente  
- **Ataque**: Dispara projéteis teleguiados em intervalos regulares  

### Parasita (Círculo Verde)
- **Comportamento**: Persegue o jogador incansavelmente  
- **Ataque**: Causa dano por contato, prende ao jogador causando dano contínuo  

### Espiral (Triângulo Roxo)
- **Comportamento**: Aparece nas laterais e atravessa a tela em movimento giratório  
- **Ataque**: Causa dano alto por contato direto  

---

## 3. Melhorias (Buffs)
Ao subir de nível, escolha uma de três melhorias aleatórias.

### Ofensivas:
- **Tiro Forte**: Aumenta dano base dos projéteis  
- **Agilidade**: Aumenta velocidade de ataque  
- **Ricochete**: Projéteis quicam em paredes/teto  
- **Perfuração**: Projéteis atravessam múltiplos inimigos  
- **Estilhaços**: Projéteis se dividem ao atingir inimigos  
- **Combustão**: Chance de aplicar dano contínuo por queimadura  
- **Postura Firme**: Dobra dano quando atira parado  
- **Explosão Cadavérica**: Inimigos explodem ao morrer  
- **Tempestade**: Invoca raios aleatórios em inimigos  
- **Orbe de Disparo**: Orbe giratório que atira com você  
- **Orbe de Raio**: Orbe que dispara raios em inimigos próximos  
- **Olho do Caçador**: Projéteis perseguem inimigos  

### Defensivas:
- **Vitalidade**: Aumenta vida máxima e cura  
- **Armadura**: Reduz dano recebido (valor fixo)  
- **Bênção do Sábio**: Concede armadura temporária ao subir de nível  
- **Fênix**: Ressuscita uma vez com 25% de HP (único por partida)  
- **Aura de Espinhos**: Dano em área ao ser atingido  
- **Barreira Protetora**: Reduz dano recebido (porcentagem)  
- **Último Suspiro**: Evita ataque letal (único por vida)  

### Utilidade:
- **Vampirismo**: Converte % do dano em cura  
- **Sede de Sangue**: Cura 1 HP a cada 10 inimigos derrotados  
- **Frenesi**: Velocidade de movimento aumenta temporariamente por abate (acumula)  
- **Peste Virulenta**: Chance de infectar inimigos (inimigos infectados explodem ao morrer)  

---

## 4. Mecânicas do Jogo
- **Geração Procedural**: Terreno e fundo gerados aleatoriamente a cada partida (mundo maior que a tela)  
- **Câmera e Parallax**: Câmera segue jogador com efeito de profundidade no fundo  
- **Efeito de Tremor**: Tela treme ao sofrer dano (pode ser desativado no menu)  

# ⚙️ Registro de Atualização - 20 de Junho de 2025 ⚙️

Olá, Sobrevivente!  
A equipe de desenvolvimento tem trabalhado duro e está animada para apresentar uma atualização **robusta**, focada em **aprimoramentos visuais**, **correção de bugs** e um **balanço de habilidades** para tornar sua experiência de jogo ainda mais **imersiva e desafiadora**!

---

## ✨ Novidades e Melhorias Visuais ✨

### Inimigos Reimaginados
- **Atirador**: O antigo quadrado vermelho virou uma quimera grotesca inspirada no *Terraria*.
- **Girador**: O triângulo roxo agora é uma estrela vibrante, caótica e giratória.
- **Parasita**: O círculo verde evoluiu para uma larva nojenta e viscosa.

### Partículas de Dano Aprimoradas
- "Sangue" agora é pixelado e quadrado, dando sensação de esmagamento nojento e satisfatório.

### Interface do Usuário (UI) Polida
- Menus de upgrades e pausa redesenhados: mais bonitos e intuitivos.
- Botões de pausa e auto-mira corrigidos e melhorados.

### Projéteis Vibrantes
- Tiros com brilhos, trilhas e animações: o combate agora *vive*.

### Temporizador em Jogo
- Novo contador mostra até onde você consegue sobreviver à horda.

### Orbes com Vida Própria
- **Orbe de Disparo** e **Orbe de Raio** agora têm efeitos de:
  - Carregamento
  - Pulso
  - Disparo

---

## 🐞 Correções de Bugs 🐞

- **Vignette Otimizado**: efeito vermelho ao tomar dano não impacta mais o desempenho.
- **Animações Suaves**: bugs de movimentação corrigidos; fluidez total.
- **Raio Laser**: agora sempre visível com seus novos visuais.

---

## 📈 Balanço de Habilidades: Buffs & Nerfs 📉

- **Orbe do Raio (Dano Base)**: `2 → 5`
- **Frenesi (Velocidade Acumulada)**: `0.2 → 1`
- **Aura de Espinhos (Dano Base)**: `2 → 5`

### Benção do Sábio
- **Duração da Armadura**: `10s → 25s`
- **Ganho de Armadura**: `+10 → +15`

### Sede de Sangue (Rework Total)
- **Cura por Ativação**: `5 HP (Nível I) → 15 HP (Nível V)`
- **Inimigos para Curar**: `10 (Níveis I-III) → 5 (Nível V)`

### Peste Virulenta
- **Dano Base**: `2 → 6`

---

Agradecemos o apoio contínuo e esperamos que curtam as novidades!
