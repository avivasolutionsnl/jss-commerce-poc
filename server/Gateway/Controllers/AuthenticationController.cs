using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Gateway.Controllers
{
    [Route("authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly AppSettings appSettings;

        public AuthenticationController(IOptions<AppSettings> appSettings)
        {
            this.appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("getanonymoustoken")]
        public IActionResult Anonymous()
        {
            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                 Subject = new ClaimsIdentity(new[] 
                        {
                            new Claim("anonymous_user_id", Guid.NewGuid().ToString())
                        })
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            
            return Ok(new { token = tokenHandler.WriteToken(token)});
        }
    }
}