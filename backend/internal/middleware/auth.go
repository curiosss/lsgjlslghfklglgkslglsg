package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type Claims struct {
	AdminID  int              `json:"admin_id"`
	Username string           `json:"username"`
	Role     models.AdminRole `json:"role"`
	jwt.RegisteredClaims
}

func Auth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			utils.ErrorResponse(c, http.StatusUnauthorized, "UNAUTHORIZED", "Missing authorization header")
			c.Abort()
			return
		}

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			utils.ErrorResponse(c, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid authorization format")
			c.Abort()
			return
		}

		token, err := jwt.ParseWithClaims(parts[1], &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})
		if err != nil || !token.Valid {
			utils.ErrorResponse(c, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid or expired token")
			c.Abort()
			return
		}

		claims, ok := token.Claims.(*Claims)
		if !ok {
			utils.ErrorResponse(c, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid token claims")
			c.Abort()
			return
		}

		c.Set("admin_id", claims.AdminID)
		c.Set("admin_username", claims.Username)
		c.Set("admin_role", claims.Role)
		c.Next()
	}
}

func RequireRole(roles ...models.AdminRole) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("admin_role")
		if !exists {
			utils.ErrorResponse(c, http.StatusForbidden, "FORBIDDEN", "Access denied")
			c.Abort()
			return
		}

		adminRole := role.(models.AdminRole)
		for _, r := range roles {
			if adminRole == r {
				c.Next()
				return
			}
		}

		utils.ErrorResponse(c, http.StatusForbidden, "FORBIDDEN", "Insufficient permissions")
		c.Abort()
	}
}
