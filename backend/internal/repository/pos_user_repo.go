package repository

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/meransoft/commerce-backend/internal/models"
)

type POSUserRepo struct {
	db *sqlx.DB
}

func NewPOSUserRepo(db *sqlx.DB) *POSUserRepo {
	return &POSUserRepo{db: db}
}

func (r *POSUserRepo) GetAll(ctx context.Context) ([]models.POSUser, error) {
	var users []models.POSUser
	err := r.db.SelectContext(ctx, &users, "SELECT * FROM pos_users ORDER BY id DESC")
	return users, err
}

func (r *POSUserRepo) GetByID(ctx context.Context, id int) (*models.POSUser, error) {
	var user models.POSUser
	err := r.db.GetContext(ctx, &user, "SELECT * FROM pos_users WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *POSUserRepo) GetByUsername(ctx context.Context, username string) (*models.POSUser, error) {
	var user models.POSUser
	err := r.db.GetContext(ctx, &user, "SELECT * FROM pos_users WHERE username = $1", username)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *POSUserRepo) Create(ctx context.Context, u *models.POSUser) error {
	query := `INSERT INTO pos_users (username, password_hash, is_active) 
		VALUES ($1, $2, $3) RETURNING id, created_at`
	return r.db.QueryRowxContext(ctx, query,
		u.Username, u.PasswordHash, u.IsActive,
	).Scan(&u.ID, &u.CreatedAt)
}

func (r *POSUserRepo) Update(ctx context.Context, u *models.POSUser) error {
	query := `UPDATE pos_users SET username=$1, password_hash=$2, is_active=$3 WHERE id=$4`
	_, err := r.db.ExecContext(ctx, query,
		u.Username, u.PasswordHash, u.IsActive, u.ID)
	return err
}

func (r *POSUserRepo) Delete(ctx context.Context, id int) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM pos_users WHERE id = $1", id)
	return err
}
