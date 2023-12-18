using Back.Models;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Back.DataAccess
{
    public interface IRepository<TEntity> where TEntity : class, new()
    {
        Task<IEnumerable<TEntity>> GetAsync(Expression<Func<TEntity, bool>> filter = null);
        Task<TEntity> GetSingleAsync(object maSV);
        Task InsertAsync(TEntity entity);
        public void Update(TEntity entity);
        Task DeleteAsync2(Expression<Func<TEntity, bool>> filter);
        Task DeleteAsync(object maSV);
        Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> filter);
        Task<IEnumerable<ChiTietLHP>> GetLopHocPhanMonHocInfoAsync();
        Task<IEnumerable<ChiTietLHP>> GetLopHocPhanMonHocInfoWithCountAsync();
        Task<IEnumerable<ChiTietLHP>> GetLopHocPhanDetailsAsync(string maLHP);
        Task<IEnumerable<ChiTietLHP>> GetKetQuaDetailsAsync(string maLHP);
        Task<LopHocPhan> GetSingleLopHocPhanByTimeAsync(string maGV, string thu, string gio);
        Task<UserForm> GetCredentialsAsync(string email, string password);
        Task<UserForm> GetUserByEmailAsync(string email);
        Task<bool> UpdateUserFormAsync(string email, Action<UserForm> updateAction);
        Task<IEnumerable<ChiTietLHP>> GetLopHocPhanByMaGVAsync(string maGV);
        Task<IEnumerable<ChiTietLHP>> GetKetQuaDetailsByStudentAsync(string maSV);
        Task<IEnumerable<ChiTietLHP>> GetLopHocPhanMonHocGiaoVienInfoAsync(Expression<Func<ChiTietLHP, bool>> filter = null);
        Task<bool> DeleteKetQuaByMaLHPAndMaSVAsync(string maLHP, string maSV);
        Task<bool> ExistsKetQuaByMaLHPAndMaSVAsync(string maLHP, string maSV);
        Task<bool> ExistsLopHocPhanBySVThuGioAsync(string maSV, string thu, string gio);
        Task<bool> ExistsLopHocPhanBySVMaMHAsync(string maSV, string maMH);
        Task ImportSinhVienDataAsync(List<SinhVien> sinhVienData);
    }
}
