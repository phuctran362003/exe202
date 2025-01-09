using AutoMapper;
using EXE201_2RE_API.Constants;
using EXE201_2RE_API.Enums;
using EXE201_2RE_API.Repository;
using EXE201_2RE_API.Response;

namespace EXE201_2RE_API.Service
{
    public class TransactionService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TransactionService(UnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IServiceResult> GetAllByShop(Guid shopId)
        {
            try
            {
                var list = _unitOfWork.TransactionRepository.GetAllIncluding(t => t.user).Where(t => t.userId == shopId).ToList();
                var result = _mapper.Map<List<TransactionModel>>(list);
                return new ServiceResult(200, "Get all transaction", result);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> ChangeStatus(Guid transactionId, string status)
        {
            try
            {
                var transaction = _unitOfWork.TransactionRepository.GetById(transactionId);
                transaction.status = status;
                return new ServiceResult(200, "Change transaction status", transaction);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }
    }
}
