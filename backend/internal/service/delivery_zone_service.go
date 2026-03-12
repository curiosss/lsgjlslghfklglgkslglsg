package service

import (
	"context"
	"errors"

	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
)

type DeliveryZoneService struct {
	repo *repository.DeliveryZoneRepo
}

func NewDeliveryZoneService(repo *repository.DeliveryZoneRepo) *DeliveryZoneService {
	return &DeliveryZoneService{repo: repo}
}

func (s *DeliveryZoneService) GetAll(ctx context.Context, lang string) ([]models.DeliveryZoneResponse, error) {
	zones, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	responses := make([]models.DeliveryZoneResponse, len(zones))
	for i, z := range zones {
		responses[i] = z.ToResponse(lang)
	}
	return responses, nil
}

func (s *DeliveryZoneService) AdminGetAll(ctx context.Context) ([]models.DeliveryZone, error) {
	return s.repo.AdminGetAll(ctx)
}

func (s *DeliveryZoneService) Create(ctx context.Context, req models.CreateDeliveryZoneRequest) (*models.DeliveryZone, error) {
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}
	zone := &models.DeliveryZone{
		NameRu:        req.NameRu,
		NameTm:        req.NameTm,
		NameEn:        req.NameEn,
		DeliveryPrice: req.DeliveryPrice,
		IsActive:      isActive,
	}
	if err := s.repo.Create(ctx, zone); err != nil {
		return nil, err
	}
	return zone, nil
}

func (s *DeliveryZoneService) Update(ctx context.Context, id int, req models.UpdateDeliveryZoneRequest) (*models.DeliveryZone, error) {
	zone, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("delivery zone not found")
	}
	if req.NameRu != nil {
		zone.NameRu = *req.NameRu
	}
	if req.NameTm != nil {
		zone.NameTm = *req.NameTm
	}
	if req.NameEn != nil {
		zone.NameEn = *req.NameEn
	}
	if req.DeliveryPrice != nil {
		zone.DeliveryPrice = *req.DeliveryPrice
	}
	if req.IsActive != nil {
		zone.IsActive = *req.IsActive
	}
	if err := s.repo.Update(ctx, zone); err != nil {
		return nil, err
	}
	return zone, nil
}

func (s *DeliveryZoneService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}
