package repository

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/meransoft/commerce-backend/internal/models"
)

type OrderRepo struct {
	db *sqlx.DB
}

func NewOrderRepo(db *sqlx.DB) *OrderRepo {
	return &OrderRepo{db: db}
}

func (r *OrderRepo) Create(ctx context.Context, order *models.Order, items []models.OrderItem) error {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Generate order number: ORD-YYYYMMDD-XXXX
	var seq int
	err = tx.GetContext(ctx, &seq, "SELECT COUNT(*) + 1 FROM orders WHERE DATE(created_at) = CURRENT_DATE")
	if err != nil {
		return err
	}
	order.OrderNumber = fmt.Sprintf("ORD-%s-%04d", time.Now().Format("20060102"), seq)

	orderQuery := `INSERT INTO orders (order_number, type, status, full_name, phone, address, note,
		delivery_zone_id, delivery_date, time_slot, subtotal, delivery_fee, total)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id, created_at, updated_at`
	err = tx.QueryRowxContext(ctx, orderQuery,
		order.OrderNumber, order.Type, order.Status, order.FullName, order.Phone,
		order.Address, order.Note, order.DeliveryZoneID, order.DeliveryDate,
		order.TimeSlot, order.Subtotal, order.DeliveryFee, order.Total,
	).Scan(&order.ID, &order.CreatedAt, &order.UpdatedAt)
	if err != nil {
		return err
	}

	itemQuery := `INSERT INTO order_items (order_id, product_id, product_name, product_image_url, quantity, price, total)
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
	for i := range items {
		items[i].OrderID = order.ID
		err = tx.QueryRowxContext(ctx, itemQuery,
			items[i].OrderID, items[i].ProductID, items[i].ProductName,
			items[i].ProductImageUrl, items[i].Quantity, items[i].Price, items[i].Total,
		).Scan(&items[i].ID)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (r *OrderRepo) GetByID(ctx context.Context, id int) (*models.OrderWithItems, error) {
	var order models.Order
	err := r.db.GetContext(ctx, &order, "SELECT * FROM orders WHERE id = $1", id)
	if err != nil {
		return nil, err
	}

	var items []models.OrderItem
	err = r.db.SelectContext(ctx, &items, "SELECT * FROM order_items WHERE order_id = $1", id)
	if err != nil {
		return nil, err
	}

	return &models.OrderWithItems{Order: order, Items: items}, nil
}

func (r *OrderRepo) GetByPhone(ctx context.Context, phone string) ([]models.Order, error) {
	var orders []models.Order
	err := r.db.SelectContext(ctx, &orders, "SELECT * FROM orders WHERE phone = $1 ORDER BY created_at DESC", phone)
	return orders, err
}

func (r *OrderRepo) AdminGetAll(ctx context.Context, filters models.OrderFilters, page, limit int) ([]models.Order, int, error) {
	where := []string{"1=1"}
	args := []interface{}{}
	argIdx := 1

	if filters.Status != "" {
		where = append(where, fmt.Sprintf("status = $%d", argIdx))
		args = append(args, filters.Status)
		argIdx++
	}
	if filters.Type != "" {
		where = append(where, fmt.Sprintf("type = $%d", argIdx))
		args = append(args, filters.Type)
		argIdx++
	}
	if filters.Phone != "" {
		where = append(where, fmt.Sprintf("phone = $%d", argIdx))
		args = append(args, filters.Phone)
		argIdx++
	}
	if filters.Search != "" {
		where = append(where, fmt.Sprintf("(full_name ILIKE $%d OR order_number ILIKE $%d)", argIdx, argIdx))
		args = append(args, "%"+filters.Search+"%")
		argIdx++
	}
	if filters.DateFrom != "" {
		where = append(where, fmt.Sprintf("created_at >= $%d", argIdx))
		args = append(args, filters.DateFrom)
		argIdx++
	}
	if filters.DateTo != "" {
		where = append(where, fmt.Sprintf("created_at <= $%d", argIdx))
		args = append(args, filters.DateTo)
		argIdx++
	}

	whereClause := strings.Join(where, " AND ")

	var total int
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM orders WHERE %s", whereClause)
	if err := r.db.GetContext(ctx, &total, countQuery, args...); err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	query := fmt.Sprintf("SELECT * FROM orders WHERE %s ORDER BY created_at DESC LIMIT $%d OFFSET $%d",
		whereClause, argIdx, argIdx+1)
	args = append(args, limit, offset)

	var orders []models.Order
	if err := r.db.SelectContext(ctx, &orders, query, args...); err != nil {
		return nil, 0, err
	}
	return orders, total, nil
}

func (r *OrderRepo) UpdateStatus(ctx context.Context, id int, status models.OrderStatus) error {
	_, err := r.db.ExecContext(ctx, "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2", status, id)
	return err
}
