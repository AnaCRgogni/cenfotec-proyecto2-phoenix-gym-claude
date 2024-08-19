using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmailController : Controller
    {
        [HttpPost]
        public async Task<IActionResult> SendOtpEmail(string email,int otp)
        {
            EmailService service = new EmailService();
            var response = await service.OtpEmail(email, otp);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> SendResetPasswordEmail(string email, string resetLink)
        {
            EmailService service = new EmailService();
            var response = await service.ResetPasswordEmail(email, resetLink);
            return Ok(response);
        }
    }
}
