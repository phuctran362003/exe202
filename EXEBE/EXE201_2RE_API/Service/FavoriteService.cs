using AutoMapper;
using EXE201_2RE_API.Constants;
using EXE201_2RE_API.Models;
using EXE201_2RE_API.Repository;
using EXE201_2RE_API.Response;
using System.Runtime.CompilerServices;

namespace EXE201_2RE_API.Service
{
    public class FavoriteService
    {
        private readonly UnitOfWork _unitOfWork;

        private readonly IMapper _mapper;

        public FavoriteService(UnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IServiceResult> GetFavoriteProductsByUserId (Guid userId)
        {
            try
            {
                var result = _unitOfWork.FavoriteRepository
                    .FindByCondition(_ => _.userId == userId)
                    .Select(favorite => favorite.productId)
                    .ToList();

                return new ServiceResult(200, "Favorite products by user", result);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> AddFavoriteProduct(Guid userId, Guid productId)
        {
            try
            {
                var checkExisted = _unitOfWork.FavoriteRepository.FindByCondition(_ => _.productId == productId && _.userId == userId).FirstOrDefault();
                
                if (checkExisted != null)
                {
                    var delete = await _unitOfWork.FavoriteRepository.RemoveAsync(checkExisted);
                    if (delete)
                    {
                        return new ServiceResult(500, "Remove favorite!", new FavoriteProductResponse { message = "Remove favorite!", type = "Delete"});
                    }
                    else
                    {
                        return new ServiceResult(500, "Error while removing object");
                    }
                }

                var favorite = new TblFavorite 
                { 
                    favoriteId = Guid.NewGuid(),
                    userId = userId, 
                    productId = productId 
                };

                var result = await _unitOfWork.FavoriteRepository.CreateAsync(favorite);
                if (result < 1)
                {
                    return new ServiceResult(500, "Error while creating object");
                }

                return new ServiceResult(200, "Create favorite!", new FavoriteProductResponse { message = "Create favorite!", type = "Add" });
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }
    }
}
