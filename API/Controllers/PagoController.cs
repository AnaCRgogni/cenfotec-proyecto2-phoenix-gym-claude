using BusinessLayer;
using DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PagoController : Controller
    {
        [HttpPost]
        public void CreatePago(Pago pago)
        {
            //Console.WriteLine("Esta es la consola");
            PagoManager manager = new PagoManager();
            manager.CreatePago(pago);
        }
    }
}
