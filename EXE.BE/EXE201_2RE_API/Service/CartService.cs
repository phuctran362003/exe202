using AutoMapper;
using Net.payOS.Types;
using AutoMapper.Internal;
using EXE201_2RE_API.Constants;
using EXE201_2RE_API.Enums;
using EXE201_2RE_API.Helpers;
using EXE201_2RE_API.Models;
using EXE201_2RE_API.Repository;
using EXE201_2RE_API.Response;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RestSharp;
using System.Drawing.Imaging;
using System.Security.Cryptography;
using System.Text;
using static EXE201_2RE_API.Response.GetListOrderFromShop;
using Net.payOS;
using Microsoft.IdentityModel.Tokens;

namespace EXE201_2RE_API.Service
{
    public class CartService
    {
        private readonly UnitOfWork _unitOfWork;

        private readonly IMapper _mapper;

        private string cancelUrl = "https://exe201-hedgfudpdahubgh9.southeastasia-01.azurewebsites.net/cart/return-url";
        private string returnUrl = "https://exe201-hedgfudpdahubgh9.southeastasia-01.azurewebsites.net/cart/return-url";
        private string clientId = "9e463c91-db86-4e48-a738-2dd12f936bf0";
        private string apiKey = "221468d5-9a17-48f5-8521-a510bca81ccd";   
        private string checksumKey = "e12e2458eb05d7dbea1609ea69387ee6b217946df08917a49ff1c49c1d56fe1b";

