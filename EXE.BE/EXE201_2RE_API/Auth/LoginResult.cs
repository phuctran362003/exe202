using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EXE201_2RE_API.Auth
{
    public class LoginResult
    {
        public string RoleName { get; set; }
        public bool Authenticated { get; set; }
        public SecurityToken? Token { get; set; }
    }
}
