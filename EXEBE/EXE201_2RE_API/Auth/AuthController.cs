using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EXE201_2RE_API.Service;
using EXE201_2RE_API.Request;
using EXE201_2RE_API.Response;
using EXE201_2RE_API.Exceptions;
using EXE201_2RE_API.Auth;
using System.IdentityModel.Tokens.Jwt;

namespace EXE201_2RE_API.Auth;

[Route("api/[controller]/[action]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IdentityService _identityService;
    private readonly UserService _userService;

    public AuthController(IdentityService identityService, UserService userService)
    {
        _identityService = identityService;
        _userService = userService;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Signup([FromForm] SignupRequest req)
    {
        var result = await _identityService.Signup(req);
        return StatusCode((int)result.Status, result.Data == null ? result.Message : result.Data);
    }

    [AllowAnonymous]
    [HttpPost]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        var loginResult = _identityService.Login(req.email, req.password);
        if (!loginResult.Authenticated)
        {
            var result = ApiResult<Dictionary<string, string[]>>.Fail(new Exception("Username or password is invalid"));
            return BadRequest(result);
        }

        var handler = new JwtSecurityTokenHandler();
        var res = new LoginResponse
        {
            accessToken = handler.WriteToken(loginResult.Token),
        };
        return Ok(ApiResult<LoginResponse>.Succeed(res));
    }
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> CheckToken()
    {
       if (!Request.Headers.TryGetValue("Authorization", out var token))
        {
            return StatusCode(404, "Cannot find user");
        }
        token = token.ToString().Split()[1];
        var currentUser = await _userService.GetUserInToken(token);
        if (currentUser == null)
        {
            return StatusCode(404, "Cannot find user");
        }
        // Here goes your token validation logic
        if (string.IsNullOrWhiteSpace(token))
        {
            throw new BadRequestException("Authorization header is missing or invalid.");
        }
        // Decode the JWT token
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        // Check if the token is expired
        if (jwtToken.ValidTo < DateTime.UtcNow)
        {
            throw new BadRequestException("Token has expired.");
        }

        string email = jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

        var user = await _userService.GetUserByEmail(email);
        if (user.Data == null)
        {
            return BadRequest("username is in valid");
        }

        // If token is valid, return success response
        return Ok(ApiResult<CheckTokenResponse>.Succeed(new CheckTokenResponse
        {
            user = user.Data
        }));
    }
}