package repository

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/meransoft/commerce-backend/internal/models"
)

type TimeSlotRepo struct {
	db *sqlx.DB
}

func NewTimeSlotRepo(db *sqlx.DB) *TimeSlotRepo {
	return &TimeSlotRepo{db: db}
}

func (r *TimeSlotRepo) GetAll(ctx context.Context) ([]models.TimeSlot, error) {
	var slots []models.TimeSlot
	err := r.db.SelectContext(ctx, &slots, "SELECT * FROM time_slots WHERE is_active = true ORDER BY start_time ASC")
	return slots, err
}

func (r *TimeSlotRepo) AdminGetAll(ctx context.Context) ([]models.TimeSlot, error) {
	var slots []models.TimeSlot
	err := r.db.SelectContext(ctx, &slots, "SELECT * FROM time_slots ORDER BY start_time ASC")
	return slots, err
}

func (r *TimeSlotRepo) GetByID(ctx context.Context, id int) (*models.TimeSlot, error) {
	var slot models.TimeSlot
	err := r.db.GetContext(ctx, &slot, "SELECT * FROM time_slots WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &slot, nil
}

func (r *TimeSlotRepo) Create(ctx context.Context, s *models.TimeSlot) error {
	query := `INSERT INTO time_slots (start_time, end_time, label, is_active) VALUES ($1, $2, $3, $4) RETURNING id`
	return r.db.QueryRowxContext(ctx, query, s.StartTime, s.EndTime, s.Label, s.IsActive).Scan(&s.ID)
}

func (r *TimeSlotRepo) Update(ctx context.Context, s *models.TimeSlot) error {
	query := `UPDATE time_slots SET start_time=$1, end_time=$2, label=$3, is_active=$4 WHERE id=$5`
	_, err := r.db.ExecContext(ctx, query, s.StartTime, s.EndTime, s.Label, s.IsActive, s.ID)
	return err
}

func (r *TimeSlotRepo) Delete(ctx context.Context, id int) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM time_slots WHERE id = $1", id)
	return err
}
