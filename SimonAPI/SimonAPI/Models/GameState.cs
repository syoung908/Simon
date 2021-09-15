using System;
using System.Collections.Generic;

namespace SimonAPI {
    public class GameState {
        public string RoomID { get; set; }
        public Dictionary<Player, PlayerState> Players { get; set; }
        public int Round { get; set; } = 1;

        public enum PlayerState {
            Completed,
            Lost,
            Playing,
            Ready,
        }

        public GameState() {
            Players = new Dictionary<Player, PlayerState>();
        }

        public IList<int> GenerateSequence() {
            List<int> sequence = new();
            Random rand = new();
            for (int i = 0; i < Round + 2; i++) {
                sequence.Add(rand.Next(4));
            }

            return sequence;
        }

        public bool IsRoundOver() {
            foreach(PlayerState state in Players.Values) {
                if (state == PlayerState.Playing) return false;
            }
            return true;
        }
    }
}