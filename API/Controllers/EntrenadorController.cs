using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EntrenadorController : ControllerBase
    {
        [HttpPost]
        public IActionResult CreateEntrenador(Entrenador entrenador)
        {
            EntrenadorManager manager = new EntrenadorManager();
            manager.CreateEntrenador(entrenador);
            return Ok("success");
        }

        [HttpGet]
        public List<Entrenador> GetEntrenadores(string rolUsuario)
        {
            EntrenadorManager manager = new EntrenadorManager();
            return manager.GetAllEntrenadores(rolUsuario);
        }

        [HttpGet]
        public List<ResultadoRutina> GetRutinasById(string cedula)
        {
            EntrenadorManager manager = new EntrenadorManager();
            return manager.GetRutinasById(cedula);
        }

        [HttpGet]
        public List<EntrenamientoCompartido> getEntrenamientosCompartidoById(string cedula)
        {
            EntrenadorManager manager = new EntrenadorManager();
            return manager.getEntrenamientosCompartidosByUserId(cedula);
        }
    }
}
