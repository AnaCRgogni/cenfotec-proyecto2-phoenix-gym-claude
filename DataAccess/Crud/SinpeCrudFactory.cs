using DataAccess.Dao;
using DataAccess.Mapper;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Crud
{
    public class SinpeCrudFactory : CrudFactory
    {
        private SinpeMapper mapper;

        public SinpeCrudFactory() : base()
        {
            mapper = new SinpeMapper();
            dao = SqlDao.GetInstance();
        }

        public override int Create(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }

        public override int Delete(int id)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAll<T>()
        {
            List<T> lstResults = new List<T>();
            List<Dictionary<string, object>> dataResults = dao.ExecuteStoredProcedureWithQuery(mapper.GetRetrieveAllStatement());

            if (dataResults.Count > 0)
            {
                var dtoObjects = mapper.BuildObjects(dataResults);

                foreach (var ob in dtoObjects)
                {
                    lstResults.Add((T)Convert.ChangeType(ob, typeof(T)));
                }
            }
            return lstResults;
        }


        /*public BaseClass RetrieveAllPagos(string cedula)
        {
            SqlOperation operation = mapper.GetRetrieveAllStatement(cedula);
            Dictionary<string, object> result = dao.ExecuteStoredProcedureWithUniqueResult(operation);
            return mapper.BuildObject(result);
        }*/
        public List<Sinpe> RetrieveAllPagos(string cedula)
        {
            
            List<Sinpe> sinpeList = new List<Sinpe>();
            List<Dictionary<string, object>> dataResults = dao.ExecuteStoredProcedureWithQuery(mapper.GetRetrieveAllPagos(cedula));
            
            if (dataResults.Count > 0)
            {
                var dtoObjects = mapper.BuildObjects(dataResults);

                foreach (var ob in dtoObjects)
                {
                    sinpeList.Add((Sinpe)Convert.ChangeType(ob, typeof(Sinpe)));
                }
            }
            return sinpeList;
        }


        public override List<T> RetrieveAllByRole<T>(string rolUsuario)
        {
            throw new NotImplementedException();
        }

        public Sinpe RetrieveById(string cedula)
        {
            SqlOperation operation = mapper.GetRetrieveByCedulaStatement(cedula);
            Dictionary<string, object> result = dao.ExecuteStoredProcedureWithUniqueResult(operation);
            return mapper.BuildObject(result);
        }




        public override BaseClass RetrieveByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public override BaseClass RetrieveById(int id)
        {
            throw new NotImplementedException();
        }

        public override int RetrieveMensualidadByCliente(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public override int Update(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveByCedula<T>(string cedula)
        {
            throw new NotImplementedException();
        }

        public override void DeleteCitaMedicion(string idEvo)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveByCalendarDescription<T>(string nombreEntrenadorDescripcion)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAllById<T>(int id)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveRutinasById<T>(string cedula)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveEntrenamientosById<T>(string cedula)
        {
            throw new NotImplementedException();
        }

        public override BaseClass RetrieveByIdEvo(string idEvo)
        {
            throw new NotImplementedException();
        }

        public override void DeleteHorarioEntrenadorPersonal(string idEvo)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveEntrenamientosCompartidosById<T>(string cedula, int id)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveEntrenamientosCompartidosByUserId<T>(string cedula)
        {
            throw new NotImplementedException();
        }
    }
}
