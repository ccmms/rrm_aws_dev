using System.Collections.Concurrent;

namespace rrm_reborn.backend
{
    public class ClickTracker : IClickTracker
    {
        private readonly ConcurrentDictionary<string, int> _userClicks = new();

        public int EndSession(string userId)
        {
            _userClicks.TryRemove(userId, out var total);
            return total;
        }


        public int GetTotal(string userId)
        {
            return _userClicks.TryGetValue(userId, out var total) ? total : 0;
        }


        public int RegisterClick(string userId)
        {
            return _userClicks.AddOrUpdate(userId, addValue: 1, updateValueFactory: (_, current) => current + 1);
        }
    }
}
