using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RutinasController : ControllerBase
    {
        [HttpPost]
        public IActionResult CreateRutina(Rutina rutina)
        {

            Console.WriteLine("Esta es la consola");
            RutinasManager manager = new RutinasManager();
            manager.CreateRutina(rutina);
            Console.WriteLine(rutina);
            return Ok();
        }
    }
}