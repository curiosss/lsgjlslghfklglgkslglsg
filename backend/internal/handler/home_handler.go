package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type HomeHandler struct {
	service *service.HomeService
}

func NewHomeHandler(service *service.HomeService) *HomeHandler {
	return &HomeHandler{service: service}
}

// GetHome godoc
// @Summary      Home page data
// @Description  Get aggregated data for home page: banners, brands, categories, new and discounted products
// @Tags         Home
// @Produce      json
// @Param        lang  query     string  false  "Language (ru or tm)"  default(ru)
// @Success      200   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /home [get]
func (h *HomeHandler) GetHome(c *gin.Context) {
	lang := utils.GetLang(c)
	data, err := h.service.GetHome(c.Request.Context(), lang)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, data, nil)
}
