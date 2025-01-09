using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EXE201_2RE_API.Request
{
    public class SignupRequest
    {
        public string userName { get; set; } = null!;
        public string passWord { get; set; } = null!;
        public string email { get; set; } = null!;
        public string address { get; set; } = null!;
        public string phoneNumber { get; set; }
        public bool isShopOwner { get; set; }
        public string? shopName { get; set; }
        public string? shopAddress { get; set; }
        public string? shopDescription { get; set; }
        public string? shopBankId { get; set; }
        public string? shopBank { get; set; }
        public IFormFile? shopLogo { get; set; }

    }
}
