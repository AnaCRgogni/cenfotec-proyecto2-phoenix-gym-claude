using DataAccess.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO;

namespace DataAccess.Mapper
{
    public class EjercicioMapper : ICrudStatements, IObjectMapper
    {
        public Ejercicio BuildObject(Dictionary<string, object> objectRow)
        {
            // Crear el objeto Ejercicio
            var ejercicio = new Ejercicio()
            {
                Id = int.Parse(objectRow["EjercicioID"].ToString()),
                Name = objectRow["EjercicioName"].ToString(),
                Description = objectRow["EjercicioDescription"].ToString(),
                Picturelink = objectRow["EjercicioImage"].ToString()
            };

            // Crear el objeto Maquina y asignar valores si están presentes en el diccionario
            if (objectRow.ContainsKey("MaquinaID") && objectRow["MaquinaID"] != DBNull.Value)
            {
                ejercicio.Maquina = new Maquina()
                {
                    Id = int.Parse(objectRow["MaquinaID"].ToString()),
                    Name = objectRow["MaquinaName"].ToString(),
                    Description = objectRow["MaquinaDescription"].ToString(),
                    Picturelink = objectRow["MaquinaPictureLink"].ToString()
                };
            }
            else
            {
                ejercicio.Maquina = null; // o asignar un valor predeterminado si es necesario
            }

            return ejercicio;
        }

        public List<BaseClass> BuildObjects(List<Dictionary<string, object>> objectRows)
        {
            var lstResult = new List<BaseClass>();

            foreach (var objRow in objectRows)
            {
                var article = BuildObject(objRow);
                lstResult.Add(article);
            }
            return lstResult;
        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addEjercicio";

            Ejercicio ejercicio = (Ejercicio)entityDTO;

            operation.AddVarcharParam("Nombre", ejercicio.Name);
            operation.AddVarcharParam("Descripcion", ejercicio.Description);
            operation.AddVarcharParam("Imagen", ejercicio.Picturelink);
            operation.AddIntegerParam("MaquinaID", ejercicio.Maquina.Id);
            //operation.AddOutputParam("@ReturnValue"); //Esta linea recibe la respuesta del SQL
            Console.WriteLine(operation);
            return operation;
        }

        public SqlOperation GetDeleteStatement(int id)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_deleteEjercicio";

            //Ejercicio ejercicio = (Ejercicio)entityDTO;

            operation.AddIntegerParam("Id", id);
            operation.AddOutputParam("@ReturnValue"); //Esta linea recibe la respuesta del SQL
            Console.WriteLine(operation);
            return operation;
        }

        public SqlOperation GetRetrieveAllStatement()
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "sp_getEjercicios"
            };
            return operation;
        }

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveByIdStatement(int Id)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetUpdateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_updateEjercicio";

            Ejercicio ejercicio = (Ejercicio)entityDTO;

            operation.AddIntegerParam("Id", ejercicio.Id);
            operation.AddVarcharParam("Nombre", ejercicio.Name);
            operation.AddVarcharParam("Descripcion", ejercicio.Description);
            operation.AddVarcharParam("Imagen", ejercicio.Picturelink);
            operation.AddIntegerParam("MaquinaID", ejercicio.Maquina.Id);
            operation.AddOutputParam("@ReturnValue"); //Esta linea recibe la respuesta del SQL
            Console.WriteLine(operation);
            return operation;
        }

        BaseClass IObjectMapper.BuildObject(Dictionary<string, object> objectRow)
        {
            throw new NotImplementedException();
        }
    }
}
