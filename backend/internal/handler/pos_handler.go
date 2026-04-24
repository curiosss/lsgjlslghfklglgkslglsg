package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type POSHandler struct {
	service *service.POSService
}

func NewPOSHandler(service *service.POSService) *POSHandler {
	return &POSHandler{service: service}
}

type posLoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

func (h *POSHandler) Token(c *gin.Context) {
	var req posLoginRequest
	if err := utils.BindBody(c, &req); err != nil {
		return
	}

	resp, err := h.service.Login(c.Request.Context(), req.Username, req.Password)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "UNAUTHORIZED", err.Error())
		return
	}

	// For compatibility with POS expectations:
	// `{"access": "fake-jwt..."}` as seen in test_server.go
	c.JSON(http.StatusOK, gin.H{
		"access": resp.AccessToken,
	})
}

func (h *POSHandler) ImportProducts(c *gin.Context) {
	var payload service.POSImportPayload
	if err := utils.BindBody(c, &payload); err != nil {
		return
	}

	if err := h.service.ImportProducts(c.Request.Context(), payload); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to import products: "+err.Error())
		return
	}

	c.String(http.StatusOK, "Received successfully")
}
