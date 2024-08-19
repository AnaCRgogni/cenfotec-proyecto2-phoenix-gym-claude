using DTO;
using DataAccess.Crud;
using DataAccess.Dao;

namespace BusinessLayer
{
    public class UserManager
    {
        public User GetUser(string cedula)
        {
            UserCrudFactory userCrud = new UserCrudFactory();
            return (User)userCrud.RetrieveById(cedula);
        }
        public List<User> GetAllUsers()
        {
            UserCrudFactory userCrud = new UserCrudFactory();
            return userCrud.RetrieveAll<User>();
        }
        public void UpdateUser(User user)
        {
            UserCrudFactory userCrud = new UserCrudFactory();
            userCrud.UpdateUser(user);
        }

    }
}