        public CartService(UnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IServiceResult> ChangeCartStatus(Guid cartId, string status)
        {
            try
            {
                var cart = await _unitOfWork.CartRepository.GetAllIncluding(c => c.tblCartDetails).Where(c => c.cartId == cartId).FirstOrDefaultAsync();

                int result = 0;

                if (status.Equals(SD.CartStatus.CANCEL))
                {
                    var cartDetailsToUpdate = new List<TblCartDetail>();

                    foreach (var cartDetail in cart.tblCartDetails)
                    {
                        var cartRemove = await _unitOfWork.CartDetailRepository.GetAllIncluding(c => c.product).Where(c => c.cartDetailId.Equals(cartDetail.cartDetailId)).FirstOrDefaultAsync();
                        cartDetailsToUpdate.Add(cartRemove);
                    }

                    foreach (var cartDetail in cartDetailsToUpdate)
                    {
                        var product = await _unitOfWork.ProductRepository.GetByIdAsync(cartDetail.productId.Value);
                        product.status = SD.ProductStatus.AVAILABLE;
                        await _unitOfWork.ProductRepository.UpdateAsync(product);
                    }

                    cart.status = SD.CartStatus.CANCEL;

                    result += await _unitOfWork.CartRepository.UpdateAsync(cart);
                }
                else if (status.Equals(SD.CartStatus.FINISHED))
                {
                    Guid shopId = Guid.Empty;
                    foreach (var cartDetail in cart.tblCartDetails)
                    {
                        var cartRemove = await _unitOfWork.CartDetailRepository.GetAllIncluding(c => c.product).Where(c => c.cartDetailId.Equals(cartDetail.cartDetailId)).FirstOrDefaultAsync();
                        
                        if (shopId != (Guid)cartRemove.product.shopOwnerId && shopId != Guid.Empty)
                        {
                            return new ServiceResult(500, "Update failed!");
                        }

                        shopId = (Guid)cartRemove.product.shopOwnerId;
                    }

                    int curMonth = DateTime.Now.Month;
                    int curYear = DateTime.Now.Year;

                    var shopTransaction = _unitOfWork.TransactionRepository.GetAll().Where(s => s.userId == shopId && s.month == cart.dateTime.Value.Month && s.year == cart.dateTime.Value.Year).FirstOrDefault();

                    if (shopTransaction == null)
                    {
                        var transaction = new TblTransaction
                        {
                            transactionId = Guid.NewGuid(),
                            userId = shopId,
                            totalMoney = cart.totalPrice,
                            month = curMonth,
                            year = curYear,
                            status = SD.TransactionStatus.PENDING
                        };

                        await _unitOfWork.TransactionRepository.CreateAsync(transaction);
                    }
                    else
                    {
                        shopTransaction.totalMoney += cart.totalPrice;
                        await _unitOfWork.TransactionRepository.UpdateAsync(shopTransaction);
                    }

                    cart.status = SD.CartStatus.FINISHED;

                    result += await _unitOfWork.CartRepository.UpdateAsync(cart);
                }

                if (result <= 0)
                {
                    return new ServiceResult(500, "Update failed!");
                }

                return new ServiceResult(200, "Update successfully!");
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> GetAllCart()
        {
            try
            {
                var productsOwnedByShopOwner = _unitOfWork.ProductRepository.GetAll()
                                                          .Select(_ => _.productId)
                                                          .ToList();

                var productInCartDetails = _unitOfWork.CartDetailRepository.GetAll()
                                                      .Where(_ => productsOwnedByShopOwner.Contains((Guid)_.productId))
                                                      .Select(_ => new { _.productId, _.cartId })
                                                      .ToList();

                var distinctCartIds = productInCartDetails
                                     .Select(_ => _.cartId)
                                     .Distinct()
                                     .ToList();
                var listCartFromShop = new List<CartShopModel>();
                foreach (var cartId in distinctCartIds)
                {
                    var cart = _unitOfWork.CartRepository.GetAllIncluding(_ => _.user).Where(_ => _.cartId == cartId).FirstOrDefault();
                    var totalProduct = _unitOfWork.CartDetailRepository.GetAll().Where(_ => _.cartId == cartId).Count();
                    listCartFromShop.Add(new CartShopModel
                    {
                        id = (Guid)cartId,
                        nameUser = cart.fullName,
                        totalPrice = (decimal)cart.totalPrice,
                        totalQuantity = totalProduct,
                        status = cart.status,
                        date = (DateTime)cart.dateTime,
                        paymentMethod = cart.paymentMethod
                    });
                }

                return new ServiceResult(200, "Success", listCartFromShop);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> GetCartsByUserId(Guid id)
        {
            try
            {
                var carts = _unitOfWork.CartRepository
                        .GetAllIncluding(
                            _ => _.user,
                            _ => _.tblCartDetails,
                            _ => _.tblOrderHistories
                        )
                        .Where(_ => _.userId == id).ToList();

                foreach (var cart in carts)
                {
                    foreach (var detail in cart.tblCartDetails)
                    {
                        detail.product = _unitOfWork.ProductRepository.GetAllIncluding(_ => _.size, _ => _.tblProductImages).Where(_ => _.productId == detail.productId).FirstOrDefault();
                    }
                }

                var cartResponses = new List<GetCartByUserIdResponse>();

                foreach (var cart in carts)
                {
                    var response = new GetCartByUserIdResponse
                    {
                        paymentMethod = cart.paymentMethod,
                        totalPrice = cart.totalPrice,
                        dateTime = cart.dateTime,
                        address = cart.address,
                        email = cart.email,
                        fullName = cart.fullName,
                        phone = cart.phone,
                        listProducts = new List<GetCartDetailResponse>(),
                        status = cart.status
                    };

                    foreach (var detail in cart.tblCartDetails)
                    {
                        var productResponse = new GetCartDetailResponse
                        {
                            productId = detail.productId,
                            price = detail.price,
                            name = detail.product?.name,
                            size = detail.product?.size?.sizeName,
                            imageUrl = detail.product?.tblProductImages.FirstOrDefault()?.imageUrl,
                        };

                        response.listProducts.Add(productResponse);
                    }

                    cartResponses.Add(response);
                }

                return new ServiceResult(200, "Carts retrieved successfully", cartResponses);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> Checkout(CheckoutRequest req)
        {
            try
            {
                //var user = _unitOfWork.UserRepository.FindByCondition(_ => _.email.ToLower().Equals(req.email.ToLower())).FirstOrDefault();
                var user = _unitOfWork.UserRepository.FindByCondition(_ => _.userId == req.userId).FirstOrDefault();

                if (user == null)
                {
                    return new ServiceResult(404, "Cannot find user");
                }

                Guid? firstShopId = null;

                var productsByShopOwner = new Dictionary<Guid?, List<TblProduct>>();
                foreach (var guid in req.products)
                {
                    var product = await _unitOfWork.ProductRepository.GetByIdAsync(guid);

                    if (product == null)
                    {
                        return new ServiceResult(404, "Cannot find product");
                    }

                    if (product.status.Equals(SD.ProductStatus.SOLDOUT))
                    {
                        return new ServiceResult(404, "Product is sold out!");
                    }

                    if (!productsByShopOwner.ContainsKey(product.shopOwnerId))
                    {
                        productsByShopOwner[product.shopOwnerId] = new List<TblProduct>();
                    }
                    productsByShopOwner[product.shopOwnerId].Add(product);
                }

                long uniqueId = 0;
                Guid id = Guid.NewGuid();
                byte[] guidBytes = id.ToByteArray();
                using (SHA256 sha256 = SHA256.Create())
                {
                    byte[] hash = sha256.ComputeHash(guidBytes);

                    uniqueId = Math.Abs(BitConverter.ToInt64(hash, 0) / 1000000000);
                }

                var createdCarts = new List<TblCart>();

                int result = 0;

                foreach (var kvp in productsByShopOwner)
                {
                    Guid? shopOwnerId = kvp.Key;
                    var products = kvp.Value;

                    decimal totalPrice = (decimal)products.Sum(p => p.price);

                    var cart = new TblCart
                    {
                        cartId = Guid.NewGuid(),
                        userId = user.userId,
                        fullName = req.fullName,
                        email = req.email,
                        address = req.address,
                        phone = req.phone,
                        dateTime = DateTime.Now,
                        status = SD.CartStatus.PENDING,
                        totalPrice = totalPrice,
                        paymentMethod = req.paymentMethod,
                        code = uniqueId.ToString(),
                    };

                    createdCarts.Add(cart);

                    var addRs = await _unitOfWork.CartRepository.CreateAsync(cart);

                    if (addRs <= 0)
                    {
                        return new ServiceResult(500, "Create cart failed!");
                    }

                    result += addRs;

                    foreach (var product in products)
                    {
                        var cartDetail = new TblCartDetail
                        {
                            cartDetailId = Guid.NewGuid(),
                            cartId = cart.cartId,
                            productId = product.productId,
                            price = product.price,
                        };

                        await _unitOfWork.CartDetailRepository.CreateAsync(cartDetail);
                    }
                }

                if (result > 0)
                {
                    PayOS payOS = new PayOS(clientId, apiKey, checksumKey);

                    List<ItemData> items = new List<ItemData>();

                    var listCartDetail = new List<TblCartDetail>();

                    var totalPrice = 0;

                    foreach (var item in req.products)
                    {
                        var product = await _unitOfWork.ProductRepository.GetByIdAsync(item); 

                        if (product == null)
                        {
                            return new ServiceResult(500, "Error when checkout!");
                        }
                        if (req.paymentMethod.Equals("COD"))
                        {
                            product.status = SD.ProductStatus.SOLDOUT;

                            await _unitOfWork.ProductRepository.UpdateAsync(product);
                        }

                        totalPrice += (int)product.price;

                        ItemData itemData = new ItemData(product.name, 1, (int)product.price);

                        items.Add(itemData);
                    }

                    if (req.paymentMethod.Equals("QRPAY"))
                    {
                        int billPrice = (totalPrice == 0) ? req.price : totalPrice;

                        PaymentData paymentData = new PaymentData(uniqueId, billPrice,
                            $"Thanh toán đơn {uniqueId}",
                            items, cancelUrl, returnUrl);

                        CreatePaymentResult createPayment = await payOS.createPaymentLink(paymentData);

                        return new ServiceResult(200, "Checkout success", createPayment);
                    }
                    else if (req.paymentMethod.Equals("COD"))
                    {
                        return new ServiceResult(200, "Checkout success");
                    }
                }

                if (result < 1)
                {
                    return new ServiceResult(500, "Error when checkout!");
                }

                return new ServiceResult(500, "Failed!");
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> UpdateCartStatus(long orderCode, string status)
        {
            try
            {
                var cartList = await _unitOfWork.CartRepository.GetAllIncluding(c => c.tblCartDetails).Where(c => c.code == orderCode.ToString()).ToListAsync();

                if (cartList.IsNullOrEmpty())
                {
                    return new ServiceResult(500, "Failed!");
                }

                int result = 0;

                if (status.Equals("PAID"))
                {
                    foreach (var cart in cartList)
                    {
                        var cartDetailsToUpdate = await _unitOfWork.CartDetailRepository
                            .GetAllIncluding(cd => cd.product)
                            .Where(cd => cd.cartId == cart.cartId)
                            .ToListAsync();

                        foreach (var cartDetail in cartDetailsToUpdate)
                        {
                            var product = await _unitOfWork.ProductRepository.GetByIdAsync(cartDetail.productId.Value);
                            if (product != null)
                            {
                                product.status = SD.ProductStatus.SOLDOUT;
                                await _unitOfWork.ProductRepository.UpdateAsync(product);
                            }
                        }

                        cart.status = SD.CartStatus.PAID;
                        result += await _unitOfWork.CartRepository.UpdateAsync(cart);
                    }
                }
                else if (status.Equals("CANCELLED"))
                {
                    foreach (var cart in cartList)
                    {
                        var cartDetailsToRemove = await _unitOfWork.CartDetailRepository
                            .GetAllIncluding(cd => cd.product) 
                            .Where(cd => cd.cartId == cart.cartId) 
                            .ToListAsync();

                        foreach (var cartDetail in cartDetailsToRemove)
                        {
                            await _unitOfWork.CartDetailRepository.RemoveAsync(cartDetail);
                        }

                        await _unitOfWork.CartRepository.RemoveAsync(cart);
                    }
                }

                if (result > 0)
                {
                    return new ServiceResult(200, "Paid success");
                }
            
                return new ServiceResult(200, "Cancel success");
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }
    }
}
