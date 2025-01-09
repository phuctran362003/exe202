using EXE201_2RE_API.Models;

namespace EXE201_2RE_API.Repository
{
    public class FavoriteRepository : GenericRepository<TblFavorite>
    {
        public FavoriteRepository() { }
        public FavoriteRepository(EXE201Context context)
        {
            _context = context;
        }
    }
}
