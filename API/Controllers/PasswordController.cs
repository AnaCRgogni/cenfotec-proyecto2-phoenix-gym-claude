using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using DTO;
using MVC.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PasswordController : Controller
    {

        private readonly IConfiguration _configuration;

        public PasswordController(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        [HttpGet]
        public List<byte[]> ProcessPassword(string password)
        {
            PasswordService passwordService = new PasswordService();
            return passwordService.GenerateHashedPassword(password);
        }

        [HttpPost]
        public IActionResult SaveSalt(SaltData saltData)
        {
            PasswordService passwordService = new PasswordService();
            passwordService.SaveSalt(saltData);
            return Ok();
        }

        [HttpGet]
        public ActionResult<SaltData> GetLogInData(string cedula)
        {
            PasswordService passwordService = new PasswordService();
            SaltData saltData = passwordService.GetLogInData(cedula);
            if (saltData == null)
            {
                return NotFound();
            }
            return saltData;
        }

        [HttpGet]
        public ActionResult<SessionUser> GetLoggedUser(string email)
        {
            PasswordService passwordService = new PasswordService();
            SessionUser sessionUser = passwordService.GetLoggedUser(email);
            return sessionUser;

        }

        // -------------> Recuperación y cambio de contraseña <--------------------
        [HttpPost("recover-password")]
        public async Task<IActionResult> RecoverPassword([FromBody] ResetPasswordModel model)
        {
            if (string.IsNullOrWhiteSpace(model?.Email))
            {
                return BadRequest("Email no puede estar vacío");
            }

            var clienteManager = new ClienteManager();
            var user = clienteManager.GetDataCliente(model.Email);
            if (user == null)
            {
                return BadRequest("Usuario no encontrado");
            }

            var token = GenerateJwtToken(user.Email);
            var resetLink = $"{_configuration["AppSettings:FrontendUrl"]}/LandingPage/ReestablecerContrasena?token={token}&email={Uri.EscapeDataString(model.Email)}";

            EmailService service = new EmailService();
            var response = await service.ResetPasswordEmail(model.Email, resetLink);
            return Ok("Correo enviado.");
        }

        private string GenerateJwtToken(string email)
        {
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var creationTime = DateTime.UtcNow;
            var claims = new[]
            {
        new Claim(ClaimTypes.Name, email)
    };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                notBefore: creationTime,
                expires: creationTime.AddMinutes(15),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("validate-token")]
        public IActionResult ValidateToken(string token, string email)
        {
            var handler = new JwtSecurityTokenHandler();
            try
            {
                var jwtToken = handler.ReadJwtToken(token);
                var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name);
                var tokenCreationTime = jwtToken.ValidFrom;
                if (emailClaim != null && emailClaim.Value == email && DateTime.UtcNow <= tokenCreationTime.AddMinutes(5))
                {
                    return Ok();
                }
                return BadRequest(new { message = "Token o email inválido o el token ha expirado" });
            }
            catch
            {
                return BadRequest(new { message = "Token inválido" });
            }
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordModel model)
        {
            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest(new { message = "Las contraseñas no son iguales" });
            }
            var handler = new JwtSecurityTokenHandler();
            try
            {
                var jwtToken = handler.ReadJwtToken(model.Token);
                var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name);
                var tokenCreationTime = jwtToken.ValidFrom;
                if (emailClaim != null && emailClaim.Value == model.Email && DateTime.UtcNow <= tokenCreationTime.AddMinutes(15))
                {
                    var clienteManager = new ClienteManager();
                    var user = clienteManager.GetDataCliente(model.Email);
                    var manager = new PasswordService();
                    user.Contrasena = model.Password;

                    if (!manager.VerifyLast5Passwords(user, model.SaltValue, model.PasswordString))
                    {
                        return BadRequest(new { message = "La contraseña no puede ser igual a ninguna de las últimas 5 contraseñas" });
                    }

                    manager.UpdatePassword(user, model.SaltValue);
                    return Ok();
                }
                return BadRequest(new { message = "El token ha expirado" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Token inválido: {ex.Message}" });
            }
        }

        [HttpPost("change-password")]
        public IActionResult ChangePassword([FromBody] ResetPasswordModel model)
        {
            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest(new { message = "Las contraseñas no son iguales" });
            }
            var clienteManager = new ClienteManager();
            var user = clienteManager.GetDataCliente(model.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Usuario no encontrado" });
            }
            var manager = new PasswordService();
            user.Contrasena = model.Password;

            if (!manager.VerifyLast5Passwords(user, model.SaltValue, model.PasswordString))
            {
                return BadRequest(new { message = "La contraseña no puede ser igual a ninguna de las últimas 5 contraseñas" });
            }

            manager.UpdatePassword(user, model.SaltValue);
            return Ok();
        }

        [HttpGet("authenticate-password")]
        public IActionResult AuthenticatePassword(string email, string password)
        {
            var logManager = new LogInManager();
            bool isAuthenticated = logManager.AuthenticateUser(email, password) != null;
            return Ok(isAuthenticated);
        }
    }
}