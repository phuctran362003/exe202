using EXE201_2RE_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EXE201_2RE_API.Repository
{
    public class CartRepository : GenericRepository<TblCart>
    {
        public CartRepository() { }
        public CartRepository(EXE201Context context)
        {
            _context = context;
        }
    }
}
