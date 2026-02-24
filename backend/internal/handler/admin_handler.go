package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type AdminHandler struct {
	service *service.AdminService
}

func NewAdminHandler(service *service.AdminService) *AdminHandler {
	return &AdminHandler{service: service}
}

// GetAll godoc
// @Summary      List all admins
// @Description  Get all admin users (superadmin only)
// @Tags         Admins
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  models.ApiResponse{data=[]models.AdminResponse}
// @Failure      500  {object}  models.ApiResponse
// @Router       /admin/admins [get]
func (h *AdminHandler) GetAll(c *gin.Context) {
	admins, err := h.service.GetAll(c.Request.Context())
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	utils.SuccessResponse(c, admins, nil)
}

// Create godoc
// @Summary      Create admin
// @Description  Create a new admin user (superadmin only)
// @Tags         Admins
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        body  body      models.CreateAdminRequest  true  "Admin data"
// @Success      201   {object}  models.ApiResponse{data=models.Admin}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/admins [post]
func (h *AdminHandler) Create(c *gin.Context) {
	var req models.CreateAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}

	admin, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	utils.CreatedResponse(c, admin)
}

// Update godoc
// @Summary      Update admin
// @Description  Update an existing admin user (superadmin only)
// @Tags         Admins
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id    path      int                        true  "Admin ID"
// @Param        body  body      models.UpdateAdminRequest  true  "Admin data"
// @Success      200   {object}  models.ApiResponse{data=models.Admin}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/admins/{id} [put]
func (h *AdminHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}

	var req models.UpdateAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}

	admin, err := h.service.Update(c.Request.Context(), id, req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	utils.SuccessResponse(c, admin, nil)
}

// Delete godoc
// @Summary      Delete admin
// @Description  Delete an admin user (superadmin only)
// @Tags         Admins
// @Produce      json
// @Security     BearerAuth
// @Param        id  path      int  true  "Admin ID"
// @Success      200 {object}  models.ApiResponse
// @Failure      400 {object}  models.ApiResponse
// @Failure      500 {object}  models.ApiResponse
// @Router       /admin/admins/{id} [delete]
func (h *AdminHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	utils.MessageResponse(c, "Admin deleted")
}
