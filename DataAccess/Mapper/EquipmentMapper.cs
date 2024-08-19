using DataAccess.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO;

namespace DataAccess.Mapper
{
    public class EquipmentMapper : ICrudStatements, IObjectMapper
    {
        

        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            var maquina = new Maquina()
            {
                Id = int.Parse(objectRow["Id"].ToString()),
                Name = objectRow["Name"].ToString(),
                Description = objectRow["Description"].ToString(),
                Picturelink = objectRow["Picturelink"].ToString()
            };
            return maquina;
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
            operation.ProcedureName = "dbo.sp_addMaquina";

            Maquina maquina = (Maquina)entityDTO;

            operation.AddIntegerParam("Id", maquina.Id);
            operation.AddVarcharParam("Name", maquina.Name);
            operation.AddVarcharParam("Description", maquina.Description);
            operation.AddVarcharParam("Picturelink", maquina.Picturelink);
            operation.AddOutputParam("@ReturnValue"); //Esta linea recibe la respuesta del SQL
            Console.WriteLine(operation);
            return operation;
        }

        public SqlOperation GetUpdateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_updateMaquina";

            Maquina maquina = (Maquina)entityDTO;

            operation.AddIntegerParam("Id", maquina.Id);
            operation.AddVarcharParam("Name", maquina.Name);
            operation.AddVarcharParam("Description", maquina.Description);
            operation.AddVarcharParam("Picturelink", maquina.Picturelink);
            operation.AddOutputParam("@ReturnValue"); //Esta linea recibe la respuesta del SQL
            Console.WriteLine(operation);
            return operation;
        }

        public SqlOperation GetDeleteStatement(int id)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_deleteMaquina";

            //Maquina maquina = (Maquina)entityDTO;

            operation.AddIntegerParam("Id", id);
            operation.AddOutputParam("@ReturnValue"); //Esta linea recibe la respuesta del SQL
            Console.WriteLine(operation);
            return operation;
        }

        public SqlOperation GetRetrieveAllStatement()
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "sp_getMaquinas"
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
    }
}
