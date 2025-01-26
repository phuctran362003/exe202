using EXE201_2RE_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EXE201_2RE_API.DTOs
{
    public class UserModel
    {
        public Guid userId { get; set; }

        public string userName { get; set; }

        public string passWord { get; set; }

        public string email { get; set; }

        public string address { get; set; }

        public string phoneNumber { get; set; }

        public Guid? roleId { get; set; }

        public string? roleName { get; set; }

        public bool? isShopOwner { get; set; }

        public string shopName { get; set; }

        public string shopAddress { get; set; }

        public string shopDescription { get; set; }

        public string shopLogo { get; set; }

        public DateTime createdAt { get; set; }

        public DateTime updatedAt { get; set; }

    }
}
