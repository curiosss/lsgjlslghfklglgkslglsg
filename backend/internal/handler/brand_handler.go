package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type BrandHandler struct {
	service *service.BrandService
}

func NewBrandHandler(service *service.BrandService) *BrandHandler {
	return &BrandHandler{service: service}
}

// GetAll godoc
// @Summary      List brands
// @Description  Get all active brands (public)
// @Tags         Brands
// @Produce      json
// @Param        search  query     string  false  "Search by name"
// @Success      200     {object}  models.ApiResponse{data=[]models.BrandResponse}
// @Failure      500     {object}  models.ApiResponse
// @Router       /brands [get]
func (h *BrandHandler) GetAll(c *gin.Context) {
	search := c.Query("search")
	brands, err := h.service.GetAll(c.Request.Context(), search)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, brands, nil)
}

// AdminGetAll godoc
// @Summary      List all brands (admin)
// @Description  Get all brands including inactive (admin)
// @Tags         Brands
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  models.ApiResponse{data=[]models.Brand}
// @Failure      500  {object}  models.ApiResponse
// @Router       /admin/brands [get]
func (h *BrandHandler) AdminGetAll(c *gin.Context) {
	brands, err := h.service.AdminGetAll(c.Request.Context())
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, brands, nil)
}

// Create godoc
// @Summary      Create brand
// @Description  Create a new brand (admin)
// @Tags         Brands
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        body  body      models.CreateBrandRequest  true  "Brand data"
// @Success      201   {object}  models.ApiResponse{data=models.Brand}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/brands [post]
func (h *BrandHandler) Create(c *gin.Context) {
	var req models.CreateBrandRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	brand, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.CreatedResponse(c, brand)
}

// Update godoc
// @Summary      Update brand
// @Description  Update an existing brand (admin)
// @Tags         Brands
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id    path      int                        true  "Brand ID"
// @Param        body  body      models.UpdateBrandRequest  true  "Brand data"
// @Success      200   {object}  models.ApiResponse{data=models.Brand}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/brands/{id} [put]
func (h *BrandHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	var req models.UpdateBrandRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	brand, err := h.service.Update(c.Request.Context(), id, req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, brand, nil)
}

// Delete godoc
// @Summary      Delete brand
// @Description  Delete a brand (admin)
// @Tags         Brands
// @Produce      json
// @Security     BearerAuth
// @Param        id  path      int  true  "Brand ID"
// @Success      200 {object}  models.ApiResponse
// @Failure      400 {object}  models.ApiResponse
// @Failure      500 {object}  models.ApiResponse
// @Router       /admin/brands/{id} [delete]
func (h *BrandHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.MessageResponse(c, "Brand deleted")
}
