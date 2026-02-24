package service

import (
	"context"

	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
)

type HomeData struct {
	Banners      []models.BannerResponse  `json:"banners"`
	Brands       []models.BrandResponse   `json:"brands"`
	Categories   []models.CategoryResponse `json:"categories"`
	NewProducts  []models.ProductResponse  `json:"new_products"`
	DiscountProducts []models.ProductResponse `json:"discount_products"`
}

type HomeService struct {
	bannerRepo   *repository.BannerRepo
	brandRepo    *repository.BrandRepo
	categoryRepo *repository.CategoryRepo
	productRepo  *repository.ProductRepo
}

func NewHomeService(bannerRepo *repository.BannerRepo, brandRepo *repository.BrandRepo, categoryRepo *repository.CategoryRepo, productRepo *repository.ProductRepo) *HomeService {
	return &HomeService{
		bannerRepo:   bannerRepo,
		brandRepo:    brandRepo,
		categoryRepo: categoryRepo,
		productRepo:  productRepo,
	}
}

func (s *HomeService) GetHome(ctx context.Context, lang string) (*HomeData, error) {
	// Banners
	banners, err := s.bannerRepo.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	bannerResponses := make([]models.BannerResponse, len(banners))
	for i, b := range banners {
		bannerResponses[i] = b.ToResponse()
	}

	// Brands
	brands, err := s.brandRepo.GetAll(ctx, "")
	if err != nil {
		return nil, err
	}
	brandResponses := make([]models.BrandResponse, len(brands))
	for i, b := range brands {
		brandResponses[i] = b.ToResponse()
	}

	// Categories
	categories, err := s.categoryRepo.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	categoryResponses := make([]models.CategoryResponse, len(categories))
	for i, c := range categories {
		categoryResponses[i] = c.ToResponse(lang)
	}

	// New products
	newProducts, err := s.productRepo.GetNew(ctx, 20)
	if err != nil {
		return nil, err
	}
	newProductResponses := make([]models.ProductResponse, len(newProducts))
	for i, p := range newProducts {
		newProductResponses[i] = p.ToResponse(lang)
	}

	// Discount products
	discountProducts, err := s.productRepo.GetDiscounted(ctx, 20)
	if err != nil {
		return nil, err
	}
	discountProductResponses := make([]models.ProductResponse, len(discountProducts))
	for i, p := range discountProducts {
		discountProductResponses[i] = p.ToResponse(lang)
	}

	return &HomeData{
		Banners:          bannerResponses,
		Brands:           brandResponses,
		Categories:       categoryResponses,
		NewProducts:      newProductResponses,
		DiscountProducts: discountProductResponses,
	}, nil
}
