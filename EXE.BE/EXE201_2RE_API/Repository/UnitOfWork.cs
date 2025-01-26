using EXE201_2RE_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EXE201_2RE_API.Repository
{
    public class UnitOfWork
    {
        public EXE201Context _unitOfWorkContext;
        private UserRepository _user;
        private CartDetailRepository _cartDetail;
        private CartRepository _cart;
        private CategoryRepository _category;
        private GenderCategoryRepository _genderCategory;
        private OrderHistoryRepository _orderHistory;
        private ProductRepository _product;
        private ReviewRepository _review;
        private RoleRepository _role;
        private SizeRepository _size;
        private FavoriteRepository _favorite;
        private ProductImageRepository _productImage;
        private TransactionRepository _transaction;

        public UnitOfWork()
        {
            _unitOfWorkContext ??= new EXE201Context();
        }
        public UnitOfWork(EXE201Context unitOfWorkContext)
        {
            _unitOfWorkContext ??= unitOfWorkContext;
        }
        public TransactionRepository TransactionRepository
        {
            get
            {
                return _transaction ??= new TransactionRepository(_unitOfWorkContext);
            }
        }        
        
        public CategoryRepository CategoryRepository
        {
            get
            {
                return _category ??= new CategoryRepository(_unitOfWorkContext);
            }
        }

        public ProductImageRepository ProductImageRepository
        {
            get
            {
                return _productImage ??= new ProductImageRepository(_unitOfWorkContext);
            }
        }
        public UserRepository UserRepository
        {
            get
            {
                return _user ??= new UserRepository(_unitOfWorkContext);
            }
        }

        public FavoriteRepository FavoriteRepository
        {
            get
            {
                return _favorite ??= new FavoriteRepository(_unitOfWorkContext);
            }
        }

        public CartDetailRepository CartDetailRepository
        {
            get
            {
                return _cartDetail ??= new CartDetailRepository(_unitOfWorkContext);
            }
        }

        public CartRepository CartRepository
        {
            get
            {
                return _cart ??= new CartRepository(_unitOfWorkContext);
            }
        }

        public GenderCategoryRepository GenderCategoryRepository
        {
            get
            {
                return _genderCategory ??= new GenderCategoryRepository(_unitOfWorkContext);
            }
        }
        public OrderHistoryRepository OrderHistoryRepository
        {
            get
            {
                return _orderHistory ??= new OrderHistoryRepository(_unitOfWorkContext);
            }
        }

        public ProductRepository ProductRepository
        {
            get
            {
                return _product ??= new ProductRepository(_unitOfWorkContext);
            }
        }

        public ReviewRepository ReviewRepository
        {
            get
            {
                return _review ??= new ReviewRepository(_unitOfWorkContext);
            }
        }

        public RoleRepository RoleRepository
        {
            get
            {
                return _role ??= new RoleRepository(_unitOfWorkContext);
            }
        }

        public SizeRepository SizeRepository
        {
            get
            {
                return _size ??= new SizeRepository(_unitOfWorkContext);
            }
        }

        ////TO-DO CODE HERE/////////////////

        #region Set transaction isolation levels

        /*
        Read Uncommitted: The lowest level of isolation, allows transactions to read uncommitted data from other transactions. This can lead to dirty reads and other issues.

        Read Committed: Transactions can only read data that has been committed by other transactions. This level avoids dirty reads but can still experience other isolation problems.

        Repeatable Read: Transactions can only read data that was committed before their execution, and all reads are repeatable. This prevents dirty reads and non-repeatable reads, but may still experience phantom reads.

        Serializable: The highest level of isolation, ensuring that transactions are completely isolated from one another. This can lead to increased lock contention, potentially hurting performance.

        Snapshot: This isolation level uses row versioning to avoid locks, providing consistency without impeding concurrency. 
         */

        public int SaveChangesWithTransaction()
        {
            int result = -1;

            //System.Data.IsolationLevel.Snapshot
            using (var dbContextTransaction = _unitOfWorkContext.Database.BeginTransaction())
            {
                try
                {
                    result = _unitOfWorkContext.SaveChanges();
                    dbContextTransaction.Commit();
                }
                catch (Exception)
                {
                    //Log Exception Handling message                      
                    result = -1;
                    dbContextTransaction.Rollback();
                }
            }

            return result;
        }

        public async Task<int> SaveChangesWithTransactionAsync()
        {
            int result = -1;

            //System.Data.IsolationLevel.Snapshot
            using (var dbContextTransaction = _unitOfWorkContext.Database.BeginTransaction())
            {
                try
                {
                    result = await _unitOfWorkContext.SaveChangesAsync();
                    dbContextTransaction.Commit();
                }
                catch (Exception)
                {
                    //Log Exception Handling message                      
                    result = -1;
                    dbContextTransaction.Rollback();
                }
            }

            return result;
        }
        #endregion

    }
}
