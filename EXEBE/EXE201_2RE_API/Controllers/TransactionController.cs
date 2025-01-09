using EXE201_2RE_API.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EXE201_2RE_API.Controllers
{
    [ApiController]
    [Route("/transaction")]
    public class TransactionController : ControllerBase
    {
        private readonly TransactionService _transactionService;

        public TransactionController(TransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [AllowAnonymous]
        [HttpGet("/shop/{shopId}")]
        public async Task<IActionResult> GetAllByShop([FromRoute] Guid shopId)
        {
            var result = await _transactionService.GetAllByShop(shopId);
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }        
        
        [AllowAnonymous]
        [HttpPut("/status")]
        public async Task<IActionResult> ChangeStatus([FromQuery] Guid transactionId, [FromQuery] string status)
        {
            var result = await _transactionService.ChangeStatus(transactionId, status);
            return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
        }
    }
}
