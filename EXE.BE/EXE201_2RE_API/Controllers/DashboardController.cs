using EXE201_2RE_API.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EXE201_2RE_API.Controllers
{
    [ApiController]
    [Route("/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly UserService _userService;

        public DashboardController(UserService userService)
        {
            _userService = userService;
        }      
        
        [AllowAnonymous]
        [HttpGet("shop/{shopId}")]
        public async Task<IActionResult> DashboardOfShop([FromRoute] Guid shopId)
        {
            var result = await _userService.DashboardOfShop(shopId);
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }        
        
        [AllowAnonymous]
        [HttpGet("admin")]
        public async Task<IActionResult> AdminDashboard()
        {
            var result = await _userService.AdminDashboard();
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }
    }
}
