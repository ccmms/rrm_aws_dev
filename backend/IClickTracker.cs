namespace rrm_reborn.backend
{
    public interface IClickTracker
    {
        int RegisterClick(string userId);
        int GetTotal(string userId);
        int EndSession(string userId);
    }
}
