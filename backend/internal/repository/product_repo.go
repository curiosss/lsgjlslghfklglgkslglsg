package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/meransoft/commerce-backend/internal/models"
)

type ProductRepo struct {
	db *sqlx.DB
}

func NewProductRepo(db *sqlx.DB) *ProductRepo {
	return &ProductRepo{db: db}
}

const productSelectBase = `SELECT p.*, b.name AS brand_name FROM products p LEFT JOIN brands b ON p.brand_id = b.id`

func (r *ProductRepo) GetAll(ctx context.Context, filters models.ProductFilters, page, limit int) ([]models.Product, int, error) {
	where := []string{"p.is_active = true"}
	args := []interface{}{}
	argIdx := 1

	if filters.CategoryID != nil {
		where = append(where, fmt.Sprintf("p.category_id = $%d", argIdx))
		args = append(args, *filters.CategoryID)
		argIdx++
	}
	if filters.SubCategoryID != nil {
		where = append(where, fmt.Sprintf("p.subcategory_id = $%d", argIdx))
		args = append(args, *filters.SubCategoryID)
		argIdx++
	}
	if filters.BrandID != nil {
		where = append(where, fmt.Sprintf("p.brand_id = $%d", argIdx))
		args = append(args, *filters.BrandID)
		argIdx++
	}
	if filters.Search != "" {
		where = append(where, fmt.Sprintf("(p.name_ru ILIKE $%d OR p.name_tm ILIKE $%d OR p.name_en ILIKE $%d)", argIdx, argIdx, argIdx))
		args = append(args, "%"+filters.Search+"%")
		argIdx++
	}
	if filters.IsNew != nil && *filters.IsNew {
		where = append(where, "p.is_new = true")
	}
	if filters.IsDiscount != nil && *filters.IsDiscount {
		where = append(where, "p.is_discount = true")
	}

	whereClause := strings.Join(where, " AND ")

	// Count
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM products p WHERE %s", whereClause)
	var total int
	if err := r.db.GetContext(ctx, &total, countQuery, args...); err != nil {
		return nil, 0, err
	}

	// Sort
	orderBy := "p.sort_order ASC, p.id DESC"
	switch filters.Sort {
	case "price_asc":
		orderBy = "p.price ASC"
	case "price_desc":
		orderBy = "p.price DESC"
	case "newest":
		orderBy = "p.created_at DESC"
	case "name_asc":
		orderBy = "p.name_ru ASC"
	}

	offset := (page - 1) * limit
	query := fmt.Sprintf("%s WHERE %s ORDER BY %s LIMIT $%d OFFSET $%d",
		productSelectBase, whereClause, orderBy, argIdx, argIdx+1)
	args = append(args, limit, offset)

	var products []models.Product
	if err := r.db.SelectContext(ctx, &products, query, args...); err != nil {
		return nil, 0, err
	}
	return products, total, nil
}

func (r *ProductRepo) AdminGetAll(ctx context.Context, filters models.ProductFilters, page, limit int) ([]models.Product, int, error) {
	where := []string{"1=1"}
	args := []interface{}{}
	argIdx := 1

	if filters.CategoryID != nil {
		where = append(where, fmt.Sprintf("p.category_id = $%d", argIdx))
		args = append(args, *filters.CategoryID)
		argIdx++
	}
	if filters.SubCategoryID != nil {
		where = append(where, fmt.Sprintf("p.subcategory_id = $%d", argIdx))
		args = append(args, *filters.SubCategoryID)
		argIdx++
	}
	if filters.BrandID != nil {
		where = append(where, fmt.Sprintf("p.brand_id = $%d", argIdx))
		args = append(args, *filters.BrandID)
		argIdx++
	}
	if filters.Search != "" {
		where = append(where, fmt.Sprintf("(p.name_ru ILIKE $%d OR p.name_tm ILIKE $%d OR p.name_en ILIKE $%d)", argIdx, argIdx, argIdx))
		args = append(args, "%"+filters.Search+"%")
		argIdx++
	}

	whereClause := strings.Join(where, " AND ")

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM products p WHERE %s", whereClause)
	var total int
	if err := r.db.GetContext(ctx, &total, countQuery, args...); err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	query := fmt.Sprintf("%s WHERE %s ORDER BY p.id DESC LIMIT $%d OFFSET $%d",
		productSelectBase, whereClause, argIdx, argIdx+1)
	args = append(args, limit, offset)

	var products []models.Product
	if err := r.db.SelectContext(ctx, &products, query, args...); err != nil {
		return nil, 0, err
	}
	return products, total, nil
}

