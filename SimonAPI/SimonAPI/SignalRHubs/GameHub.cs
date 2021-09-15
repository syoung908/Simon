using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Claims;
using System;
using System.Linq;
using System.Collections.Concurrent;

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
    }
}