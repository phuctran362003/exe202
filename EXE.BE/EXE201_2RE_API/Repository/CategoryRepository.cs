using EXE201_2RE_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EXE201_2RE_API.Repository
{
    public class CategoryRepository : GenericRepository<TblCategory>
    {
        public CategoryRepository() { }
        public CategoryRepository(EXE201Context context)
        {
            _context = context;
        }
    }
}
