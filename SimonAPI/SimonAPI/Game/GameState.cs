using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace SimonAPI {
    public class GameState { 
        private readonly ConcurrentDictionary<string, Player> _players;
        private int _round = 1;
        private bool _inProgress = false;

        public GameState() {
            _players = new ConcurrentDictionary<string, Player>();
        }

        public bool AddPlayer(string connectionId, string playerName) {
            return _players.TryAdd(connectionId, new Player() { Name = playerName});
        }

        public bool RemovePlayer(string connectionId) {
            return _players.TryRemove(connectionId, out _);
        }

        public void SetPlayerState(string connectionId, string state) {
            _players[connectionId].State = state;
        }

        public bool AllPlayersReady() {
            foreach (Player player in _players.Values) {
                if (player.State == "NotReady") return false;
            }
            return true;
        }

        public bool RoundOver() {
            foreach (Player player in _players.Values) {
                if (player.State == "Playing" || player.State == "GameReady") {
                    return false;
                }
            }
            return true;
        }

        public void BeginRound() {
            foreach (Player player in _players.Values) {
                player.State = "Playing";
            }
        }

        public bool RoundReady() {
            foreach (Player player in _players.Values) {
                if (player.State != "GameReady") {
                    return false;
                }
            }
            return true;
        }

        public bool InProgress() {
            return _inProgress;
        }

        public ICollection<Player> GetPlayers() {
            return _players.Values; 
        }

        public IList<int> GenerateSequence() {
            List<int> sequence = new();
            Random rand = new();
            for (int i = 0; i < _round + 2; i++) {
                sequence.Add(rand.Next(4));
            }

            return sequence;
        }
    }
}