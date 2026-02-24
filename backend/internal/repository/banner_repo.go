package repository

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/meransoft/commerce-backend/internal/models"
)

type BannerRepo struct {
	db *sqlx.DB
}

func NewBannerRepo(db *sqlx.DB) *BannerRepo {
	return &BannerRepo{db: db}
}

func (r *BannerRepo) GetAll(ctx context.Context) ([]models.Banner, error) {
	var banners []models.Banner
	err := r.db.SelectContext(ctx, &banners, "SELECT * FROM banners WHERE is_active = true ORDER BY sort_order ASC, id ASC")
	return banners, err
}

func (r *BannerRepo) AdminGetAll(ctx context.Context) ([]models.Banner, error) {
	var banners []models.Banner
	err := r.db.SelectContext(ctx, &banners, "SELECT * FROM banners ORDER BY sort_order ASC, id ASC")
	return banners, err
}

func (r *BannerRepo) GetByID(ctx context.Context, id int) (*models.Banner, error) {
	var banner models.Banner
	err := r.db.GetContext(ctx, &banner, "SELECT * FROM banners WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &banner, nil
}

func (r *BannerRepo) Create(ctx context.Context, b *models.Banner) error {
	query := `INSERT INTO banners (image_url, link_type, link_value, sort_order, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`
	return r.db.QueryRowxContext(ctx, query, b.ImageUrl, b.LinkType, b.LinkValue, b.SortOrder, b.IsActive).Scan(&b.ID, &b.CreatedAt)
}

func (r *BannerRepo) Update(ctx context.Context, b *models.Banner) error {
	query := `UPDATE banners SET image_url=$1, link_type=$2, link_value=$3, sort_order=$4, is_active=$5 WHERE id=$6`
	_, err := r.db.ExecContext(ctx, query, b.ImageUrl, b.LinkType, b.LinkValue, b.SortOrder, b.IsActive, b.ID)
	return err
}

func (r *BannerRepo) Delete(ctx context.Context, id int) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM banners WHERE id = $1", id)
	return err
}
