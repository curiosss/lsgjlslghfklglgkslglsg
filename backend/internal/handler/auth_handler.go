package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type AuthHandler struct {
	adminService *service.AdminService
}

func NewAuthHandler(adminService *service.AdminService) *AuthHandler {
	return &AuthHandler{adminService: adminService}
}

// Login godoc
// @Summary      Admin login
// @Description  Authenticate admin user and return JWT tokens
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        body  body      models.LoginRequest  true  "Login credentials"
// @Success      200   {object}  models.ApiResponse{data=models.LoginResponse}
// @Failure      400   {object}  models.ApiResponse
// @Failure      401   {object}  models.ApiResponse
// @Router       /admin/auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}

	resp, err := h.adminService.Login(c.Request.Context(), req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "UNAUTHORIZED", err.Error())
		return
	}

	utils.SuccessResponse(c, resp, nil)
}

// Refresh godoc
// @Summary      Refresh token
// @Description  Get new access token using refresh token
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        body  body      models.RefreshRequest  true  "Refresh token"
// @Success      200   {object}  models.ApiResponse{data=models.LoginResponse}
// @Failure      400   {object}  models.ApiResponse
// @Failure      401   {object}  models.ApiResponse
// @Router       /admin/auth/refresh [post]
func (h *AuthHandler) Refresh(c *gin.Context) {
	var req models.RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}

	resp, err := h.adminService.RefreshTokenDirect(c.Request.Context(), req.RefreshToken)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "UNAUTHORIZED", err.Error())
		return
	}

	utils.SuccessResponse(c, resp, nil)
}

// Me godoc
// @Summary      Get current admin
// @Description  Get currently authenticated admin info
// @Tags         Auth
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  models.ApiResponse{data=models.AdminResponse}
// @Failure      404  {object}  models.ApiResponse
// @Router       /admin/auth/me [get]
func (h *AuthHandler) Me(c *gin.Context) {
	adminID, _ := c.Get("admin_id")
	admin, err := h.adminService.GetByID(c.Request.Context(), adminID.(int))
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "NOT_FOUND", "Admin not found")
		return
	}

	utils.SuccessResponse(c, admin.ToResponse(), nil)
}
