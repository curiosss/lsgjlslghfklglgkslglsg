package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type OrderHandler struct {
	service *service.OrderService
}

func NewOrderHandler(service *service.OrderService) *OrderHandler {
	return &OrderHandler{service: service}
}

// Create godoc
// @Summary      Create order
// @Description  Create a new order (public)
// @Tags         Orders
// @Accept       json
// @Produce      json
// @Param        body  body      models.CreateOrderRequest  true  "Order data"
// @Success      201   {object}  models.ApiResponse{data=models.OrderWithItems}
// @Failure      400   {object}  models.ApiResponse
// @Router       /orders [post]
func (h *OrderHandler) Create(c *gin.Context) {
	var req models.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	order, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ORDER_ERROR", err.Error())
		return
	}
	utils.CreatedResponse(c, order)
}

// GetByPhone godoc
// @Summary      Get orders by phone
// @Description  Get order history by phone number (public)
// @Tags         Orders
// @Produce      json
// @Param        phone  query     string  true  "Phone number"
// @Success      200    {object}  models.ApiResponse{data=[]models.Order}
// @Failure      400    {object}  models.ApiResponse
// @Router       /orders [get]
func (h *OrderHandler) GetByPhone(c *gin.Context) {
	phone := c.Query("phone")
	orders, err := h.service.GetByPhone(c.Request.Context(), phone)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, orders, nil)
}

// AdminGetAll godoc
// @Summary      List all orders (admin)
// @Description  Get all orders with filtering and pagination (admin)
// @Tags         Orders
// @Produce      json
// @Security     BearerAuth
// @Param        status     query     string  false  "Filter by status (new, confirmed, shipped, delivered, cancelled)"
// @Param        type       query     string  false  "Filter by type (delivery, pickup)"
// @Param        phone      query     string  false  "Filter by phone"
// @Param        search     query     string  false  "Search by name or order number"
// @Param        date_from  query     string  false  "Filter from date (YYYY-MM-DD)"
// @Param        date_to    query     string  false  "Filter to date (YYYY-MM-DD)"
// @Param        page       query     int     false  "Page number"  default(1)
// @Param        limit      query     int     false  "Items per page"  default(20)
// @Success      200        {object}  models.ApiResponse{data=[]models.Order,pagination=models.Pagination}
// @Failure      500        {object}  models.ApiResponse
// @Router       /admin/orders [get]
func (h *OrderHandler) AdminGetAll(c *gin.Context) {
	page, limit := utils.GetPagination(c)
	filters := models.OrderFilters{
		Status:   c.Query("status"),
		Type:     c.Query("type"),
		Phone:    c.Query("phone"),
		Search:   c.Query("search"),
		DateFrom: c.Query("date_from"),
		DateTo:   c.Query("date_to"),
	}
	orders, total, err := h.service.AdminGetAll(c.Request.Context(), filters, page, limit)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	pagination := utils.NewPagination(page, limit, total)
	utils.SuccessResponse(c, orders, &pagination)
}

// AdminGetByID godoc
// @Summary      Get order details (admin)
// @Description  Get order with items by ID (admin)
// @Tags         Orders
// @Produce      json
// @Security     BearerAuth
// @Param        id  path      int  true  "Order ID"
// @Success      200 {object}  models.ApiResponse{data=models.OrderWithItems}
// @Failure      400 {object}  models.ApiResponse
// @Failure      404 {object}  models.ApiResponse
// @Router       /admin/orders/{id} [get]
func (h *OrderHandler) AdminGetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	order, err := h.service.AdminGetByID(c.Request.Context(), id)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "NOT_FOUND", "Order not found")
		return
	}
	utils.SuccessResponse(c, order, nil)
}

// UpdateStatus godoc
// @Summary      Update order status (admin)
// @Description  Change order status (admin)
// @Tags         Orders
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id    path      int                             true  "Order ID"
// @Param        body  body      models.UpdateOrderStatusRequest true  "New status"
// @Success      200   {object}  models.ApiResponse
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/orders/{id}/status [put]
func (h *OrderHandler) UpdateStatus(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	var req models.UpdateOrderStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	if err := h.service.UpdateStatus(c.Request.Context(), id, req.Status); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.MessageResponse(c, "Order status updated")
}
