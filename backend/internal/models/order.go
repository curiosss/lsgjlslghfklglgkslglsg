package models

import "time"

type OrderStatus string

const (
	OrderStatusNew       OrderStatus = "new"
	OrderStatusConfirmed OrderStatus = "confirmed"
	OrderStatusShipped   OrderStatus = "shipped"
	OrderStatusDelivered OrderStatus = "delivered"
	OrderStatusCancelled OrderStatus = "cancelled"
)

type OrderType string

const (
	OrderTypeDelivery OrderType = "delivery"
	OrderTypePickup   OrderType = "pickup"
)

type Order struct {
	ID             int         `json:"id" db:"id"`
	OrderNumber    string      `json:"order_number" db:"order_number"`
	Type           OrderType   `json:"type" db:"type"`
	Status         OrderStatus `json:"status" db:"status"`
	FullName       string      `json:"full_name" db:"full_name"`
	Phone          string      `json:"phone" db:"phone"`
	Address        *string     `json:"address" db:"address"`
	Note           *string     `json:"note" db:"note"`
	DeliveryZoneID *int        `json:"delivery_zone_id" db:"delivery_zone_id"`
	DeliveryDate   *string     `json:"delivery_date" db:"delivery_date"`
	TimeSlot       *string     `json:"time_slot" db:"time_slot"`
	Subtotal       float64     `json:"subtotal" db:"subtotal"`
	DeliveryFee    float64     `json:"delivery_fee" db:"delivery_fee"`
	Total          float64     `json:"total" db:"total"`
	CreatedAt      time.Time   `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time   `json:"updated_at" db:"updated_at"`
}

type OrderItem struct {
	ID              int     `json:"id" db:"id"`
	OrderID         int     `json:"order_id" db:"order_id"`
	ProductID       int     `json:"product_id" db:"product_id"`
	ProductName     string  `json:"product_name" db:"product_name"`
	ProductImageUrl string  `json:"product_image_url" db:"product_image_url"`
	Quantity        int     `json:"quantity" db:"quantity"`
	Price           float64 `json:"price" db:"price"`
	Total           float64 `json:"total" db:"total"`
}

type OrderWithItems struct {
	Order
	Items []OrderItem `json:"items"`
}

type CreateOrderRequest struct {
	Type           OrderType         `json:"type" validate:"required,oneof=delivery pickup"`
	FullName       string            `json:"full_name" validate:"required,min=2,max=200"`
	Phone          string            `json:"phone" validate:"required"`
	Address        *string           `json:"address"`
	Note           *string           `json:"note"`
	DeliveryZoneID *int              `json:"delivery_zone_id"`
	DeliveryDate   string            `json:"delivery_date" validate:"required"`
	TimeSlot       string            `json:"time_slot" validate:"required"`
	Items          []CartItemRequest `json:"items" validate:"required,min=1,dive"`
}

type CartItemRequest struct {
	ProductID int `json:"product_id" validate:"required"`
	Quantity  int `json:"quantity" validate:"required,min=1"`
}

type UpdateOrderStatusRequest struct {
	Status OrderStatus `json:"status" validate:"required,oneof=new confirmed shipped delivered cancelled"`
}

type OrderFilters struct {
	Type     string
	Status   string
	Search   string
	Phone    string
	DateFrom string
	DateTo   string
}
