using BusinessLayer;
using DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MedicionController : Controller
    {
        [HttpPost]
        public int CreateMedicion(Medicion medicion)
        {
            //Console.WriteLine("Esta es la consola");
            MedicionManager manager = new MedicionManager();
            var id = manager.CreateMedicion(medicion);
            return id;
        }

        [HttpGet]
        public List<Medicion> GetMedicionByCliente(String cedula)
        {
            MedicionManager manager = new MedicionManager();
            return manager.GetMedicionesByClientId(cedula);

        }
    }
}
