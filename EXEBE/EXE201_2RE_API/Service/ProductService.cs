using AutoMapper;
using EXE201_2RE_API.Constants;
using EXE201_2RE_API.DTOs;
using EXE201_2RE_API.Enums;
using EXE201_2RE_API.Helpers;
using EXE201_2RE_API.Models;
using EXE201_2RE_API.Repository;
using EXE201_2RE_API.Request;
using EXE201_2RE_API.Response;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Xml.Linq;
using static EXE201_2RE_API.Response.GetListOrderFromShop;

namespace EXE201_2RE_API.Service
{
    public class ProductService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public readonly IFirebaseService _firebaseService;


        public ProductService(UnitOfWork unitOfWork, IMapper mapper, IFirebaseService firebaseService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _firebaseService = firebaseService;
        }

        public async Task<IServiceResult> GetAllBrand()
        {
            try
            {
                var products = await _unitOfWork.ProductRepository.GetAllAsync();
                var brands = products.Select(p => p.brand).Distinct().ToList();

                return new ServiceResult(200, "Get all brands", brands);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> GetAllCategory()
        {
            try
            {
                var categories = await _unitOfWork.CategoryRepository.GetAllAsync();

                return new ServiceResult(200, "Get all categories", categories);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> ChangeProductStatus(Guid productId, string status)
        {
            try
            {
                var product = await _unitOfWork.ProductRepository.GetByIdAsync(productId);

                product.status = status;

                var result = await _unitOfWork.ProductRepository.UpdateAsync(product);

                return new ServiceResult(200, "Update cart status", product);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> UpdateProduct(Guid productId, UpdateProductRequest createProductModel)
        {
            try
            {
                var result = 0;
                var newProduct = await _unitOfWork.ProductRepository.GetAllIncluding(_ => _.shopOwner, _ => _.category, _ => _.genderCategory, _ => _.size, _ => _.tblProductImages)
                                                   .Where(p => p.productId == productId).FirstOrDefaultAsync();

                var category = await _unitOfWork.CategoryRepository.GetByIdAsync(createProductModel.categoryId.Value);

                if (category == null)
                {
                    return new ServiceResult(404, "Category not found!", null);
                }                
                
                var genderCategory = await _unitOfWork.GenderCategoryRepository.GetByIdAsync(createProductModel.genderCategoryId.Value);

                if (genderCategory == null)
                {
                    return new ServiceResult(404, "Gender category not found!", null);
                }                
                
                var size = await _unitOfWork.SizeRepository.GetByIdAsync(createProductModel.sizeId.Value);

                if (size == null)
                {
                    return new ServiceResult(404, "Size not found!", null);
                }

                if (newProduct != null)
                {
                    newProduct.categoryId = createProductModel.categoryId;
                    newProduct.genderCategoryId = createProductModel.genderCategoryId;
                    newProduct.sizeId = createProductModel.sizeId;
                    newProduct.description = createProductModel.description;
                    newProduct.name = createProductModel.name;
                    newProduct.brand = createProductModel.brand;
                    newProduct.condition = createProductModel.condition;
                    newProduct.price = createProductModel.price;
                    newProduct.sale = createProductModel.sale;
                    newProduct.updatedAt = DateTime.Now;

                    var listImg = await _unitOfWork.ProductImageRepository.FindByConditionAsync(i => i.productId == productId);
                    var images = listImg.ToList();

                    var urlsToKeep = createProductModel.oldImg ?? new List<string>();

                    for (int i = images.Count - 1; i >= 0; i--)
                    {
                        if (!urlsToKeep.Contains(images[i].imageUrl))
                        {
                            var existingImage = await _unitOfWork.ProductImageRepository.GetByIdAsync(images[i].productImageId);
                            if (existingImage != null)
                            {
                                _unitOfWork.ProductImageRepository.Detach(existingImage); // Detach the existing tracked entity
                            }
                            await _unitOfWork.ProductImageRepository.RemoveAsync(images[i]);
                        }
                    }

                    if (createProductModel.listImgUrl != null && createProductModel.listImgUrl.Any())
                    {
                        var imageUploadResults = new List<string>();
                        var productImages = new List<TblProductImage>();

                        foreach (var imgUrl in createProductModel.listImgUrl)
                        {
                            var productImage = new TblProductImage
                            {
                                productImageId = Guid.NewGuid(),
                                productId = newProduct.productId
                            };

                            var imagePath = FirebasePathName.PRODUCT + $"{productImage.productImageId}";
                            var imageUploadResult = await _firebaseService.UploadFileToFirebase(imgUrl, imagePath);

                            if (!imageUploadResult.isSuccess)
                            {
                                return new ServiceResult(500, "Failed to upload one or more images", null);
                            }

                            var uploadedImgUrl = (string)imageUploadResult.result;
                            imageUploadResults.Add(uploadedImgUrl);

                            productImage.imageUrl = uploadedImgUrl;

                            productImages.Add(productImage);
                        }
                        result += await _unitOfWork.ProductImageRepository.CreateRangeAsync(productImages);
                    }

                    result += await _unitOfWork.ProductRepository.UpdateAsync(newProduct);
                }
                else
                {
                    return new ServiceResult(404, "Product not found", null);
                }

                var realRs = _mapper.Map<GetProductDetailResponse>(newProduct);

                if (result > 0)
                {
                    return new ServiceResult(200, "Update product", realRs);
                }
                else
                {
                    return new ServiceResult(500, "Failed to Update product", null);
                }
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> GetAllProducts()
        {
            try
            {
                var productEntities = await _unitOfWork.ProductRepository.GetAllIncluding(_ => _.shopOwner, _ => _.category, _ => _.genderCategory, _ => _.size, _ => _.tblProductImages)
                                                                   .Where(p => p.status.Equals(SD.ProductStatus.AVAILABLE)).ToListAsync();
                var products = _mapper.Map<List<GetListProductResponse>>(productEntities);
                return new ServiceResult(200, "Get all products", products);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }
        public async Task<IServiceResult> GetProductByShopOwner(Guid shopId)
        {
            try
            {
                var productsOwnedByShopOwner = _unitOfWork.ProductRepository.GetAll()
                                                          .Where(_ => _.shopOwnerId == shopId)
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
                    var cart =  _unitOfWork.CartRepository.GetAllIncluding(_ => _.user).Where(_ => _.cartId == cartId).FirstOrDefault();
                    var totalProduct = _unitOfWork.CartDetailRepository.GetAll().Where(_ => _.cartId == cartId).Count();
                    listCartFromShop.Add( new CartShopModel
                    {
                        id = (Guid)cartId,
                        nameUser = cart.fullName,
                        totalPrice = (decimal)cart.totalPrice,
                        code = cart.code,
                        totalQuantity = totalProduct,
                        status = cart.status,
                        date = (DateTime)cart.dateTime,
                        paymentMethod = cart.paymentMethod
                    });
                }

                return new ServiceResult(200, "Success", listCartFromShop);
            }
            catch(Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }
        public async Task<IServiceResult> GetAllProductFromShop(Guid shopId)
        {
            try
            {
                var productsOwnedByShopOwner = _unitOfWork.ProductRepository.GetAllIncluding(_ => _.category, _ => _.genderCategory, _ => _.size, _ => _.tblProductImages, _ => _.shopOwner)
                                                              .Where(_ => _.shopOwnerId == shopId)
                                                              .Select(_ => new GetListProductResponse
                                                              {
                                                                  productId = _.productId,
                                                                  shopOwner = _.shopOwner.shopName,
                                                                  category = _.category.name,
                                                                  genderCategory = _.genderCategory.name,
                                                                  size = _.size.sizeName,
                                                                  name = _.name,
                                                                  price = (decimal)_.price,
                                                                  sale = (decimal)_.sale,
                                                                  imgUrl = _.tblProductImages.Select(_ => _.imageUrl).FirstOrDefault(),
                                                                  brand = _.brand,
                                                                  condition = _.condition,
                                                                  status = _.status
                                                              })
                                                              .ToList();
                return new ServiceResult(200, "Success", productsOwnedByShopOwner);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);

            }

        }

        public async Task<IServiceResult> GetShopDetail(Guid id)
        {
            try
            {
                var shop = await _unitOfWork.UserRepository
                             .GetAllIncluding(_ => _.reviewsReceivedAsShop, _ => _.reviewsWritten)
                             .Where(_ => _.isShopOwner == true && _.userId == id)
                             .FirstOrDefaultAsync();

                if (shop == null)
                {
                    return new ServiceResult(404, "Shop not found");
                }

                foreach (var review in shop.reviewsReceivedAsShop)
                {
                    review.user = await _unitOfWork.UserRepository.GetByIdAsync(review.userId.Value);
                }

                var totalRating = shop.reviewsReceivedAsShop.Sum(_ => _.rating ?? 0);
                var quantityRating = shop.reviewsReceivedAsShop.Count();

                var result = new GetShopDetailResponse
                {
                    userName = shop.userName,
                    email = shop.email,
                    phoneNumber = shop.phoneNumber,
                    address = shop.address,
                    shopBankId = shop.shopBankId,
                    shopBank = shop.shopBank,
                    shopName = shop.shopName,
                    shopLogo = shop.shopLogo,
                    shopDescription = shop.shopDescription,
                    shopAddress = shop.shopAddress,
                    shopPhone = shop.phoneNumber,
                    totalRating = totalRating,
                    quantityRating = quantityRating,
                    reviews = _mapper.Map<List<ReviewsList>>(shop.reviewsReceivedAsShop)
                };

                return new ServiceResult(200, "Get Shop Detail", result);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }
        public async Task<IServiceResult> GetAllShop()
        {
            try
            {
                var shops = await _unitOfWork.UserRepository
                                             .GetAllIncluding(_ => _.reviewsReceivedAsShop, _ => _.reviewsWritten)
                                             .Where(_ => _.isShopOwner == true)
                                             .ToListAsync();

                var listShops = new List<GetListShopResponse>();

                foreach (var shop in shops)
                {
                    var totalRating = shop.reviewsReceivedAsShop.Sum(_ => _.rating ?? 0);
                    var quantityRating = shop.reviewsReceivedAsShop.Count();

                    listShops.Add(new GetListShopResponse
                    {
                        shopId = shop.userId ?? Guid.Empty,
                        shopName = shop.shopName,
                        shopLogo = shop.shopLogo,
                        totalRating = totalRating,
                        quantityRating = quantityRating
                    });
                }
                return new ServiceResult(200, "Success", listShops);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);

            }

        }
        public async Task<IServiceResult> OrderDetailFromShop(Guid cartId)
        {
            try
            {
                var cartDetails = await _unitOfWork.CartDetailRepository
                                                   .GetAllIncluding(_ => _.product, _ => _.product.tblProductImages)
                                                   .Where(_ => _.cartId == cartId)
                                                   .ToListAsync();

                var listShop = await _unitOfWork.UserRepository.GetAllAsync();

                var listProductsInCart = new List<OrderDetailResponse>();

                foreach (var detail in cartDetails)
                {
                    if (detail.product != null)
                    {
                        foreach (var shop in listShop)
                        {
                            if (detail.product.shopOwnerId == shop.userId)
                            {
                                detail.product.shopOwner = shop;
                            }
                        }

                        listProductsInCart.Add(new OrderDetailResponse
                        {
                            productId = detail.product.productId,
                            productName = detail.product.name,
                            price = detail.price ?? 0, 
                            imageUrl = detail.product.tblProductImages.Select(_ => _.imageUrl).FirstOrDefault(),
                            shopName = detail.product.shopOwner.shopName
                        });
                    }
                }

                return new ServiceResult(200, "Success", listProductsInCart);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);

            }

        }
        public async Task<IServiceResult> GetProductById(Guid id)
        {
            try
            {
                var productEntities = await _unitOfWork.ProductRepository.GetAllIncluding(_ => _.shopOwner, _ => _.category, _ => _.genderCategory, _ => _.size, _ => _.tblProductImages).Where(_ => _.productId == id).FirstOrDefaultAsync();
                var product = _mapper.Map<GetProductDetailResponse>(productEntities);
                return new ServiceResult(200, "Get product by id", product);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> GetListProductByListId(List<Guid> ids)
        {
            try
            {
                var products = await _unitOfWork.ProductRepository
                    .GetAllIncluding(_ => _.shopOwner, _ => _.category, _ => _.genderCategory, _ => _.size, _ => _.tblProductImages)
                    .Where(p => ids.Contains(p.productId))
                    .ToListAsync();

                if (products == null || !products.Any())
                {
                    return new ServiceResult(404, "No products found for the provided IDs", null);
                }

                var productModel = _mapper.Map<List<GetListProductResponse>>(products);

                return new ServiceResult(200, "Get product by IDs", productModel);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> GetNewestProducts()
        {
            try
            {
                var products = _unitOfWork.ProductRepository
                    .GetAllIncluding(_ => _.shopOwner, _ => _.category, _ => _.genderCategory, _ => _.size, _ => _.tblProductImages)
                    .Where(p => p.status.Equals(SD.ProductStatus.AVAILABLE))
                    .OrderByDescending(p => p.createdAt)
                    .Select(_ => new GetListProductResponse
                    {
                        productId = _.productId,
                        shopOwner = _.shopOwner.userName,
                        category = _.category.name,
                        genderCategory = _.genderCategory.name,
                        size = _.size.sizeName,
                        name = _.name,
                        price = (decimal)_.price,
                        sale = (decimal)_.sale,
                        imgUrl = _.tblProductImages.Select(_ => _.imageUrl).FirstOrDefault(),
                        brand = _.brand,
                        condition = _.condition,
                        status = _.status
                    })
                    .Take(6)
                    .ToList();

                var productModel = _mapper.Map<List<GetListProductResponse>>(products);

                return new ServiceResult(200, "Get newest product", productModel);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> GetRelatedProducts(Guid id)
        {
            try
            {
                var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);
                if (product == null)
                {
                    return new ServiceResult(404, "Product not found", null);
                }

                var products = _unitOfWork.ProductRepository
                    .GetAllIncluding(_ => _.shopOwner, _ => _.category, _ => _.genderCategory, _ => _.size, _ => _.tblProductImages)
                    .Where(p => p.categoryId == product.categoryId &&
                                 p.genderCategoryId == product.genderCategoryId &&
                                 p.productId != product.productId && p.status.Equals(SD.ProductStatus.AVAILABLE))
                    .ToList();

                var randomProducts = new List<TblProduct>();

                if (products.Count > 0)
                {
                    Random random = new Random();
                    int numberToTake = Math.Min(5, products.Count); 

                    var selectedIndices = new HashSet<int>();
                    while (selectedIndices.Count < numberToTake)
                    {
                        selectedIndices.Add(random.Next(products.Count));
                    }

                    foreach (var index in selectedIndices)
                    {
                        randomProducts.Add(products[index]);
                    }
                }

                var productModel = _mapper.Map<List<GetListProductResponse>>(randomProducts);

                return new ServiceResult(200, "Get related product", productModel);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> CreateProduct(CreateProductModel createProductModel)
        {
            try
            {
                var result = 0;
                var newProduct = new TblProduct();

                if (createProductModel.listImgUrl != null && createProductModel.listImgUrl.Any())
                {
                    newProduct = new TblProduct
                    {
                        productId = Guid.NewGuid(),
                        categoryId = createProductModel.categoryId,
                        genderCategoryId = createProductModel.genderCategoryId,
                        shopOwnerId = createProductModel.shopOwnerId,
                        sizeId = createProductModel.sizeId,
                        description = createProductModel.description,
                        name = createProductModel.name,
                        brand = createProductModel.brand,
                        condition = createProductModel.condition,
                        price = createProductModel.price,
                        sale = createProductModel.sale,
                        createdAt = DateTime.Now,
                        status = SD.ProductStatus.AVAILABLE,
                    };

                    var imageUploadResults = new List<string>();
                    var productImages = new List<TblProductImage>();

                    foreach (var imgUrl in createProductModel.listImgUrl)
                    {
                        var productImage = new TblProductImage
                        {
                            productImageId = Guid.NewGuid(),
                            productId = newProduct.productId
                        };

                        var imagePath = FirebasePathName.PRODUCT + $"{productImage.productImageId}";
                        var imageUploadResult = await _firebaseService.UploadFileToFirebase(imgUrl, imagePath);

                        if (!imageUploadResult.isSuccess)
                        {
                            return new ServiceResult(500, "Failed to upload one or more images", null);
                        }

                        var uploadedImgUrl = (string)imageUploadResult.result;
                        imageUploadResults.Add(uploadedImgUrl);

                        productImage.imageUrl = uploadedImgUrl;

                        productImages.Add(productImage);
                    }

                    result = await _unitOfWork.ProductRepository.CreateAsync(newProduct);
                    result += await _unitOfWork.ProductImageRepository.CreateRangeAsync(productImages);
                }
                else
                {
                    return new ServiceResult(400, "Product image is required", null);
                }

                if (result > 0)
                {
                    return new ServiceResult(200, "Product created successfully");
                }
                else
                {
                    return new ServiceResult(500, "Failed to create product", null);
                }
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> GetAllSize()
        {
            try
            {
                var result = await _unitOfWork.SizeRepository.GetAllAsync();

                return new ServiceResult(200, "Get all size", result);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }

        public async Task<IServiceResult> GetAllGenderCategory()
        {
            try
            {
                var result = await _unitOfWork.GenderCategoryRepository.GetAllAsync();

                return new ServiceResult(200, "Get all gender category", result);
            }
            catch (Exception ex)
            {
                return new ServiceResult(500, ex.Message);
            }
        }
    }
}
