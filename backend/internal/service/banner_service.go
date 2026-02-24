package service

import (
	"context"
	"errors"

	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
)

type BannerService struct {
	repo *repository.BannerRepo
}

func NewBannerService(repo *repository.BannerRepo) *BannerService {
	return &BannerService{repo: repo}
}

func (s *BannerService) GetAll(ctx context.Context) ([]models.BannerResponse, error) {
	banners, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	responses := make([]models.BannerResponse, len(banners))
	for i, b := range banners {
		responses[i] = b.ToResponse()
	}
	return responses, nil
}

func (s *BannerService) AdminGetAll(ctx context.Context) ([]models.Banner, error) {
	return s.repo.AdminGetAll(ctx)
}

func (s *BannerService) Create(ctx context.Context, req models.CreateBannerRequest) (*models.Banner, error) {
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}
	banner := &models.Banner{
		ImageUrl:  req.ImageUrl,
		LinkType:  req.LinkType,
		LinkValue: req.LinkValue,
		SortOrder: req.SortOrder,
		IsActive:  isActive,
	}
	if err := s.repo.Create(ctx, banner); err != nil {
		return nil, err
	}
	return banner, nil
}

func (s *BannerService) Update(ctx context.Context, id int, req models.UpdateBannerRequest) (*models.Banner, error) {
	banner, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("banner not found")
	}
	if req.ImageUrl != nil {
		banner.ImageUrl = *req.ImageUrl
	}
	if req.LinkType != nil {
		banner.LinkType = req.LinkType
	}
	if req.LinkValue != nil {
		banner.LinkValue = req.LinkValue
	}
	if req.SortOrder != nil {
		banner.SortOrder = *req.SortOrder
	}
	if req.IsActive != nil {
		banner.IsActive = *req.IsActive
	}
	if err := s.repo.Update(ctx, banner); err != nil {
		return nil, err
	}
	return banner, nil
}

func (s *BannerService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}
