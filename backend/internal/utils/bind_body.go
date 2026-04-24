package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func BindBody(c *gin.Context, req interface{}) error {
	if err := c.ShouldBindJSON(req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return err
	}
	return nil
}
