using DataAccess.Dao;
using DataAccess.Mapper;
using DTO;

namespace DataAccess.Crud
{
    public class CitasMedicionCrudFactory : CrudFactory
    {
        private CitasMedicionMapper mapper;

        public CitasMedicionCrudFactory() : base()
        {
            mapper = new CitasMedicionMapper();
            dao = SqlDao.GetInstance();
        }

        public override int Update(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }

        public override int Create(BaseClass User)
        {
            SqlOperation operation = mapper.GetCreateStatement((BaseClass)User);
            return dao.ExecuteStoredProcedure(operation);
        }

        public override void DeleteCitaMedicion(string idEvo)
        {
            SqlOperation operation = mapper.GetDeleteCitaMedicionStatement(idEvo);
            dao.ExecuteStoredProcedure(operation);
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

        public override List<T> RetrieveByCedula<T>(string cedula)
        {
            List<T> lstResults = new List<T>();
            SqlOperation operation = mapper.GetRetrieveByCedulaStatement(cedula);
            //Usar withquery porque devuelve multiples filas
            List<Dictionary<string, object>> dataResults = dao.ExecuteStoredProcedureWithQuery(operation);

            if (dataResults.Count > 0)
            {
                //Build objects construye los objects dto a partir de los resultados de la base de datos
                var dtoObjects = mapper.BuildObjects(dataResults);

                //Se convierte cada objeto dto al tipo generico T y se agrega a la lista
                foreach (var ob in dtoObjects)
                {
                    lstResults.Add((T)Convert.ChangeType(ob, typeof(T)));
                }
            }

            return lstResults;
        }

        public override List<T> RetrieveByCalendarDescription<T>(string description)
        {
            List<T> lstResults = new List<T>();
            SqlOperation operation = mapper.GetRetrieveByCalendarDescriptionStatement(description);
            //Usar withquery porque devuelve multiples filas
            List<Dictionary<string, object>> dataResults = dao.ExecuteStoredProcedureWithQuery(operation);

            if (dataResults.Count > 0)
            {
                //Build objects construye los objects dto a partir de los resultados de la base de datos
                var dtoObjects = mapper.BuildObjects(dataResults);

                //Se convierte cada objeto dto al tipo generico T y se agrega a la lista
                foreach (var ob in dtoObjects)
                {
                    lstResults.Add((T)Convert.ChangeType(ob, typeof(T)));
                }
            }

            return lstResults;
        }

        public override BaseClass RetrieveById(int id)
        {
            SqlOperation operation = mapper.GetRetrieveByIdStatement(id);
            Dictionary<string, object> result = dao.ExecuteStoredProcedureWithUniqueResult(operation);
            return mapper.BuildObject(result);
        }

        public override BaseClass RetrieveByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public override int RetrieveMensualidadByCliente(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAllByRole<T>(string rolUsuario)
        {
            throw new NotImplementedException();
        }

        public override int Delete(int id)
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
            SqlOperation operation = mapper.GetRetrieveByIdEvoStatement(idEvo);
            Dictionary<string, object> result = dao.ExecuteStoredProcedureWithUniqueResult(operation);
            return mapper.BuildObject(result);
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