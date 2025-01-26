using EXE201_2RE_API.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EXE201_2RE_API.Controllers
{
    [ApiController]
    [Route("/favorite")]
    public class FavoriteController : ControllerBase
    {
        private readonly FavoriteService _favoriteService;

        public FavoriteController(FavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [AllowAnonymous]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetFavoriteProductsByUserId([FromRoute] Guid userId)
        {
            var result = await _favoriteService.GetFavoriteProductsByUserId(userId);
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }        
        
        [AllowAnonymous]
        [HttpPost("{userId}/{productId}")]
        public async Task<IActionResult> AddFavoriteProduct([FromRoute] Guid userId, [FromRoute] Guid productId)
        {
            var result = await _favoriteService.AddFavoriteProduct(userId, productId);
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }
    }
}
