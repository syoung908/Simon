using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace SimonAPI {
    public class GameState { 

        private readonly static Lazy<GameState> _instance = new Lazy<GameState>(() => new GameState());
        private readonly ConcurrentDictionary<Player, PlayerState> _players;
        private int _round = 1;

        public GameState() {
            _players = new ConcurrentDictionary<Player, PlayerState>();
        }

        public static GameState Instance {
            get {
                return _instance.Value;
            }
        }

        public bool AddPlayer(Player player) {
            return _players.TryAdd(player, PlayerState.NotReady);
        }

        public bool RemovePlayer(Player player) {

        }

        public IList<int> GenerateSequence() {
            List<int> sequence = new();
            Random rand = new();
            for (int i = 0; i < _round + 2; i++) {
                sequence.Add(rand.Next(4));
            }

            return sequence;
        }

        public bool IsRoundOver() {
            foreach(PlayerState state in _players.Values) {
                if (state == PlayerState.Playing) return false;
            }
            return true;
        }
    }
}