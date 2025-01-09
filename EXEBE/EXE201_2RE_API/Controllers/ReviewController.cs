using EXE201_2RE_API.Request;
using EXE201_2RE_API.Response;
using EXE201_2RE_API.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EXE201_2RE_API.Controllers
{
    [ApiController]
    [Route("/review")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Review([FromBody] ReviewRequest req)
        {
            if (req.rating < 1 && req.rating > 5)
            {
                return BadRequest("Invalid rating!");
            }

            var result = await _reviewService.Review(req);
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }

    }
}
