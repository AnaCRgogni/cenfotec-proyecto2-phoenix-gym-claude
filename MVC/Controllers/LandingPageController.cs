using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MVC.Models;

namespace MVC.Controllers
{
    public class LandingPageController : Controller
    {
        public IActionResult LandingPage()
        {
            return View();
        }
        public IActionResult LogIn()
        {
            return View();
        }

        public IActionResult CambiarContrasena()
        {
            return View();
        }
        public IActionResult RecuperarContrasena()
        {
            return View();
        }

        public IActionResult ReestablecerContrasena(string token, string email)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                return BadRequest("Se requiere token y email.");
            }

            var handler = new JwtSecurityTokenHandler();
            try
            {
                var jwtToken = handler.ReadJwtToken(token);
                var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name);

                if (emailClaim != null && emailClaim.Value == email)
                {
                    var tokenCreationTime = jwtToken.ValidFrom;

                    Console.WriteLine($"Hora actual UTC: {DateTime.UtcNow}, Hora de creación del token: {tokenCreationTime}");

                    if (DateTime.UtcNow <= tokenCreationTime.AddMinutes(15))
                    {
                        var model = new ResetPasswordModel { Token = token, Email = email };
                        return View(model);
                    }
                    else
                    {
                        return BadRequest("El link ha expirado.");
                    }
                }

                return BadRequest("Token o email inválido.");
            }
            catch
            {
                return BadRequest("Token inválido.");
            }
        }

    }
}
