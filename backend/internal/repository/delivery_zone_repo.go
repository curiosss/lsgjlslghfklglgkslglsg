package repository

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/meransoft/commerce-backend/internal/models"
)

type DeliveryZoneRepo struct {
	db *sqlx.DB
}

func NewDeliveryZoneRepo(db *sqlx.DB) *DeliveryZoneRepo {
	return &DeliveryZoneRepo{db: db}
}

func (r *DeliveryZoneRepo) GetAll(ctx context.Context) ([]models.DeliveryZone, error) {
	var zones []models.DeliveryZone
	err := r.db.SelectContext(ctx, &zones, "SELECT * FROM delivery_zones WHERE is_active = true ORDER BY id ASC")
	return zones, err
}

func (r *DeliveryZoneRepo) AdminGetAll(ctx context.Context) ([]models.DeliveryZone, error) {
	var zones []models.DeliveryZone
	err := r.db.SelectContext(ctx, &zones, "SELECT * FROM delivery_zones ORDER BY id ASC")
	return zones, err
}

func (r *DeliveryZoneRepo) GetByID(ctx context.Context, id int) (*models.DeliveryZone, error) {
	var zone models.DeliveryZone
	err := r.db.GetContext(ctx, &zone, "SELECT * FROM delivery_zones WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &zone, nil
}

func (r *DeliveryZoneRepo) Create(ctx context.Context, z *models.DeliveryZone) error {
	query := `INSERT INTO delivery_zones (name_ru, name_tm, delivery_price, is_active) VALUES ($1, $2, $3, $4) RETURNING id`
	return r.db.QueryRowxContext(ctx, query, z.NameRu, z.NameTm, z.DeliveryPrice, z.IsActive).Scan(&z.ID)
}

func (r *DeliveryZoneRepo) Update(ctx context.Context, z *models.DeliveryZone) error {
	query := `UPDATE delivery_zones SET name_ru=$1, name_tm=$2, delivery_price=$3, is_active=$4 WHERE id=$5`
	_, err := r.db.ExecContext(ctx, query, z.NameRu, z.NameTm, z.DeliveryPrice, z.IsActive, z.ID)
	return err
}

func (r *DeliveryZoneRepo) Delete(ctx context.Context, id int) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM delivery_zones WHERE id = $1", id)
	return err
}
