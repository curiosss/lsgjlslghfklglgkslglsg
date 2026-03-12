package service

import (
	"context"
	"errors"

	"github.com/lib/pq"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
)

type ProductService struct {
	repo *repository.ProductRepo
}

func NewProductService(repo *repository.ProductRepo) *ProductService {
	return &ProductService{repo: repo}
}

func (s *ProductService) GetAll(ctx context.Context, filters models.ProductFilters, lang string, page, limit int) ([]models.ProductResponse, int, error) {
	products, total, err := s.repo.GetAll(ctx, filters, page, limit)
	if err != nil {
		return nil, 0, err
	}
	responses := make([]models.ProductResponse, len(products))
	for i, p := range products {
		responses[i] = p.ToResponse(lang)
	}
	return responses, total, nil
}

func (s *ProductService) AdminGetAll(ctx context.Context, filters models.ProductFilters, page, limit int) ([]models.Product, int, error) {
	return s.repo.AdminGetAll(ctx, filters, page, limit)
}

func (s *ProductService) GetByID(ctx context.Context, id int, lang string) (*models.ProductResponse, error) {
	product, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("product not found")
	}
	resp := product.ToResponse(lang)
	return &resp, nil
}

func (s *ProductService) AdminGetByID(ctx context.Context, id int) (*models.Product, error) {
	product, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("product not found")
	}
	return product, nil
}

func (s *ProductService) GetRelated(ctx context.Context, id int, lang string, limit int) ([]models.ProductResponse, error) {
	if limit <= 0 {
		limit = 10
	}
	products, err := s.repo.GetRelated(ctx, id, limit)
	if err != nil {
		return nil, err
	}
	responses := make([]models.ProductResponse, len(products))
	for i, p := range products {
		responses[i] = p.ToResponse(lang)
	}
	return responses, nil
}

func (s *ProductService) Create(ctx context.Context, req models.CreateProductRequest) (*models.Product, error) {
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}
	isNew := false
	if req.IsNew != nil {
		isNew = *req.IsNew
	}
	isDiscount := false
	if req.IsDiscount != nil {
		isDiscount = *req.IsDiscount
	}

	product := &models.Product{
		NameRu:          req.NameRu,
		NameTm:          req.NameTm,
		NameEn:          req.NameEn,
		BrandID:         req.BrandID,
		CategoryID:      req.CategoryID,
		SubCategoryID:   req.SubCategoryID,
		DescriptionRu:   req.DescriptionRu,
		DescriptionTm:   req.DescriptionTm,
		DescriptionEn:   req.DescriptionEn,
		Price:           req.Price,
		OldPrice:        req.OldPrice,
		DiscountPercent: req.DiscountPercent,
		ImageUrl:        req.ImageUrl,
		Images:          pq.StringArray(req.Images),
		Barcode:         req.Barcode,
		IsActive:        isActive,
		IsNew:           isNew,
		IsDiscount:      isDiscount,
		SortOrder:       req.SortOrder,
	}
	if err := s.repo.Create(ctx, product); err != nil {
		return nil, err
	}
	return product, nil
}

func (s *ProductService) Update(ctx context.Context, id int, req models.UpdateProductRequest) (*models.Product, error) {
	product, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("product not found")
	}
	if req.NameRu != nil {
		product.NameRu = *req.NameRu
	}
	if req.NameTm != nil {
		product.NameTm = *req.NameTm
	}
	if req.NameEn != nil {
		product.NameEn = *req.NameEn
	}
	if req.BrandID != nil {
		product.BrandID = req.BrandID
	}
	if req.CategoryID != nil {
		product.CategoryID = req.CategoryID
	}
	if req.SubCategoryID != nil {
		product.SubCategoryID = req.SubCategoryID
	}
	if req.DescriptionRu != nil {
		product.DescriptionRu = req.DescriptionRu
	}
	if req.DescriptionTm != nil {
		product.DescriptionTm = req.DescriptionTm
	}
	if req.DescriptionEn != nil {
		product.DescriptionEn = req.DescriptionEn
	}
	if req.Price != nil {
		product.Price = *req.Price
	}
	if req.OldPrice != nil {
		product.OldPrice = req.OldPrice
	}
	if req.DiscountPercent != nil {
		product.DiscountPercent = req.DiscountPercent
	}
	if req.ImageUrl != nil {
		product.ImageUrl = *req.ImageUrl
	}
	if req.Images != nil {
		product.Images = pq.StringArray(req.Images)
	}
	if req.Barcode != nil {
		product.Barcode = req.Barcode
	}
	if req.IsActive != nil {
		product.IsActive = *req.IsActive
	}
	if req.IsNew != nil {
		product.IsNew = *req.IsNew
	}
	if req.IsDiscount != nil {
		product.IsDiscount = *req.IsDiscount
	}
	if req.SortOrder != nil {
		product.SortOrder = *req.SortOrder
	}
	if err := s.repo.Update(ctx, product); err != nil {
		return nil, err
	}
	return product, nil
}

func (s *ProductService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}
