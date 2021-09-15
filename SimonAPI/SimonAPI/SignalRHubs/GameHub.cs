using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Claims;
using System;
using System.Linq;
using System.Collections.Concurrent;

namespace SimonAPI {
    public class GameHub: Hub {
        ConcurrentQueue<Player> _matchmakingQueue;
        public GameHub() {
        }

        public async Task JoinMatchmaking(string username) {
            _matchmakingQueue.Enqueue(new Player() { Name = username, ConnectionID = Context.ConnectionId});
            if (_matchmakingQueue.Count >= 4) {
                for (int i = 0; i < 4; i++) {
                    Player p;
                    if(_matchmakingQueue.TryDequeue(out p)) {
                        await Clients.Client(p.ConnectionID).SendAsync("Join Room", "test");
                    }
                } 
            }
        }

        public async Task JoinGameRoom(string username, string roomId) {

        }

    }
}