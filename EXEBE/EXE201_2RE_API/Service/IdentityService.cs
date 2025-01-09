using EXE201_2RE_API.Auth;
using EXE201_2RE_API.Constants;
using EXE201_2RE_API.Domain.Helpers;
using EXE201_2RE_API.Enums;
using EXE201_2RE_API.Helpers;
using EXE201_2RE_API.Models;
using EXE201_2RE_API.Repository;
using EXE201_2RE_API.Request;
using EXE201_2RE_API.Response;
using EXE201_2RE_API.Setting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace EXE201_2RE_API.Service
{
    public class IdentityService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly UnitOfWork _unitOfWork;
        private readonly IFirebaseService _firebaseService;
        public IdentityService(UnitOfWork unitOfWork, IOptions<JwtSettings> jwtSettingsOptions, IFirebaseService firebaseService)
        {
            _unitOfWork = unitOfWork;
            _jwtSettings = jwtSettingsOptions.Value;
            _firebaseService = firebaseService;
        }

        public async Task<IServiceResult> Signup(SignupRequest req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.userName))
                {
                    return new ServiceResult(500, "Incorrect format of Username");
                }

                string emailPattern = @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$";

                if (!Regex.IsMatch(req.email, emailPattern))
                {
                    return new ServiceResult(500, "Incorrect format of Email");
                }

                string phonePattern = @"^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$";

                if (!Regex.IsMatch(req.phoneNumber, phonePattern))
                {
                    return new ServiceResult(500, "Incorrect format of Phone number");
                }

                var user = _unitOfWork.UserRepository.GetAll().Where(u => u.email == req.email).FirstOrDefault();
                if (user is not null)
                {
                    return new ServiceResult(500, "Email already exists");
                }

                var newAccount = new TblUser
                {
                    userId = Guid.NewGuid(),
                    userName = req.userName,
                    passWord = SecurityUtil.Hash(req.passWord),
                    email = req.email,
                    address = req.address,
                    phoneNumber = req.phoneNumber,
                    isShopOwner = req.isShopOwner,
                    shopAddress = req.shopAddress,
                    roleId = new Guid("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
                    shopDescription = req.shopDescription,
                    shopName = req.shopName,
                    createdAt = DateTime.Now,
                    updatedAt = DateTime.Now,
                    shopBankId = req.shopBankId,
                    shopBank = req.shopBank,
                };
                if (req.shopLogo != null && req.shopLogo.Length > 0)
                {                    
                    var imagePath = $"{FirebasePathName.AVATAR}{newAccount.userId}";
                    var imageUploadResult = await _firebaseService.UploadFileToFirebase(req.shopLogo, imagePath);

                    if (imageUploadResult.isSuccess)
                    {
                        newAccount.shopLogo = (string)imageUploadResult.result;
                    }
                    else
                    {
                        return new ServiceResult(500, "Failed to upload one or more images", null);
                    }
                }
                _unitOfWork.UserRepository.PrepareCreate(newAccount);

                var res = await _unitOfWork.UserRepository.SaveAsync();

                if (res > 0)
                {
                    return new ServiceResult(200, "Sign up successfully");
                }

                return new ServiceResult(500, "Sign up fail");
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public LoginResult Login(string email, string password)
        {
            var user = _unitOfWork.UserRepository.GetAllIncluding(_ => _.role).Where(_ => _.email.Equals(email)).FirstOrDefault();

            if (user is null)
            {
                return new LoginResult
                {
                    RoleName = null,
                    Authenticated = false,
                    Token = null,
                };
            }

            var hash = SecurityUtil.Hash(password);
            if (!user.passWord.Equals(hash))
            {
                return new LoginResult
                {
                    RoleName = null,
                    Authenticated = false,
                    Token = null,
                };
            }

            return new LoginResult
            {
                RoleName = user.role.name,
                Authenticated = true,
                Token = CreateJwtToken(user),
            };
        }

        private SecurityToken CreateJwtToken(TblUser user)
        {
            var utcNow = DateTime.UtcNow;
            var authClaims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.NameId, user.userId.ToString()),
                new(JwtRegisteredClaimNames.Email, user.email),
                new(ClaimTypes.Role, user.role.name),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var key = Encoding.ASCII.GetBytes(_jwtSettings.Key);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(authClaims),
                SigningCredentials =
                    new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256),
                Expires = utcNow.Add(TimeSpan.FromHours(1)),
            };

            var handler = new JwtSecurityTokenHandler();

            var token = handler.CreateToken(tokenDescriptor);

            return token;
        }
    }
}
