using EXE201_2RE_API.Models;

namespace EXE201_2RE_API.Repository
{
    public class ProductImageRepository : GenericRepository<TblProductImage>
    {
        public ProductImageRepository() { }
        public ProductImageRepository(EXE201Context context)
        {
            _context = context;
        }
    }
}
