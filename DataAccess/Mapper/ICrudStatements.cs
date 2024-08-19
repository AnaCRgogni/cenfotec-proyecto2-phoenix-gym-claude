using DataAccess.Dao;
using DTO;

namespace DataAccess.Mapper
{
    public interface ICrudStatements
    {
        SqlOperation GetCreateStatement(BaseClass entityDTO);
        SqlOperation GetUpdateStatement(BaseClass entityDTO);
        SqlOperation GetDeleteStatement(int id);
        SqlOperation GetRetrieveAllStatement();
        SqlOperation GetRetrieveByIdStatement(int Id);
        SqlOperation GetRetrieveByCedulaStatement(string cedula);
        SqlOperation GetRetrieveMensualidad(string cedula, string fecha);
    }
}
