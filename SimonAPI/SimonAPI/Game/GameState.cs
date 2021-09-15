using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace SimonAPI {
    public class GameState { 

        private readonly static Lazy<GameState> _instance = new Lazy<GameState>(() => new GameState());
        private readonly ConcurrentDictionary<string, Player> _players;
        private int _round = 1;
        private bool _inProgress = false;

        public GameState() {
            _players = new ConcurrentDictionary<string, Player>();
        }

        public static GameState Instance {
            get {
                return _instance.Value;
            }
        }

        public bool AddPlayer(string connectionId, string playerName) {
            return _players.TryAdd(connectionId, new Player() { Name = playerName});
        }

        public bool RemovePlayer(string connectionId) {
            return _players.TryRemove(connectionId, out _);
        }

        public void SetPlayerState(string connectionId, PlayerState state) {
            _players[connectionId].State = state;
        }

        public bool AllPlayersReady() {
            foreach(Player player in _players.Values) {
                if (player.State == PlayerState.NotReady) return false;
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