namespace SimonAPI {
    public class Player {
        public string Name { get; set; }
        public PlayerState State { get; set; } = PlayerState.NotReady;
    }

    public enum PlayerState {
        Completed,
        Lost,
        Playing,
        Ready,
        NotReady,
    }
}