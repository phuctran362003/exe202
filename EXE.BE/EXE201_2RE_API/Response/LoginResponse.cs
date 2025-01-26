using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EXE201_2RE_API.Response
{
    public class LoginResponse
    {
        public string accessToken { get; set; } = null!;
    }
}
