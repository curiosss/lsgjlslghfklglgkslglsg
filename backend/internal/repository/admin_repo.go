package repository

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/meransoft/commerce-backend/internal/models"
)

type AdminRepo struct {
	db *sqlx.DB
}

func NewAdminRepo(db *sqlx.DB) *AdminRepo {
	return &AdminRepo{db: db}
}

func (r *AdminRepo) GetByUsername(ctx context.Context, username string) (*models.Admin, error) {
	var admin models.Admin
	err := r.db.GetContext(ctx, &admin, "SELECT * FROM admins WHERE username = $1 AND is_active = true", username)
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *AdminRepo) GetByID(ctx context.Context, id int) (*models.Admin, error) {
	var admin models.Admin
	err := r.db.GetContext(ctx, &admin, "SELECT * FROM admins WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *AdminRepo) GetAll(ctx context.Context) ([]models.Admin, error) {
	var admins []models.Admin
	err := r.db.SelectContext(ctx, &admins, "SELECT * FROM admins ORDER BY id ASC")
	if err != nil {
		return nil, err
	}
	return admins, nil
}

func (r *AdminRepo) Create(ctx context.Context, admin *models.Admin) error {
	query := `INSERT INTO admins (username, password_hash, full_name, role, is_active)
              VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`
	return r.db.QueryRowxContext(ctx, query,
		admin.Username, admin.PasswordHash, admin.FullName, admin.Role, admin.IsActive,
	).Scan(&admin.ID, &admin.CreatedAt)
}

func (r *AdminRepo) Update(ctx context.Context, admin *models.Admin) error {
	query := `UPDATE admins SET username = $1, password_hash = $2, full_name = $3, role = $4, is_active = $5 WHERE id = $6`
	_, err := r.db.ExecContext(ctx, query,
		admin.Username, admin.PasswordHash, admin.FullName, admin.Role, admin.IsActive, admin.ID,
	)
	return err
}

func (r *AdminRepo) Delete(ctx context.Context, id int) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM admins WHERE id = $1", id)
	return err
}

func (r *AdminRepo) Count(ctx context.Context) (int, error) {
	var count int
	err := r.db.GetContext(ctx, &count, "SELECT COUNT(*) FROM admins")
	return count, err
}
