package service

import (
	"context"
	"errors"

	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
)

type BrandService struct {
	repo *repository.BrandRepo
}

func NewBrandService(repo *repository.BrandRepo) *BrandService {
	return &BrandService{repo: repo}
}

func (s *BrandService) GetAll(ctx context.Context, search string) ([]models.BrandResponse, error) {
	brands, err := s.repo.GetAll(ctx, search)
	if err != nil {
		return nil, err
	}
	responses := make([]models.BrandResponse, len(brands))
	for i, b := range brands {
		responses[i] = b.ToResponse()
	}
	return responses, nil
}

func (s *BrandService) AdminGetAll(ctx context.Context) ([]models.Brand, error) {
	return s.repo.AdminGetAll(ctx)
}

func (s *BrandService) Create(ctx context.Context, req models.CreateBrandRequest) (*models.Brand, error) {
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}
	brand := &models.Brand{
		Name:      req.Name,
		LogoUrl:   req.LogoUrl,
		SortOrder: req.SortOrder,
		IsActive:  isActive,
	}
	if err := s.repo.Create(ctx, brand); err != nil {
		return nil, err
	}
	return brand, nil
}

func (s *BrandService) Update(ctx context.Context, id int, req models.UpdateBrandRequest) (*models.Brand, error) {
	brand, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("brand not found")
	}
	if req.Name != nil {
		brand.Name = *req.Name
	}
	if req.LogoUrl != nil {
		brand.LogoUrl = req.LogoUrl
	}
	if req.SortOrder != nil {
		brand.SortOrder = *req.SortOrder
	}
	if req.IsActive != nil {
		brand.IsActive = *req.IsActive
	}
	if err := s.repo.Update(ctx, brand); err != nil {
		return nil, err
	}
	return brand, nil
}

func (s *BrandService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}
