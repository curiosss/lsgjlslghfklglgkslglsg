package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type TimeSlotHandler struct {
	service *service.TimeSlotService
}

func NewTimeSlotHandler(service *service.TimeSlotService) *TimeSlotHandler {
	return &TimeSlotHandler{service: service}
}

// GetAll godoc
// @Summary      List time slots
// @Description  Get all active time slots (public)
// @Tags         Time Slots
// @Produce      json
// @Success      200  {object}  models.ApiResponse{data=[]models.TimeSlotResponse}
// @Failure      500  {object}  models.ApiResponse
// @Router       /time-slots [get]
func (h *TimeSlotHandler) GetAll(c *gin.Context) {
	slots, err := h.service.GetAll(c.Request.Context())
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, slots, nil)
}

// AdminGetAll godoc
// @Summary      List all time slots (admin)
// @Description  Get all time slots including inactive (admin)
// @Tags         Time Slots
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  models.ApiResponse{data=[]models.TimeSlot}
// @Failure      500  {object}  models.ApiResponse
// @Router       /admin/time-slots [get]
func (h *TimeSlotHandler) AdminGetAll(c *gin.Context) {
	slots, err := h.service.AdminGetAll(c.Request.Context())
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, slots, nil)
}

// Create godoc
// @Summary      Create time slot
// @Description  Create a new time slot (admin)
// @Tags         Time Slots
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        body  body      models.CreateTimeSlotRequest  true  "Time slot data"
// @Success      201   {object}  models.ApiResponse{data=models.TimeSlot}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/time-slots [post]
func (h *TimeSlotHandler) Create(c *gin.Context) {
	var req models.CreateTimeSlotRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	slot, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.CreatedResponse(c, slot)
}

// Update godoc
// @Summary      Update time slot
// @Description  Update an existing time slot (admin)
// @Tags         Time Slots
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id    path      int                           true  "Time slot ID"
// @Param        body  body      models.UpdateTimeSlotRequest  true  "Time slot data"
// @Success      200   {object}  models.ApiResponse{data=models.TimeSlot}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/time-slots/{id} [put]
func (h *TimeSlotHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	var req models.UpdateTimeSlotRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	slot, err := h.service.Update(c.Request.Context(), id, req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, slot, nil)
}

// Delete godoc
// @Summary      Delete time slot
// @Description  Delete a time slot (admin)
// @Tags         Time Slots
// @Produce      json
// @Security     BearerAuth
// @Param        id  path      int  true  "Time slot ID"
// @Success      200 {object}  models.ApiResponse
// @Failure      400 {object}  models.ApiResponse
// @Failure      500 {object}  models.ApiResponse
// @Router       /admin/time-slots/{id} [delete]
func (h *TimeSlotHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.MessageResponse(c, "Time slot deleted")
}
