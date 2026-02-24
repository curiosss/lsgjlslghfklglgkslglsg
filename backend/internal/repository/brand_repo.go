package repository

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/meransoft/commerce-backend/internal/models"
)

type BrandRepo struct {
	db *sqlx.DB
}

func NewBrandRepo(db *sqlx.DB) *BrandRepo {
	return &BrandRepo{db: db}
}

func (r *BrandRepo) GetAll(ctx context.Context, search string) ([]models.Brand, error) {
	var brands []models.Brand
	if search != "" {
		err := r.db.SelectContext(ctx, &brands,
			"SELECT * FROM brands WHERE is_active = true AND name ILIKE $1 ORDER BY sort_order ASC, id ASC",
			"%"+search+"%")
		return brands, err
	}
	err := r.db.SelectContext(ctx, &brands, "SELECT * FROM brands WHERE is_active = true ORDER BY sort_order ASC, id ASC")
	return brands, err
}

func (r *BrandRepo) AdminGetAll(ctx context.Context) ([]models.Brand, error) {
	var brands []models.Brand
	err := r.db.SelectContext(ctx, &brands, "SELECT * FROM brands ORDER BY sort_order ASC, id ASC")
	return brands, err
}

func (r *BrandRepo) GetByID(ctx context.Context, id int) (*models.Brand, error) {
	var brand models.Brand
	err := r.db.GetContext(ctx, &brand, "SELECT * FROM brands WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &brand, nil
}

func (r *BrandRepo) Create(ctx context.Context, b *models.Brand) error {
	query := `INSERT INTO brands (name, logo_url, sort_order, is_active) VALUES ($1, $2, $3, $4) RETURNING id, created_at`
	return r.db.QueryRowxContext(ctx, query, b.Name, b.LogoUrl, b.SortOrder, b.IsActive).Scan(&b.ID, &b.CreatedAt)
}

func (r *BrandRepo) Update(ctx context.Context, b *models.Brand) error {
	query := `UPDATE brands SET name=$1, logo_url=$2, sort_order=$3, is_active=$4 WHERE id=$5`
	_, err := r.db.ExecContext(ctx, query, b.Name, b.LogoUrl, b.SortOrder, b.IsActive, b.ID)
	return err
}

func (r *BrandRepo) Delete(ctx context.Context, id int) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM brands WHERE id = $1", id)
	return err
}
