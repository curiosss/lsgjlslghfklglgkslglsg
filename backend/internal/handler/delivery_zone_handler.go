package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type DeliveryZoneHandler struct {
	service *service.DeliveryZoneService
}

func NewDeliveryZoneHandler(service *service.DeliveryZoneService) *DeliveryZoneHandler {
	return &DeliveryZoneHandler{service: service}
}

// GetAll godoc
// @Summary      List delivery zones
// @Description  Get all active delivery zones (public)
// @Tags         Delivery Zones
// @Produce      json
// @Param        lang  query     string  false  "Language (ru, tm, or en)"  default(ru)
// @Success      200   {object}  models.ApiResponse{data=[]models.DeliveryZoneResponse}
// @Failure      500   {object}  models.ApiResponse
// @Router       /delivery-zones [get]
func (h *DeliveryZoneHandler) GetAll(c *gin.Context) {
	lang := utils.GetLang(c)
	zones, err := h.service.GetAll(c.Request.Context(), lang)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, zones, nil)
}

// AdminGetAll godoc
// @Summary      List all delivery zones (admin)
// @Description  Get all delivery zones including inactive (admin)
// @Tags         Delivery Zones
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  models.ApiResponse{data=[]models.DeliveryZone}
// @Failure      500  {object}  models.ApiResponse
// @Router       /admin/delivery-zones [get]
func (h *DeliveryZoneHandler) AdminGetAll(c *gin.Context) {
	zones, err := h.service.AdminGetAll(c.Request.Context())
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, zones, nil)
}

// Create godoc
// @Summary      Create delivery zone
// @Description  Create a new delivery zone (admin)
// @Tags         Delivery Zones
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        body  body      models.CreateDeliveryZoneRequest  true  "Delivery zone data"
// @Success      201   {object}  models.ApiResponse{data=models.DeliveryZone}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/delivery-zones [post]
func (h *DeliveryZoneHandler) Create(c *gin.Context) {
	var req models.CreateDeliveryZoneRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	zone, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.CreatedResponse(c, zone)
}

// Update godoc
// @Summary      Update delivery zone
// @Description  Update an existing delivery zone (admin)
// @Tags         Delivery Zones
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id    path      int                               true  "Delivery zone ID"
// @Param        body  body      models.UpdateDeliveryZoneRequest  true  "Delivery zone data"
// @Success      200   {object}  models.ApiResponse{data=models.DeliveryZone}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/delivery-zones/{id} [put]
func (h *DeliveryZoneHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	var req models.UpdateDeliveryZoneRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	zone, err := h.service.Update(c.Request.Context(), id, req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, zone, nil)
}

// Delete godoc
// @Summary      Delete delivery zone
// @Description  Delete a delivery zone (admin)
// @Tags         Delivery Zones
// @Produce      json
// @Security     BearerAuth
// @Param        id  path      int  true  "Delivery zone ID"
// @Success      200 {object}  models.ApiResponse
// @Failure      400 {object}  models.ApiResponse
// @Failure      500 {object}  models.ApiResponse
// @Router       /admin/delivery-zones/{id} [delete]
func (h *DeliveryZoneHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.MessageResponse(c, "Delivery zone deleted")
}