func (r *ProductRepo) GetByID(ctx context.Context, id int) (*models.Product, error) {
	var product models.Product
	err := r.db.GetContext(ctx, &product, productSelectBase+" WHERE p.id = $1", id)
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepo) GetNew(ctx context.Context, limit int) ([]models.Product, error) {
	var products []models.Product
	err := r.db.SelectContext(ctx, &products,
		productSelectBase+" WHERE p.is_active = true AND p.is_new = true ORDER BY p.created_at DESC LIMIT $1", limit)
	return products, err
}

func (r *ProductRepo) GetDiscounted(ctx context.Context, limit int) ([]models.Product, error) {
	var products []models.Product
	err := r.db.SelectContext(ctx, &products,
		productSelectBase+" WHERE p.is_active = true AND p.is_discount = true ORDER BY p.created_at DESC LIMIT $1", limit)
	return products, err
}

func (r *ProductRepo) GetRelated(ctx context.Context, productID int, limit int) ([]models.Product, error) {
	// Get same category products, exclude current product, random order
	var products []models.Product
	err := r.db.SelectContext(ctx, &products,
		productSelectBase+` WHERE p.is_active = true AND p.id != $1
		AND p.category_id = (SELECT category_id FROM products WHERE id = $1)
		ORDER BY RANDOM() LIMIT $2`, productID, limit)
	return products, err
}

func (r *ProductRepo) Create(ctx context.Context, p *models.Product) error {
	query := `INSERT INTO products (name_ru, name_tm, name_en, brand_id, category_id, subcategory_id, description_ru, description_tm, description_en,
		price, old_price, discount_percent, image_url, images, barcode, is_active, is_new, is_discount, sort_order)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id, created_at, updated_at`
	return r.db.QueryRowxContext(ctx, query,
		p.NameRu, p.NameTm, p.NameEn, p.BrandID, p.CategoryID, p.SubCategoryID,
		p.DescriptionRu, p.DescriptionTm, p.DescriptionEn,
		p.Price, p.OldPrice, p.DiscountPercent,
		p.ImageUrl, p.Images, p.Barcode,
		p.IsActive, p.IsNew, p.IsDiscount, p.SortOrder,
	).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
}

func (r *ProductRepo) Update(ctx context.Context, p *models.Product) error {
	query := `UPDATE products SET name_ru=$1, name_tm=$2, name_en=$3, brand_id=$4, category_id=$5, subcategory_id=$6,
		description_ru=$7, description_tm=$8, description_en=$9, price=$10, old_price=$11, discount_percent=$12,
		image_url=$13, images=$14, barcode=$15, is_active=$16, is_new=$17, is_discount=$18, sort_order=$19,
		updated_at=NOW() WHERE id=$20`
	_, err := r.db.ExecContext(ctx, query,
		p.NameRu, p.NameTm, p.NameEn, p.BrandID, p.CategoryID, p.SubCategoryID,
		p.DescriptionRu, p.DescriptionTm, p.DescriptionEn,
		p.Price, p.OldPrice, p.DiscountPercent,
		p.ImageUrl, p.Images, p.Barcode,
		p.IsActive, p.IsNew, p.IsDiscount, p.SortOrder, p.ID)
	return err
}

func (r *ProductRepo) Delete(ctx context.Context, id int) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM products WHERE id = $1", id)
	return err
}
