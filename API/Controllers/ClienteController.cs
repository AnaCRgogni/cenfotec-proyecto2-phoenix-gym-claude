using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using Microsoft.AspNetCore.Cors;
using DTO;
using MVC.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ClienteController : ControllerBase
    {

        [HttpPost]
        public ApiResponse CreateCliente(Cliente cliente)
        {
            ClienteManager manager = new ClienteManager();
            int result = manager.CreateCliente(cliente);
            ApiResponse response = new ApiResponse();
            if (result == 0)
            {
                response.StatusCode = "200";
                response.Message = "Cliente Creado";
                response.Content = cliente.Cedula;
            }
            else if (result == -1)
            {
                response.StatusCode = "401";
                response.Message = "Correo en uso";
                response.Content = "";
            }
            else if (result == -2)
            {
                response.StatusCode = "402";
                response.Message = "Cedula en uso";
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

        [HttpPost]
        public ApiResponse UpdateCliente(Cliente cliente)
        {
            ClienteManager manager = new ClienteManager();
            int result = manager.UpdateCliente(cliente);
            ApiResponse response = new ApiResponse();
            if (result == 0)
            {
                response.StatusCode = "200";
                response.Message = "Cliente Actualizado";
                response.Content = cliente.Email;
            }
            else if (result == -1)
            {
                response.StatusCode = "401";
                response.Message = "Correo en uso";
                response.Content = "";
            }
            else if (result == -2)
            {
                response.StatusCode = "402";
                response.Message = "Cedula no encontrada";
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
        public List<Cliente> GetClientesValue()
        {
            ClienteManager manager = new ClienteManager();
            return manager.GetAllClientes();
        }

        [HttpGet]
        public Cliente GetClienteByEmail(string email)
        {
            ClienteManager manager = new ClienteManager();
            return manager.GetDataCliente(email);
        }
        
        [HttpDelete("{cedula}")]
        public IActionResult DeleteCliente(string cedula)
        {
            ClienteManager manager = new ClienteManager();
            manager.DeleteCliente(cedula);
            return Ok();
        }

        [HttpPut("{cedula}")]
        public IActionResult UpdateClienteEstado(string cedula)
        {
            ClienteManager manager = new ClienteManager();
            manager.UpdateClienteEstado(cedula);
            return Ok();
        }

        [HttpPut("{cedula}")]
        public IActionResult UpdateClienteEstadoDeshabilitar(string cedula)
        {
            ClienteManager manager = new ClienteManager();
            manager.UpdateClienteEstadoDeshabilitar(cedula);
            return Ok();
        }

        [HttpGet]
        public List<ResultadoRutina> GetRutinasById(string cedula)
        {
            ClienteManager manager = new ClienteManager();
            return manager.GetRutinasById(cedula);
        }

        [HttpGet]
        public List<ResultadoEntrenamiento> GetEntrenamientosById(string cedula)
        {
            ClienteManager manager = new ClienteManager();
            return manager.GetEntrenamientosById(cedula);
        }

        [HttpGet]
        public List<EntrenamientoCompartido> getEntrenamientosCompartidoById(string cedula,int id) 
        {
            ClienteManager manager = new ClienteManager();
            return manager.getEntrenamientosCompartidosById(cedula,id);
        }
    }
}

