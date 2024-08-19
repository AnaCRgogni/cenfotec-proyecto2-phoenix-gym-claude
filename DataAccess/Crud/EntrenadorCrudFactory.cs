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
    public class EntrenadorCrudFactory : CrudFactory
    {
        private EntrenadorMapper mapper;
        private RutinasMapper rutinasMapper;
        private EntrenamientoCompartidoMapper entrenamientosCompartidosMapper;

        public EntrenadorCrudFactory() : base()
        {
            mapper = new EntrenadorMapper();
            rutinasMapper = new RutinasMapper();
            entrenamientosCompartidosMapper = new EntrenamientoCompartidoMapper();
            dao = SqlDao.GetInstance();
        }

        public override int Update(BaseClass entityDTO)
        {
            throw new NotImplementedException();
        }
        public override int Create(BaseClass User)
        {
            SqlOperation operation = mapper.GetCreateStatement((BaseUserClass)User);
            return dao.ExecuteStoredProcedure(operation);
        }
        public override int Delete(int id)
        {
            throw new NotImplementedException();
        }
        public override List<T> RetrieveAllByRole<T>(string rolUsuario)
        { 
            List<T> lstResults = new List<T>();
        SqlOperation operation = mapper.GetRetrieveAllByRoleStatement(rolUsuario);
        //Usar withquery porque devuelve multiples filas
        List<Dictionary<string, object>> dataResults = dao.ExecuteStoredProcedureWithQuery(operation);

            if (dataResults.Count > 0)
            {
                //Build objects construye los objects dto a partir de los resultados de la base de datos
                var dtoObjects = mapper.BuildObjects(dataResults);

                //Se convierte cada objeto dto al tipo generico T y se agrega a la lista
                foreach (var ob in dtoObjects)
                {
                    lstResults.Add((T) Convert.ChangeType(ob, typeof(T)));
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

        public override List<T> RetrieveByCedula<T>(string cedula)
        {
            throw new NotImplementedException();
        }

        public override int RetrieveMensualidadByCliente(string cedula, string fecha)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAll<T>()
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAllById<T>(int id)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveRutinasById<T>(string cedula)
        {
            List<T> lstResults = new List<T>();
            SqlOperation operation = rutinasMapper.GetRutinasByUserId(cedula);
            //Usar withquery porque devuelve multiples filas
            List<Dictionary<string, object>> dataResults = dao.ExecuteStoredProcedureWithQuery(operation);

            if (dataResults.Count > 0)
            {
                //Build objects construye los objects dto a partir de los resultados de la base de datos
                var dtoObjects = rutinasMapper.BuildObjects(dataResults);

                //Se convierte cada objeto dto al tipo generico T y se agrega a la lista
                foreach (var ob in dtoObjects)
                {
                    lstResults.Add((T)Convert.ChangeType(ob, typeof(T)));
                }
            }

            return lstResults;
        }

        public override List<T> RetrieveEntrenamientosById<T>(string cedula)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveByCalendarDescription<T>(string nombreEntrenadorDescripcion)
        {
            throw new NotImplementedException();
        }

        public override void DeleteCitaMedicion(string idEvo)
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

        public override List<T> RetrieveEntrenamientosCompartidosByUserId<T>(string cedula)
        {
            List<T> lstResults = new List<T>();
            SqlOperation operation = entrenamientosCompartidosMapper.GetEntrenamientosCompartidosByUsertId(cedula);
            //Usar withquery porque devuelve multiples filas
            List<Dictionary<string, object>> dataResults = dao.ExecuteStoredProcedureWithQuery(operation);

            if (dataResults.Count > 0)
            {
                //Build objects construye los objects dto a partir de los resultados de la base de datos
                var dtoObjects = entrenamientosCompartidosMapper.BuildObjects(dataResults);

                //Se convierte cada objeto dto al tipo generico T y se agrega a la lista
                foreach (var ob in dtoObjects)
                {
                    lstResults.Add((T)(object)ob);
                }
            }

            return lstResults;
        }

        public override List<T> RetrieveEntrenamientosCompartidosById<T>(string cedula, int id)
        {
            throw new NotImplementedException();
        }
    }
}
