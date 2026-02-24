package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type UploadHandler struct {
	service *service.UploadService
}

func NewUploadHandler(service *service.UploadService) *UploadHandler {
	return &UploadHandler{service: service}
}

// Upload godoc
// @Summary      Upload file
// @Description  Upload an image file (admin)
// @Tags         Upload
// @Accept       multipart/form-data
// @Produce      json
// @Security     BearerAuth
// @Param        file  formData  file  true  "Image file (jpg, jpeg, png, gif, webp, svg)"
// @Success      200   {object}  models.ApiResponse
// @Failure      400   {object}  models.ApiResponse
// @Router       /admin/upload [post]
func (h *UploadHandler) Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "No file provided")
		return
	}
	url, err := h.service.Upload(file)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "UPLOAD_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, gin.H{"url": url}, nil)
}

// Delete godoc
// @Summary      Delete file
// @Description  Delete an uploaded file (admin)
// @Tags         Upload
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        body  body      string  true  "JSON with url field"
// @Success      200   {object}  models.ApiResponse
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/upload [delete]
func (h *UploadHandler) Delete(c *gin.Context) {
	var req struct {
		URL string `json:"url" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "URL is required")
		return
	}
	if err := h.service.Delete(req.URL); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "DELETE_ERROR", err.Error())
		return
	}
	utils.MessageResponse(c, "File deleted")
}
