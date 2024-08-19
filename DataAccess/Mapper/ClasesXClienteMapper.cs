using DataAccess.Dao;
using DTO;

namespace DataAccess.Mapper
{


  public class ClasesXClienteMapper : ICrudStatements, IObjectMapper
  {


    //No agregamos los atributos que marcamos como nullable en el DTO
    public BaseClass BuildObject(Dictionary<string, object> objectRow)
    {
      return new ClasesXCliente()
      {
        Id = int.Parse(objectRow["idInscripcion"].ToString()),
        IdClase = int.Parse(objectRow["idClase"].ToString()),
        IdCliente = objectRow["idTUsuario"].ToString(),
      };
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
      operation.ProcedureName = "dbo.sp_addClaseXCliente";

      Inscripcion inscripcion = (Inscripcion)entityDTO;

      operation.AddIntegerParam("idClase", inscripcion.IdClase);
      operation.AddVarcharParam("idCliente", inscripcion.IdCliente);

      return operation;
    }


    public BaseClass BuildGetObject(Dictionary<string, object> objectRow)
    {
      return new ClasesXCliente()
      {
        IdClase = int.Parse(objectRow["idClase"].ToString()),
        NombreClase = objectRow["nombreClase"].ToString(),
        FechaClase = Convert.ToDateTime(objectRow["fechaClase"]),
        Cupos = int.Parse(objectRow["cupos"].ToString()),
        IdCliente = objectRow["idCliente"].ToString(),
        IdMembresia = int.Parse(objectRow["idMembresia"].ToString()),
        Estado = Convert.ToInt32(objectRow["estado"])
      };
    }

    public List<BaseClass> BuildGetObjects(List<Dictionary<string, object>> objectRows)
    {
      var lstResult = new List<BaseClass>();

      foreach (var objRow in objectRows)
      {
        var article = BuildGetObject(objRow);
        lstResult.Add(article);
      }
      return lstResult;
    }


    public SqlOperation GetDeleteStatement(int id)
    {
      throw new NotImplementedException();
    }

    public SqlOperation GetRetrieveAllStatement()
    {
      throw new NotImplementedException();
    }

    public SqlOperation GetRetrieveClasesXClienteStatement(string cedula)
    {
      SqlOperation operation = new SqlOperation()
      {
        ProcedureName = "dbo.sp_getClasesXCliente" // une tablas ClaseXCliente, Usuario, Clase
      };

      operation.AddVarcharParam("cedula", cedula);

      return operation;
    }


    public SqlOperation GetRetrieveByCedulaStatement(string cedula)
    {
      throw new NotImplementedException();
    }

    public SqlOperation GetRetrieveByEmailStatement(string cedula)
    {
      throw new NotImplementedException();
    }

    public SqlOperation GetRetrieveByIdStatement(int Id)
    {
      throw new NotImplementedException();
    }

    public SqlOperation GetUpdateStatement(BaseClass entityDTO)
    {
      throw new NotImplementedException();
    }

    public SqlOperation GetRetrieveMensualidad(string cedula, string fecha)
    {
      throw new NotImplementedException();
    }

  }
}