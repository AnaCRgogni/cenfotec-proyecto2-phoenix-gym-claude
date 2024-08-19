using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EjercicioController : ControllerBase
    {

        [HttpPost]
        public IActionResult CreateEjercicio(Ejercicio ejercicio)
        {
            EjercicioManager manager = new EjercicioManager();
            manager.CreateEjercicio(ejercicio);
            return Ok();
        }
        
        [HttpGet]
        public List<Ejercicio> GetAllEjercicios()
        {
            EjercicioManager manager = new EjercicioManager();
            return manager.GetAllEjercicios();
        }

        [HttpPut]
        public IActionResult UpdateEjercicio(Ejercicio ejercicio)
        {
            EjercicioManager manager = new EjercicioManager();
            int result = manager.UpdateEjercicio(ejercicio);
            
            Console.WriteLine("Result" + result);
            if (result == 1)
            {
                return Ok();
            }
            else if (result == -1)
            {
                return StatusCode(409, "Exercise with the specified ID does not exist or is part of another object.");
            }
            else
            {
                return StatusCode(500, "An unknown error occurred.");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEjercicio(int id)
        {
            //Ejercicio ejercicio = new Ejercicio();
            //ejercicio.Id = id;
            EjercicioManager manager = new EjercicioManager();
            int result = manager.DeleteEjercicio(id);
            Console.WriteLine("Result" + result);
            if (result == 1)
            {
                return Ok();
            }
            else if (result == -1)
            {
                return StatusCode(409, "Excercise with the specified ID does not exist or is part of other object");
            }
            else
            {
                return StatusCode(500, "An unknown error occurred.");
            }
        }
    }
}