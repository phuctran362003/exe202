using EXE201_2RE_API.Models;

namespace EXE201_2RE_API.Repository
{
    public class TransactionRepository: GenericRepository<TblTransaction>
    {
        public TransactionRepository() { }
        public TransactionRepository(EXE201Context context)
        {
            _context = context;
        }
    }
}
