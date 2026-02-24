package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/models"
)

func SuccessResponse(c *gin.Context, data interface{}, pagination *models.Pagination) {
	resp := models.ApiResponse{
		Success:    true,
		Data:       data,
		Pagination: pagination,
	}
	c.JSON(http.StatusOK, resp)
}

func CreatedResponse(c *gin.Context, data interface{}) {
	resp := models.ApiResponse{
		Success: true,
		Data:    data,
		Message: "created",
	}
	c.JSON(http.StatusCreated, resp)
}

func MessageResponse(c *gin.Context, message string) {
	resp := models.ApiResponse{
		Success: true,
		Message: message,
	}
	c.JSON(http.StatusOK, resp)
}

func ErrorResponse(c *gin.Context, status int, code string, message string) {
	resp := models.ApiResponse{
		Success: false,
		Error: &models.ApiError{
			Code:    code,
			Message: message,
		},
	}
	c.JSON(status, resp)
}

func ValidationErrorResponse(c *gin.Context, details map[string]string) {
	resp := models.ApiResponse{
		Success: false,
		Error: &models.ApiError{
			Code:    "VALIDATION_ERROR",
			Message: "Validation failed",
			Details: details,
		},
	}
	c.JSON(http.StatusBadRequest, resp)
}
