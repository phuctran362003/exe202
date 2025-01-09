using EXE201_2RE_API.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EXE201_2RE_API.Controllers
{
    [ApiController]
    [Route("/shop")]
    public class ShopController : ControllerBase
    {
        private readonly ProductService _productService;

        public ShopController(ProductService productService)
        {
            _productService = productService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllShop()
        {
            var result = await _productService.GetAllShop();
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }

        [AllowAnonymous]
        [HttpGet("/detail/{id}")]
        public async Task<IActionResult> GetShopDetail([FromRoute] Guid id)
        {
            var result = await _productService.GetShopDetail(id);
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }

        [AllowAnonymous]
        [HttpGet("detail-cart-from-shop/{cartId}")]
        public async Task<IActionResult> OrderDetailFromShop([FromRoute] Guid cartId)
        {
            var result = await _productService.OrderDetailFromShop(cartId);
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }
    }
}
