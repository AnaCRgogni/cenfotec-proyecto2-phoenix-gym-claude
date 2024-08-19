using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RecepcionistaController : ControllerBase
    {
        [HttpPost]
        public IActionResult CreateRecepcionista(Recepcionista recepcionista)
        {
            RecepcionistaManager manager = new RecepcionistaManager();
            manager.CreateRecepcionista(recepcionista);
            return Ok("success");
        }
    }
}
