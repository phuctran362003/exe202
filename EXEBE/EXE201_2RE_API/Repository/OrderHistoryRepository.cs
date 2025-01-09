using EXE201_2RE_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EXE201_2RE_API.Repository
{
    public class OrderHistoryRepository : GenericRepository<TblOrderHistory>
    {
        public OrderHistoryRepository() { }
        public OrderHistoryRepository(EXE201Context context)
        {
            _context = context;
        }
    }
}
