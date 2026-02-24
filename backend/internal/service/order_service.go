package service

import (
	"context"
	"errors"

	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
)

type OrderService struct {
	orderRepo        *repository.OrderRepo
	productRepo      *repository.ProductRepo
	deliveryZoneRepo *repository.DeliveryZoneRepo
}

func NewOrderService(orderRepo *repository.OrderRepo, productRepo *repository.ProductRepo, deliveryZoneRepo *repository.DeliveryZoneRepo) *OrderService {
	return &OrderService{
		orderRepo:        orderRepo,
		productRepo:      productRepo,
		deliveryZoneRepo: deliveryZoneRepo,
	}
}

func (s *OrderService) Create(ctx context.Context, req models.CreateOrderRequest) (*models.OrderWithItems, error) {
	if len(req.Items) == 0 {
		return nil, errors.New("order must have at least one item")
	}

	var subtotal float64
	var items []models.OrderItem

	for _, cartItem := range req.Items {
		product, err := s.productRepo.GetByID(ctx, cartItem.ProductID)
		if err != nil {
			return nil, errors.New("product not found")
		}
		if !product.IsActive {
			return nil, errors.New("product is not available")
		}

		itemTotal := product.Price * float64(cartItem.Quantity)
		subtotal += itemTotal

		items = append(items, models.OrderItem{
			ProductID:       product.ID,
			ProductName:     product.NameRu,
			ProductImageUrl: product.ImageUrl,
			Quantity:        cartItem.Quantity,
			Price:           product.Price,
			Total:           itemTotal,
		})
	}

	var deliveryFee float64
	if req.Type == models.OrderTypeDelivery && req.DeliveryZoneID != nil {
		zone, err := s.deliveryZoneRepo.GetByID(ctx, *req.DeliveryZoneID)
		if err != nil {
			return nil, errors.New("delivery zone not found")
		}
		deliveryFee = zone.DeliveryPrice
	}

	order := &models.Order{
		Type:           req.Type,
		Status:         models.OrderStatusNew,
		FullName:       req.FullName,
		Phone:          req.Phone,
		Address:        req.Address,
		Note:           req.Note,
		DeliveryZoneID: req.DeliveryZoneID,
		DeliveryDate:   &req.DeliveryDate,
		TimeSlot:       &req.TimeSlot,
		Subtotal:       subtotal,
		DeliveryFee:    deliveryFee,
		Total:          subtotal + deliveryFee,
	}

	if err := s.orderRepo.Create(ctx, order, items); err != nil {
		return nil, err
	}

	return &models.OrderWithItems{Order: *order, Items: items}, nil
}

func (s *OrderService) GetByPhone(ctx context.Context, phone string) ([]models.Order, error) {
	if phone == "" {
		return nil, errors.New("phone is required")
	}
	return s.orderRepo.GetByPhone(ctx, phone)
}

func (s *OrderService) AdminGetAll(ctx context.Context, filters models.OrderFilters, page, limit int) ([]models.Order, int, error) {
	return s.orderRepo.AdminGetAll(ctx, filters, page, limit)
}

func (s *OrderService) AdminGetByID(ctx context.Context, id int) (*models.OrderWithItems, error) {
	return s.orderRepo.GetByID(ctx, id)
}

func (s *OrderService) UpdateStatus(ctx context.Context, id int, status models.OrderStatus) error {
	return s.orderRepo.UpdateStatus(ctx, id, status)
}
