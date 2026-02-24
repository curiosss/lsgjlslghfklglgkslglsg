package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type BannerHandler struct {
	service *service.BannerService
}

func NewBannerHandler(service *service.BannerService) *BannerHandler {
	return &BannerHandler{service: service}
}

// GetAll godoc
// @Summary      List banners
// @Description  Get all active banners (public)
// @Tags         Banners
// @Produce      json
// @Success      200  {object}  models.ApiResponse{data=[]models.BannerResponse}
// @Failure      500  {object}  models.ApiResponse
// @Router       /banners [get]
func (h *BannerHandler) GetAll(c *gin.Context) {
	banners, err := h.service.GetAll(c.Request.Context())
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, banners, nil)
}

// AdminGetAll godoc
// @Summary      List all banners (admin)
// @Description  Get all banners including inactive (admin)
// @Tags         Banners
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  models.ApiResponse{data=[]models.Banner}
// @Failure      500  {object}  models.ApiResponse
// @Router       /admin/banners [get]
func (h *BannerHandler) AdminGetAll(c *gin.Context) {
	banners, err := h.service.AdminGetAll(c.Request.Context())
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, banners, nil)
}

// Create godoc
// @Summary      Create banner
// @Description  Create a new banner (admin)
// @Tags         Banners
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        body  body      models.CreateBannerRequest  true  "Banner data"
// @Success      201   {object}  models.ApiResponse{data=models.Banner}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/banners [post]
func (h *BannerHandler) Create(c *gin.Context) {
	var req models.CreateBannerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	banner, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.CreatedResponse(c, banner)
}

// Update godoc
// @Summary      Update banner
// @Description  Update an existing banner (admin)
// @Tags         Banners
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id    path      int                         true  "Banner ID"
// @Param        body  body      models.UpdateBannerRequest  true  "Banner data"
// @Success      200   {object}  models.ApiResponse{data=models.Banner}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/banners/{id} [put]
func (h *BannerHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	var req models.UpdateBannerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	banner, err := h.service.Update(c.Request.Context(), id, req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, banner, nil)
}

// Delete godoc
// @Summary      Delete banner
// @Description  Delete a banner (admin)
// @Tags         Banners
// @Produce      json
// @Security     BearerAuth
// @Param        id  path      int  true  "Banner ID"
// @Success      200 {object}  models.ApiResponse
// @Failure      400 {object}  models.ApiResponse
// @Failure      500 {object}  models.ApiResponse
// @Router       /admin/banners/{id} [delete]
func (h *BannerHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.MessageResponse(c, "Banner deleted")
}
