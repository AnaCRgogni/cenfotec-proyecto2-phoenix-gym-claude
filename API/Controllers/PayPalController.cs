using BusinessLayer;
using CloudinaryDotNet;
using DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PayPalController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public PayPalController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<string> GetPayPalAccessToken()
        {
            PayPalManager payPalManager = new PayPalManager(_configuration);
            var token = await payPalManager.GetPaypalToken();
            return token;
        }


        [HttpPost]
        public async Task<string> CreatePayPalOrder(PayPalJson json)
        {
            PayPalManager payPalManager = new PayPalManager(_configuration);
            var result = await payPalManager.CreateOrder(json);
            return result;
        }

        [HttpPost]
        public async Task<string> CompletePayPalOrder(string orderId)
        {
            PayPalManager payPalManager = new PayPalManager(_configuration);
            var result = await payPalManager.CompleteOrder(orderId);
            return result;
        }
    }
}
