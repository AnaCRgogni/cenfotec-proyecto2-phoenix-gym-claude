using CloudinaryDotNet.Actions;
using DataAccess.Dao;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Mapper
{
    public class HorarioEntrenadorPersonalMapper : ICrudStatements, IObjectMapper
    {

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

        //No agregamos los atributos que marcamos como nullable en el DTO
        public BaseClass BuildObject(Dictionary<string, object> objectRow)
        {
            return new HorarioEntrenadorPersonal()
            {
                Id = int.Parse(objectRow["idHorario"].ToString()),
                IdEvo = objectRow["idEvo"].ToString(),
                Cedula = objectRow["cedula"].ToString(),
                Name = objectRow["name"].ToString(),
                Date = Convert.ToDateTime(objectRow["date"]),
                Type = objectRow["type"].ToString(),
                EveryYear = string.IsNullOrEmpty(objectRow["everyYear"].ToString()) ? (bool?)null : bool.Parse(objectRow["everyYear"].ToString()),
                Color = objectRow["color"].ToString(),
                Nombre = objectRow["nombre"].ToString(),
                Apellido1 = objectRow["apellido1"].ToString(),
                Apellido2 = objectRow["apellido2"].ToString(),
                Description = objectRow["description"].ToString(),
            };

        }

        public SqlOperation GetCreateStatement(BaseClass entityDTO)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_addHorarioEntrenador";

            HorarioEntrenadorPersonal horarioEntrenadorPersonal = (HorarioEntrenadorPersonal)entityDTO;
            operation.AddVarcharParam("idEvo", horarioEntrenadorPersonal.IdEvo);
            operation.AddVarcharParam("cedula", horarioEntrenadorPersonal.Cedula);
            operation.AddVarcharParam("name", horarioEntrenadorPersonal.Name);
            operation.AddDateTimeParam("date", horarioEntrenadorPersonal.Date);
            operation.AddVarcharParam("description", horarioEntrenadorPersonal.Description);

            return operation;

        }

        public SqlOperation GetDeleteCitaMedicionStatement(string idEvo)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_deleteCitaMedicionxCliente"
            };

            operation.AddVarcharParam("idEvo", idEvo);

            return operation;
        }

        public SqlOperation GetDeleteHorarioEntrenadorPersonalStatement(string idEvo)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_deleteHorarioEntrenadorPersonal"
            };

            operation.AddVarcharParam("idEvo", idEvo);

            return operation;
        }

        public SqlOperation GetRetrieveByIdEvoStatement(string idEvo)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getHorarioEntrenadorByIdEvo"
            };

            operation.AddVarcharParam("idEvo", idEvo);

            return operation;
        }

        public SqlOperation GetDeleteStatement(int id)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveAllStatement()
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getInfoMensualidadCliente2" // solo llama nombre, email y mensualidadCliente
            };

            return operation;
        }

        public SqlOperation GetRetrieveByCedulaStatement(string cedula)
        {
            SqlOperation operation = new SqlOperation()
            {
                ProcedureName = "dbo.sp_getHorarioEntrenador" 
            };

            operation.AddVarcharParam("cedula", cedula);

            return operation;
        }

        public SqlOperation GetRetrieveByIdStatement(int Id)
        {
            SqlOperation operation = new SqlOperation
            {
                ProcedureName = "dbo.sp_getPokemonCriolloById"
            };

            operation.AddIntegerParam("Id", Id);
            return operation;
        }

        public SqlOperation GetUpdateStatement(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }

        //Método para hacer consultas por diferentes criterios de filtro
        //Cada criterio que queramos evaluar, va a ser un search type y el valor el
        //search phrase
        public SqlOperation GetRetrieveByPhraseStatement(string searchType, string searchPhrase)
        {
            var operation = new SqlOperation()
            {
                ProcedureName = "PR_GET_ALL_ARTICLES_BY_PHRASE"
            };

            operation.AddVarcharParam("searchType", searchType);
            operation.AddVarcharParam("searchPhrase", searchPhrase);

            return operation;
        }

        public SqlOperation GetRetrieveByEmailStatement(string cedula)
        {
            throw new NotImplementedException();
        }

        public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }
        public SqlOperation GetUpdateCalendarEventStatement(HorarioEntrenadorPersonal horarioEntrenadorPersonal)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_UpdateHorarioEntrenadorxCliente";

            HorarioEntrenadorPersonal updatedHorarioEntrenador = (HorarioEntrenadorPersonal)horarioEntrenadorPersonal;

            operation.AddVarcharParam("idEvo", horarioEntrenadorPersonal.IdEvo);
            operation.AddVarcharParam("Color", horarioEntrenadorPersonal.Color); 
            operation.AddVarcharParam("Nombre", horarioEntrenadorPersonal.Nombre);
            operation.AddVarcharParam("Apellido1", horarioEntrenadorPersonal.Apellido1);
            operation.AddVarcharParam("Apellido2", horarioEntrenadorPersonal.Apellido2);
            operation.AddVarcharParam("Description", horarioEntrenadorPersonal.Description);

            return operation;
        }

        public SqlOperation GetUpdateCancelCalendarEventStatement(HorarioEntrenadorPersonal horarioEntrenadorPersonal)
        {
            SqlOperation operation = new SqlOperation();
            operation.ProcedureName = "dbo.sp_UpdateCancelHorarioEntrenadorxCliente";

            HorarioEntrenadorPersonal updatedHorarioEntrenador = (HorarioEntrenadorPersonal)horarioEntrenadorPersonal;

            operation.AddVarcharParam("idEvo", horarioEntrenadorPersonal.IdEvo);
            operation.AddVarcharParam("Color", horarioEntrenadorPersonal.Color);
            operation.AddVarcharParam("Nombre", horarioEntrenadorPersonal.Nombre);
            operation.AddVarcharParam("Apellido1", horarioEntrenadorPersonal.Apellido1);
            operation.AddVarcharParam("Apellido2", horarioEntrenadorPersonal.Apellido2);
            operation.AddVarcharParam("Description", horarioEntrenadorPersonal.Description);

            return operation;
        }
    }
}
