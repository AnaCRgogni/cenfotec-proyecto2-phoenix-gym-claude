using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RutinaController : ControllerBase
    {

        [HttpPost]
        public IActionResult CreateRutina(Rutina rutina)
        {
            RutinasManager manager = new RutinasManager();
            int result = manager.CreateRutina(rutina);
            
            if (result > 0)
            {
                return Ok(new { Id = result });
            }
            return StatusCode(500, "An error occurred while processing your request.");
        }
        
        [HttpGet]
        public List<Ejercicio> GetAllRutinas()
        {
            EjercicioManager manager = new EjercicioManager();
            return manager.GetAllEjercicios();
        }

        [HttpGet]
        public List<ResultadoSets> GetSetsByRutina(int id)
        {
            RutinasManager manager = new RutinasManager();
            return manager.GetSetsByRutina(id);
        }

        [HttpDelete("{idRut}")]
        public IActionResult DeleteRutina(int idRut)
        {
            RutinasManager manager = new RutinasManager();
            manager.DeleteRutina(idRut);
            return Ok();
        }
    }
}