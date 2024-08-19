using BusinessLayer;
using DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SendGrid;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DescuentoController : Controller
    {
        [HttpPost]
        public ApiResponse CreateDescuento(Descuento descuento)
        {
            DescuentoManager manager = new DescuentoManager();
            int result = manager.Create(descuento);
            ApiResponse response = new ApiResponse();
            if (result == -1) {
                response.StatusCode = "400";
                response.Message = "Codigo Duplicado";
                response.Content = "";
            }
            else
            {
                response.StatusCode = "200";
                response.Message = "Descuento Creado";
                response.Content = result.ToString();
            }
            return response;
        }

        [HttpGet]
        public ActionResult<List<Descuento>> GetAllDescuentos()
        {
            DescuentoManager manager = new DescuentoManager();
            List<Descuento> descuentoList= manager.GetAllDescuentos();
            if (descuentoList == null)
            {
                return NotFound();
            }
            return descuentoList;

        }

        [HttpGet]
        public Descuento GetDescuentoByid(int id)
        {
            DescuentoManager manager = new DescuentoManager();
            return manager.getDescuentoById(id);
        }

        [HttpGet]
        public float VerifyDescuento(string codigo)
        {
            DescuentoManager manager = new DescuentoManager();
            float result = manager.VerifyDescuento(codigo);
            /*ApiResponse response = new ApiResponse();
            if (result == 0)
            {
                response.StatusCode = "200";
                response.Message = "Descuento Actualizado";
                response.Content = "";
            }
            else if (result == -1)
            {
                response.StatusCode = "400";
                response.Message = "Codigo en uso";
                response.Content = "";
            }
            return response;*/
            return result;
        }


        [HttpPut]
        public ApiResponse UpdateDescuento(Descuento descuento)
        {
            DescuentoManager manager = new DescuentoManager();
            int result = manager.UpdateDescuento(descuento);
            ApiResponse response = new ApiResponse();
            if (result == 0)
            {
                response.StatusCode = "200";
                response.Message = "Descuento Actualizado";
                response.Content = "";
            }
            else if (result == -1)
            {
                response.StatusCode = "400";
                response.Message = "Codigo en uso";
                response.Content = "";
            }
            return response;
        }

        [HttpDelete]
        public IActionResult DeleteDescuento(int id)
        {
            try
            {
                DescuentoManager manager = new DescuentoManager();
                manager.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
