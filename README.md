# Tetris Game

A classic Tetris game built with HTML5 Canvas and vanilla JavaScript. Features smooth gameplay, colorful pieces, and a responsive design.

![Tetris Game](https://img.shields.io/badge/Game-Tetris-blue)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Deploy](https://github.com/denizaydogdu/tetris/actions/workflows/deploy.yml/badge.svg)

🎮 **[Play Now on Heroku!](https://tetris-game-deniz-12d7b9fc07ea.herokuapp.com/)**

## Features

- 🎮 Classic Tetris gameplay with all 7 tetromino pieces
- 🎨 Colorful pieces with gradient effects
- 📊 Score tracking and level progression
- 👻 Ghost piece preview showing where pieces will land
- 🔄 Smooth piece rotation with wall kicks
- 📱 Responsive design that works on all devices
- ⚡ Increasing difficulty as you progress through levels

## How to Play

### Controls

- **← →** Arrow keys: Move piece left/right
- **↑** Arrow key: Rotate piece clockwise
- **↓** Arrow key: Soft drop (faster fall + 1 point per row)
- **Space**: Hard drop (instant drop + 2 points per row)

### Scoring

- Single line clear: 100 points × current level
- Double line clear: 300 points × current level
- Triple line clear: 500 points × current level
- Tetris (4 lines): 800 points × current level
- Soft drop: 1 point per row
- Hard drop: 2 points per row

### Level Progression

- Level increases every 10 lines cleared
- Game speed increases with each level
- Maximum speed is reached at level 10

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/denizaydogdu/tetris.git
   cd tetris
   ```

2. Open `index.html` in your web browser:
   ```bash
   open index.html  # macOS
   start index.html  # Windows
   xdg-open index.html  # Linux
   ```

3. Start playing immediately! No build process or dependencies required.

## Game Mechanics

### Pieces (Tetrominoes)

The game includes all 7 standard Tetris pieces:

- **I-piece** (Cyan): Straight line piece
- **O-piece** (Yellow): Square piece
- **T-piece** (Purple): T-shaped piece
- **S-piece** (Green): S-shaped piece
- **Z-piece** (Red): Z-shaped piece
- **J-piece** (Blue): J-shaped piece
- **L-piece** (Orange): L-shaped piece

### Special Features

- **Ghost Piece**: Shows where your piece will land with transparency
- **Next Piece Preview**: Displays the next piece in the queue
- **Wall Kicks**: Pieces can rotate even when touching walls
- **Line Clear Animation**: Visual feedback when clearing lines

## Technical Details

- Built with vanilla JavaScript (ES6+)
- No external dependencies
- Uses HTML5 Canvas for rendering
- RequestAnimationFrame for smooth 60 FPS gameplay
- Responsive canvas sizing
- Local game state management

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

Requires a modern browser with HTML5 Canvas support.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

### Ideas for Enhancement

- [ ] Add pause functionality
- [ ] Implement high score tracking with localStorage
- [ ] Add sound effects and background music
- [ ] Create different game modes (Marathon, Sprint, Ultra)
- [ ] Add keyboard customization
- [ ] Implement T-spin detection
- [ ] Add multiplayer support

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by the original Tetris game created by Alexey Pajitnov
- Built as a learning project for HTML5 Canvas and game development

---

Enjoy playing! 🎮