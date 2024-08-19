using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EntrenamientoController : Controller
    {
        [HttpPost]
        public IActionResult CreateEntrenamiento(Entrenamiento entrenamiento)
        {
            EntrenamientosManager manager = new EntrenamientosManager();
            int result = manager.CreateEntrenamiento(entrenamiento);

            if (result > 0)
            {
                return Ok(new { Id = result });
            }
            return StatusCode(500, "An error occurred while processing your request.");
        }

        [HttpPost]
        public ApiResponse CompartirEntrenamiento(EntrenamientoCompartido entrenamientoCompartido) 
        {
            EntrenamientosManager manager = new EntrenamientosManager();
            int result = manager.CompartirEntrenamiento(entrenamientoCompartido);

            ApiResponse response = new ApiResponse();
            if (result == 0)
            {
                response.StatusCode = "200";
                response.Message = "Entrenamiento Compartido";
                response.Content = "";
            }
            else if (result == -1)
            {
                response.StatusCode = "401";
                response.Message = "Error, este entrenamiento ya fue compartido";
                response.Content = "";
            }
            else
            {
                response.StatusCode = "500";
                response.Message = "Ni idea de que paso";
                response.Content = "";
            }
            return response;

        }

        [HttpGet]

        public ResultadoEntrenamiento GetEntrenamientoById(int id) {
            EntrenamientosManager manager = new EntrenamientosManager();
            return manager.getEntrenamientoById(id);

        }

        [HttpGet]
        public List<ResultadoSets> GetSetsByEntrenamiento(int id)
        {
            EntrenamientosManager manager = new EntrenamientosManager();
            return manager.GetSetsByEntrenamiento(id);
        }

        [HttpDelete]

        public IActionResult DeleteEntrenamientoCompartido(int id)
        {
            try
            {
                EntrenamientosManager manager = new EntrenamientosManager();
                manager.DeleteEntrenamientoCompartido(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete]

        public IActionResult DeleteEntrenamiento(int id)
        {
            try
            {
                EntrenamientosManager manager = new EntrenamientosManager();
                manager.DeleteEntrenamiento(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



    }
}
