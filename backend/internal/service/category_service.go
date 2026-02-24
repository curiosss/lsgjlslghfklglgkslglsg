package service

import (
	"context"
	"errors"

	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
)

type CategoryService struct {
	repo *repository.CategoryRepo
}

func NewCategoryService(repo *repository.CategoryRepo) *CategoryService {
	return &CategoryService{repo: repo}
}

// ── Public ──

func (s *CategoryService) GetAll(ctx context.Context, lang string) ([]models.CategoryResponse, error) {
	categories, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	allSubs, err := s.repo.GetAllSubcategories(ctx)
	if err != nil {
		return nil, err
	}

	// Group subcategories by parent_id
	subsByParent := make(map[int][]models.SubCategory)
	for _, sub := range allSubs {
		subsByParent[sub.ParentID] = append(subsByParent[sub.ParentID], sub)
	}

	responses := make([]models.CategoryResponse, len(categories))
	for i, cat := range categories {
		resp := cat.ToResponse(lang)
		if subs, ok := subsByParent[cat.ID]; ok {
			subResponses := make([]models.SubCategoryResponse, len(subs))
			for j, sub := range subs {
				subResponses[j] = sub.ToResponse(lang)
			}
			resp.SubCategories = subResponses
		}
		responses[i] = resp
	}
	return responses, nil
}

func (s *CategoryService) GetSubcategories(ctx context.Context, categoryID int, lang string) ([]models.SubCategoryResponse, error) {
	subs, err := s.repo.GetSubcategoriesByCategoryID(ctx, categoryID)
	if err != nil {
		return nil, err
	}
	responses := make([]models.SubCategoryResponse, len(subs))
	for i, sub := range subs {
		responses[i] = sub.ToResponse(lang)
	}
	return responses, nil
}

// ── Admin ──

func (s *CategoryService) AdminGetAll(ctx context.Context) ([]models.Category, error) {
	return s.repo.AdminGetAll(ctx)
}

func (s *CategoryService) CreateCategory(ctx context.Context, req models.CreateCategoryRequest) (*models.Category, error) {
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}
	cat := &models.Category{
		NameRu:    req.NameRu,
		NameTm:    req.NameTm,
		ImageUrl:  req.ImageUrl,
		SortOrder: req.SortOrder,
		IsActive:  isActive,
	}
	if err := s.repo.Create(ctx, cat); err != nil {
		return nil, err
	}
	return cat, nil
}

func (s *CategoryService) UpdateCategory(ctx context.Context, id int, req models.UpdateCategoryRequest) (*models.Category, error) {
	cat, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("category not found")
	}
	if req.NameRu != nil {
		cat.NameRu = *req.NameRu
	}
	if req.NameTm != nil {
		cat.NameTm = *req.NameTm
	}
	if req.ImageUrl != nil {
		cat.ImageUrl = req.ImageUrl
	}
	if req.SortOrder != nil {
		cat.SortOrder = *req.SortOrder
	}
	if req.IsActive != nil {
		cat.IsActive = *req.IsActive
	}
	if err := s.repo.Update(ctx, cat); err != nil {
		return nil, err
	}
	return cat, nil
}

func (s *CategoryService) DeleteCategory(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}

// ── SubCategories ──

func (s *CategoryService) CreateSubCategory(ctx context.Context, req models.CreateSubCategoryRequest) (*models.SubCategory, error) {
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}
	sub := &models.SubCategory{
		ParentID:  req.ParentID,
		NameRu:    req.NameRu,
		NameTm:    req.NameTm,
		ImageUrl:  req.ImageUrl,
		SortOrder: req.SortOrder,
		IsActive:  isActive,
	}
	if err := s.repo.CreateSubCategory(ctx, sub); err != nil {
		return nil, err
	}
	_ = s.repo.UpdateHasSubCategories(ctx, sub.ParentID)
	return sub, nil
}

func (s *CategoryService) UpdateSubCategory(ctx context.Context, id int, req models.UpdateSubCategoryRequest) (*models.SubCategory, error) {
	sub, err := s.repo.GetSubCategoryByID(ctx, id)
	if err != nil {
		return nil, errors.New("subcategory not found")
	}
	if req.NameRu != nil {
		sub.NameRu = *req.NameRu
	}
	if req.NameTm != nil {
		sub.NameTm = *req.NameTm
	}
	if req.ImageUrl != nil {
		sub.ImageUrl = req.ImageUrl
	}
	if req.SortOrder != nil {
		sub.SortOrder = *req.SortOrder
	}
	if req.IsActive != nil {
		sub.IsActive = *req.IsActive
	}
	if err := s.repo.UpdateSubCategory(ctx, sub); err != nil {
		return nil, err
	}
	return sub, nil
}

func (s *CategoryService) DeleteSubCategory(ctx context.Context, id int) error {
	sub, err := s.repo.GetSubCategoryByID(ctx, id)
	if err != nil {
		return errors.New("subcategory not found")
	}
	parentID := sub.ParentID
	if err := s.repo.DeleteSubCategory(ctx, id); err != nil {
		return err
	}
	_ = s.repo.UpdateHasSubCategories(ctx, parentID)
	return nil
}
