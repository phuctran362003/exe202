using EXE201_2RE_API.Domain.Helpers;
using Microsoft.EntityFrameworkCore;

namespace EXE201_2RE_API.Models
{
    public class EXE201Context : DbContext
    {
        public EXE201Context() { }
        public EXE201Context(DbContextOptions<EXE201Context> options) : base(options)
        {
        }

        #region DbSet

        public DbSet<TblCart> tblCarts { get; set; }
        public DbSet<TblProductImage> tblProductImages { get; set; }
        public DbSet<TblCartDetail> tblCartDetails { get; set; }
        public DbSet<TblCategory> tblCategories { get; set; }
        public DbSet<TblFavorite> tblFavorites { get; set; }
        public DbSet<TblGenderCategory> tblGenderCategories { get; set; }
        public DbSet<TblOrderHistory> tblOrderHistories { get; set; }
        public DbSet<TblProduct> tblProducts { get; set; }
        public DbSet<TblReview> tblReviews { get; set; }
        public DbSet<TblRole> tblRoles { get; set; }
        public DbSet<TblSize> tblSizes { get; set; }
        public DbSet<TblUser> tblUsers { get; set; }
        public DbSet<TblTransaction> tblTransactions { get; set; }
        #endregion

      /*  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("server=localhost;database=EXE201;uid=sa;pwd=12345;TrustServerCertificate=True;MultipleActiveResultSets=True");
        }*/

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<TblReview>()
                        .HasIndex(r => new { r.userId, r.shopId })
                        .IsUnique();

            modelBuilder.Entity<TblReview>()
                .HasOne(r => r.user)
                .WithMany(u => u.reviewsWritten)
                .HasForeignKey(r => r.userId)
                .OnDelete(DeleteBehavior.ClientSetNull); 

            modelBuilder.Entity<TblReview>()
                .HasOne(r => r.shop)
                .WithMany(u => u.reviewsReceivedAsShop)
                .HasForeignKey(r => r.shopId)
                .OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<TblRole>().HasData(
                new TblRole { roleId = new Guid("f47ac10b-58cc-4372-a567-0e02b2c3d479"), name = "User" },
                new TblRole { roleId = new Guid("c9ebf5d5-d6b4-4c1d-bc12-fc4b8f1f4c61"), name = "Admin" }
            );

           

            modelBuilder.Entity<TblCategory>().HasData(
                new TblCategory { categoryId = new Guid("f8a8e1c5-4b3c-4e8f-b8ea-3f3f6e9c2f1a"), name = "Áo Thun" },
                new TblCategory { categoryId = new Guid("a7b8c9d8-3e2a-4b9b-b9f7-5e6a7c8e9f0b"), name = "Quần Jeans" },
                new TblCategory { categoryId = new Guid("c5e1f2b8-2f4c-4b3d-b7a8-4c5e6f7d8b9a"), name = "Áo Khoác" },
                new TblCategory { categoryId = new Guid("e2b3d5a6-3e4f-5a6b-c8d9-2f2b3e5a7b8c"), name = "Váy" },
                new TblCategory { categoryId = new Guid("9AD582EE-2371-4045-9549-013E7A3EA1CF"), name = "Đồ Thể Thao" },
                new TblCategory { categoryId = new Guid("3419aa1b-7454-4a17-9c8f-e3f1c497f7ab"), name = "Khác" }
            );

            modelBuilder.Entity<TblGenderCategory>().HasData(
                new TblGenderCategory { genderCategoryId = new Guid("f47ac10b-58cc-4372-a567-0e02b2c3d479"), name = "Nam" },
                new TblGenderCategory { genderCategoryId = new Guid("c9ebf5d5-d6b4-4c1d-bc12-fc4b8f1f4c61"), name = "Nữ" },
                new TblGenderCategory { genderCategoryId = new Guid("6dd832ca-f7fe-4b77-9e4a-068ffd8db08e"), name = "Tất cả" }
            );

           

            modelBuilder.Entity<TblSize>().HasData(
                new TblSize { sizeId = new Guid("d4f1c0e1-2d41-4f0e-bc9f-4b85b6c5f4a2"), sizeName = "S" },
                new TblSize { sizeId = new Guid("e5a1b4d6-5c4c-4f0e-bc9f-4b85b6c5f4a3"), sizeName = "M" },
                new TblSize { sizeId = new Guid("f6b2e8a7-7d5f-4f0e-bc9f-4b85b6c5f4a4"), sizeName = "L" },
                new TblSize { sizeId = new Guid("a7c3f9b8-8e6f-4f0e-bc9f-4b85b6c5f4a5"), sizeName = "XL" },
                new TblSize { sizeId = new Guid("b1bc2089-742e-4cd2-b66e-21f7babf62df"), sizeName = "FREE" }
            );
          
            
        }
    }
}
