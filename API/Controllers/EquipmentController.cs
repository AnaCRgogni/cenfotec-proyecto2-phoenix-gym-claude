using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;
using AppLogic;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EquipmentController : ControllerBase
    {
        [HttpPost]
        public IActionResult CreateMaquina(Maquina maquina)
        {
            //Console.WriteLine("Esta es la consola");
            EquipmentManager manager = new EquipmentManager();
            int result = manager.CreateEquipment(maquina);
            Console.WriteLine("Result" + result);
            if (result == 0)
            {
                return Ok();
            }
            else if (result == -1)
            {
                return StatusCode(409, "Machine with the specified ID already exists.");
            }
            else
            {
                return StatusCode(500, "An unknown error occurred.");
            }
        }

        [HttpGet]
        public List<Maquina> GetMaquinas()
        {
            EquipmentManager manager = new EquipmentManager();

            return manager.GetAllMaquinas();
        }

        [HttpPut]
        public IActionResult UpdateMaquina(Maquina maquina)
        {
            //Console.WriteLine("Esta es la consola");
            EquipmentManager manager = new EquipmentManager();
            int result = manager.UpdateEquipment(maquina);
            Console.WriteLine("Result" + result);
            if (result == 1)
            {
                return Ok();
            }
            else if (result == -1)
            {
                return StatusCode(409, "Machine with the specified ID does not exist.");
            }
            else
            {
                return StatusCode(500, "An unknown error occurred.");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMaquina(int id)
        {
            //Maquina maquina = new Maquina();
            //maquina.Id = id;

            //Console.WriteLine("Esta es la consola");
            EquipmentManager manager = new EquipmentManager();
            int result = manager.DeleteEquipment(id);
            Console.WriteLine("Result" + result);
            if (result == 1)
            {
                return Ok();
            }
            else if (result == -1)
            {
                return StatusCode(409, "Machine with the specified ID does not exist or is part of other object");
            }
            else
            {
                return StatusCode(500, "An unknown error occurred.");
            }
        }
    }
}