package repository

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/meransoft/commerce-backend/internal/models"
)

type CategoryRepo struct {
	db *sqlx.DB
}

func NewCategoryRepo(db *sqlx.DB) *CategoryRepo {
	return &CategoryRepo{db: db}
}

// ── Categories ──

func (r *CategoryRepo) GetAll(ctx context.Context) ([]models.Category, error) {
	var categories []models.Category
	err := r.db.SelectContext(ctx, &categories, "SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC, id ASC")
	return categories, err
}

func (r *CategoryRepo) AdminGetAll(ctx context.Context) ([]models.Category, error) {
	var categories []models.Category
	err := r.db.SelectContext(ctx, &categories, "SELECT * FROM categories ORDER BY sort_order ASC, id ASC")
	return categories, err
}

func (r *CategoryRepo) GetByID(ctx context.Context, id int) (*models.Category, error) {
	var category models.Category
	err := r.db.GetContext(ctx, &category, "SELECT * FROM categories WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *CategoryRepo) Create(ctx context.Context, c *models.Category) error {
	query := `INSERT INTO categories (name_ru, name_tm, name_en, image_url, sort_order, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`
	return r.db.QueryRowxContext(ctx, query, c.NameRu, c.NameTm, c.NameEn, c.ImageUrl, c.SortOrder, c.IsActive).Scan(&c.ID, &c.CreatedAt)
}

func (r *CategoryRepo) Update(ctx context.Context, c *models.Category) error {
	query := `UPDATE categories SET name_ru=$1, name_tm=$2, name_en=$3, image_url=$4, sort_order=$5, is_active=$6 WHERE id=$7`
	_, err := r.db.ExecContext(ctx, query, c.NameRu, c.NameTm, c.NameEn, c.ImageUrl, c.SortOrder, c.IsActive, c.ID)
	return err
}

func (r *CategoryRepo) Delete(ctx context.Context, id int) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM categories WHERE id = $1", id)
	return err
}

func (r *CategoryRepo) UpdateHasSubCategories(ctx context.Context, categoryID int) error {
	query := `UPDATE categories SET has_subcategories = (SELECT COUNT(*) > 0 FROM subcategories WHERE parent_id = $1) WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, categoryID)
	return err
}

// ── SubCategories ──

func (r *CategoryRepo) GetSubcategoriesByCategoryID(ctx context.Context, categoryID int) ([]models.SubCategory, error) {
	var subs []models.SubCategory
	err := r.db.SelectContext(ctx, &subs,
		"SELECT * FROM subcategories WHERE parent_id = $1 AND is_active = true ORDER BY sort_order ASC, id ASC", categoryID)
	return subs, err
}

func (r *CategoryRepo) GetAllSubcategories(ctx context.Context) ([]models.SubCategory, error) {
	var subs []models.SubCategory
	err := r.db.SelectContext(ctx, &subs, "SELECT * FROM subcategories WHERE is_active = true ORDER BY sort_order ASC, id ASC")
	return subs, err
}

func (r *CategoryRepo) GetSubCategoryByID(ctx context.Context, id int) (*models.SubCategory, error) {
	var sub models.SubCategory
	err := r.db.GetContext(ctx, &sub, "SELECT * FROM subcategories WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &sub, nil
}

func (r *CategoryRepo) CreateSubCategory(ctx context.Context, s *models.SubCategory) error {
	query := `INSERT INTO subcategories (parent_id, name_ru, name_tm, name_en, image_url, sort_order, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
	return r.db.QueryRowxContext(ctx, query, s.ParentID, s.NameRu, s.NameTm, s.NameEn, s.ImageUrl, s.SortOrder, s.IsActive).Scan(&s.ID)
}

func (r *CategoryRepo) UpdateSubCategory(ctx context.Context, s *models.SubCategory) error {
	query := `UPDATE subcategories SET name_ru=$1, name_tm=$2, name_en=$3, image_url=$4, sort_order=$5, is_active=$6 WHERE id=$7`
	_, err := r.db.ExecContext(ctx, query, s.NameRu, s.NameTm, s.NameEn, s.ImageUrl, s.SortOrder, s.IsActive, s.ID)
	return err
}

func (r *CategoryRepo) DeleteSubCategory(ctx context.Context, id int) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM subcategories WHERE id = $1", id)
	return err
}
