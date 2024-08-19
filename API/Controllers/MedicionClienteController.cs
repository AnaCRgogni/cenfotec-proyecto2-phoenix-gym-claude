using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;
using DataAccess.Crud;
using AppLogic;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MedicionClienteController : ControllerBase
    {
        [HttpGet]
        public List<MedicionCliente> GetMedicionCliente()
        {
            MedicionClienteManager am = new MedicionClienteManager();

            return am.GetAllMedicionCliente();
        }
    }
}
