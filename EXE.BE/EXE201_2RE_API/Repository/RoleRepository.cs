using EXE201_2RE_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EXE201_2RE_API.Repository
{
    public class RoleRepository : GenericRepository<TblRole>
    {
        public RoleRepository() { }
        public RoleRepository(EXE201Context context)
        {
            _context = context;
        }
    }
}
