using EXE201_2RE_API.Request;
using EXE201_2RE_API.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EXE201_2RE_API.Controllers
{
    [ApiController]
    [Route("/user")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }
        [AllowAnonymous]
        [HttpGet("/role")]
        public async Task<IActionResult> GetAllRole()
        {
            var result = await _userService.GetAllRole();
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }
        [AllowAnonymous]
        [HttpGet()]
        public async Task<IActionResult> GetAllUser()
        {
            var result = await _userService.GetAllUser();
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }
        [AllowAnonymous]
        [HttpGet("/role/{roleId}")]
        public async Task<IActionResult> GetAllUserByRoleId(Guid roleId)
        {
            var result = await _userService.GetAllUserByRoleId(roleId);
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }

        [AllowAnonymous]
        [HttpPut("/update/profile/{userId}")]
        public async Task<IActionResult> UpdateProfile([FromRoute] Guid userId, [FromForm] UpdateProfileRequest req)
        {
            var result = await _userService.UpdateProfile(userId, req);
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }
    }
}
