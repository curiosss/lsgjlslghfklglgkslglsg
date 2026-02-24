package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type ProductHandler struct {
	service *service.ProductService
}

func NewProductHandler(service *service.ProductService) *ProductHandler {
	return &ProductHandler{service: service}
}

// GetAll godoc
// @Summary      List products
// @Description  Get products with filtering, sorting, and pagination (public)
// @Tags         Products
// @Produce      json
// @Param        lang            query     string  false  "Language (ru or tm)"  default(ru)
// @Param        category_id     query     int     false  "Filter by category ID"
// @Param        subcategory_id  query     int     false  "Filter by subcategory ID"
// @Param        brand_id        query     int     false  "Filter by brand ID"
// @Param        search          query     string  false  "Search by name"
// @Param        sort            query     string  false  "Sort: price_asc, price_desc, newest, name_asc"
// @Param        is_new          query     bool    false  "Filter new products"
// @Param        is_discount     query     bool    false  "Filter discounted products"
// @Param        page            query     int     false  "Page number"  default(1)
// @Param        limit           query     int     false  "Items per page"  default(20)
// @Success      200             {object}  models.ApiResponse{data=[]models.ProductResponse,pagination=models.Pagination}
// @Failure      500             {object}  models.ApiResponse
// @Router       /products [get]
func (h *ProductHandler) GetAll(c *gin.Context) {
	lang := utils.GetLang(c)
	page, limit := utils.GetPagination(c)
	filters := models.ProductFilters{
		CategoryID:    utils.QueryInt(c, "category_id"),
		SubCategoryID: utils.QueryInt(c, "subcategory_id"),
		BrandID:       utils.QueryInt(c, "brand_id"),
		Search:        c.Query("search"),
		Sort:          c.Query("sort"),
		IsNew:         utils.QueryBool(c, "is_new"),
		IsDiscount:    utils.QueryBool(c, "is_discount"),
	}
	products, total, err := h.service.GetAll(c.Request.Context(), filters, lang, page, limit)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	pagination := utils.NewPagination(page, limit, total)
	utils.SuccessResponse(c, products, &pagination)
}

// AdminGetAll godoc
// @Summary      List all products (admin)
// @Description  Get all products with filtering and pagination (admin)
// @Tags         Products
// @Produce      json
// @Security     BearerAuth
// @Param        category_id     query     int     false  "Filter by category ID"
// @Param        subcategory_id  query     int     false  "Filter by subcategory ID"
// @Param        brand_id        query     int     false  "Filter by brand ID"
// @Param        search          query     string  false  "Search by name"
// @Param        page            query     int     false  "Page number"  default(1)
// @Param        limit           query     int     false  "Items per page"  default(20)
// @Success      200             {object}  models.ApiResponse{data=[]models.Product,pagination=models.Pagination}
// @Failure      500             {object}  models.ApiResponse
// @Router       /admin/products [get]
func (h *ProductHandler) AdminGetAll(c *gin.Context) {
	page, limit := utils.GetPagination(c)
	filters := models.ProductFilters{
		CategoryID:    utils.QueryInt(c, "category_id"),
		SubCategoryID: utils.QueryInt(c, "subcategory_id"),
		BrandID:       utils.QueryInt(c, "brand_id"),
		Search:        c.Query("search"),
	}
	products, total, err := h.service.AdminGetAll(c.Request.Context(), filters, page, limit)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	pagination := utils.NewPagination(page, limit, total)
	utils.SuccessResponse(c, products, &pagination)
}

// GetByID godoc
// @Summary      Get product
// @Description  Get a single product by ID (public)
// @Tags         Products
// @Produce      json
// @Param        id    path      int     true   "Product ID"
// @Param        lang  query     string  false  "Language (ru or tm)"  default(ru)
// @Success      200   {object}  models.ApiResponse{data=models.ProductResponse}
// @Failure      400   {object}  models.ApiResponse
// @Failure      404   {object}  models.ApiResponse
// @Router       /products/{id} [get]
func (h *ProductHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	lang := utils.GetLang(c)
	product, err := h.service.GetByID(c.Request.Context(), id, lang)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "NOT_FOUND", err.Error())
		return
	}
	utils.SuccessResponse(c, product, nil)
}

// AdminGetByID godoc
// @Summary      Get product (admin)
// @Description  Get a single product by ID with all fields (admin)
// @Tags         Products
// @Produce      json
// @Security     BearerAuth
// @Param        id  path      int  true  "Product ID"
// @Success      200 {object}  models.ApiResponse{data=models.Product}
// @Failure      400 {object}  models.ApiResponse
// @Failure      404 {object}  models.ApiResponse
// @Router       /admin/products/{id} [get]
func (h *ProductHandler) AdminGetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	product, err := h.service.AdminGetByID(c.Request.Context(), id)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "NOT_FOUND", err.Error())
		return
	}
	utils.SuccessResponse(c, product, nil)
}

// GetRelated godoc
// @Summary      Get related products
// @Description  Get related products from the same category (public)
// @Tags         Products
// @Produce      json
// @Param        id     path      int     true   "Product ID"
// @Param        lang   query     string  false  "Language (ru or tm)"  default(ru)
// @Param        limit  query     int     false  "Number of related products"  default(10)
// @Success      200    {object}  models.ApiResponse{data=[]models.ProductResponse}
// @Failure      400    {object}  models.ApiResponse
// @Failure      500    {object}  models.ApiResponse
// @Router       /products/{id}/related [get]
func (h *ProductHandler) GetRelated(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	lang := utils.GetLang(c)
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	products, err := h.service.GetRelated(c.Request.Context(), id, lang, limit)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, products, nil)
}

// Create godoc
// @Summary      Create product
// @Description  Create a new product (admin)
// @Tags         Products
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        body  body      models.CreateProductRequest  true  "Product data"
// @Success      201   {object}  models.ApiResponse{data=models.Product}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/products [post]
func (h *ProductHandler) Create(c *gin.Context) {
	var req models.CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	product, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.CreatedResponse(c, product)
}

// Update godoc
// @Summary      Update product
// @Description  Update an existing product (admin)
// @Tags         Products
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id    path      int                          true  "Product ID"
// @Param        body  body      models.UpdateProductRequest  true  "Product data"
// @Success      200   {object}  models.ApiResponse{data=models.Product}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/products/{id} [put]
func (h *ProductHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	var req models.UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	product, err := h.service.Update(c.Request.Context(), id, req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, product, nil)
}

// Delete godoc
// @Summary      Delete product
// @Description  Delete a product (admin)
// @Tags         Products
// @Produce      json
// @Security     BearerAuth
// @Param        id  path      int  true  "Product ID"
// @Success      200 {object}  models.ApiResponse
// @Failure      400 {object}  models.ApiResponse
// @Failure      500 {object}  models.ApiResponse
// @Router       /admin/products/{id} [delete]
func (h *ProductHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.MessageResponse(c, "Product deleted")
}
