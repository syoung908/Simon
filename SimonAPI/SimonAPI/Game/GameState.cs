using System;
using System.Linq;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace SimonAPI {
    public class GameState { 
        private readonly ConcurrentDictionary<string, Player> _players;
        private int _round = 1;
        private bool _inProgress = false;
        private Player playerWon = null;

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

        public void BeginGame() {
            _round = 1;
            playerWon = null;
            _inProgress = true;
        }

        public void EndGame() {
            _inProgress = false;
        }

        public bool IsRoundOver() {
            foreach (Player player in _players.Values) {
                if (player.State == "Playing" || player.State == "GameReady") {
                    return false;
                }
            }
            return true;
        }

        public bool IsGameOver() {
            if(_players.Count == 1) {
                Player singlePlayer = _players.Values.FirstOrDefault();
                return singlePlayer.State == "LostRound";
            } else {
                return playerWon != null;
            }
        }

        public void PlayerSurvived(string connectionId, bool survived) {
            SetPlayerState(connectionId, survived ? "WonRound" : "LostRound");

            //Multiplayer Win Condition
            if(_players.Count > 1) {
                int playersRemaining = 0;
                foreach (Player player in _players.Values) {
                    if (player.State == "WonRound" || player.State == "Playing") playersRemaining++;
                }
                Console.WriteLine(playersRemaining);
                if (playersRemaining == 1) playerWon = _players.Values.Where(p => p.State == "WonRound").SingleOrDefault();
            }
        }

        public void BeginRound() {
            foreach (Player player in _players.Values) {
                if (player.State == "GameReady") {
                    player.State = "Playing";
                }
            }
        }

        public void EndRound() {
            foreach (Player player in _players.Values) {
                if (player.State == "WonRound") {
                    player.State = "GameReady";
                }
            }
            _round++;
        }

        public bool AreAllPlayersRoundReady() {
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

        public Player getWinner() {
            return playerWon;
        }
    }
}