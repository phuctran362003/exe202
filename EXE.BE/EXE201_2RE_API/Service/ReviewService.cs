using AutoMapper;
using EXE201_2RE_API.Constants;
using EXE201_2RE_API.Models;
using EXE201_2RE_API.Repository;
using EXE201_2RE_API.Request;

namespace EXE201_2RE_API.Service
{
    public class ReviewService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ReviewService(UnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IServiceResult> Review(ReviewRequest req)
        {
            try
            {
                var user = await _unitOfWork.UserRepository.GetByIdAsync(req.userId.Value);

                if (user == null)
                {
                    return new ServiceResult(404, "User not found!");
                }

                var product = _unitOfWork.UserRepository.GetAll().Where(p => p.userId == req.shopId.Value && p.isShopOwner.Value).FirstOrDefault();

                if (product == null) 
                {
                    return new ServiceResult(404, "Shop not found!");
                }

                var review = new TblReview
                {
                    reviewId = Guid.NewGuid(),
                    shopId = req.shopId,
                    userId = req.userId,
                    comment = req.comment,
                    rating = req.rating,
                    createdAt = DateTime.Now,
                };

                var result = await _unitOfWork.ReviewRepository.CreateAsync(review);

                if (result > 0)
                {
                    return new ServiceResult(200, "Create review successfully", review);
                }

                return new ServiceResult(500, "Error while review!");
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }
    }
}
