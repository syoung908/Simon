using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;


namespace SimonAPI {
    public class GameHub: Hub {

        private readonly GameState _gameState;
        public GameHub(): this(GameState.Instance){}
        public GameHub(GameState gameState) {
            _gameState = gameState;
        }

        public override Task OnConnectedAsync() {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception) {
            LeaveGame().RunSynchronously();
            return base.OnDisconnectedAsync(exception);
        }

        public async Task JoinGame(string playerName) {
            if (!_gameState.InProgress()) {
                await Groups.AddToGroupAsync(Context.ConnectionId, "default");
                _gameState.AddPlayer(Context.ConnectionId, playerName);
                await Clients.Group("default").SendAsync("Players", _gameState.GetPlayers());
            } else {
                await Clients.Client(Context.ConnectionId).SendAsync("Lobby", "Game in progress");
            }
        }

        public async Task LeaveGame() {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "default");
            _gameState.RemovePlayer(Context.ConnectionId);
            await Clients.Group("default").SendAsync("Players", _gameState.GetPlayers());
        }

        public async Task PlayerReady(bool isReady) {
            PlayerState state = isReady ? PlayerState.Ready : PlayerState.NotReady;
            _gameState.SetPlayerState(Context.ConnectionId, state);

            if(_gameState.AllPlayersReady()) {
                await Clients.Group("default").SendAsync("Game", "Start");
            }
        }


    }
}