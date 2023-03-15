export const TitleScreenState = {
    name: 'TitleScreenState',
    onStartButtonClick: function(state) {
        console.log('Starting game...');
        state('play');
    }
  };
  
  export const PlayState = {
    name: 'PlayState',
    onPlayerDeath: function(state) {
        console.log('Farmer died!');
        state('gameover');
    }
  };
  
  export const GameOverState = {
    name: 'GameOverState',
    onRestartButtonClick: function(state) {
        console.log('Restarting game...');
        state('title');
    }
  };
  