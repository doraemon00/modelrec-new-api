package controller

import (
	"net/http"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/i18n"
	"github.com/QuantumNous/new-api/model"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type MicroserviceSetSessionRequest struct {
	UserID int `json:"user_id" binding:"required"`
}

// MicroserviceSetSession 微服务调用此接口设置 session，完成登录
// 用于微服务已完成 OAuth 鉴权后，通知 Go 后端设置登录态
func MicroserviceSetSession(c *gin.Context) {
	// 1. 验证微服务调用权限（通过 Header 中的共享密钥）
	authKey := c.GetHeader("X-Microservice-Key")
	expectedKey := common.GetEnvOrDefaultString("MICROSERVICE_AUTH_KEY", "")
	if expectedKey == "" || authKey != expectedKey {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": common.TranslateMessage(c, i18n.MsgAuthAccessTokenInvalid),
		})
		return
	}

	// 2. 解析请求体
	var req MicroserviceSetSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiErrorI18n(c, i18n.MsgInvalidParams)
		return
	}

	// 3. 查找用户
	user, err := model.GetUserById(req.UserID, false)
	if err != nil {
		common.ApiErrorI18n(c, i18n.MsgUserNotExists)
		return
	}

	// 4. 检查用户状态
	if user.Status != common.UserStatusEnabled {
		common.ApiErrorI18n(c, i18n.MsgAuthUserBanned)
		return
	}

	// 5. 复用 setupLogin 设置 session 并返回用户信息
	setupLogin(user, c)
}

// SessionValidate 验证当前请求的 session 是否有效，返回用户信息
// 微服务携带浏览器的 cookie 调用此接口，用于判断用户是否已登录
// 验证通过后会刷新 session 并通过 Set-Cookie 响应头返回，便于微服务透传给前端
func SessionValidate(c *gin.Context) {
	session := sessions.Default(c)
	id := session.Get("id")
	username := session.Get("username")

	if id == nil || username == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": common.TranslateMessage(c, i18n.MsgAuthNotLoggedIn),
		})
		return
	}

	// 刷新 session，使 session cookie 通过 Set-Cookie 响应头返回
	_ = session.Save()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": map[string]any{
			"id":       id,
			"username": username,
			"role":     session.Get("role"),
			"status":   session.Get("status"),
			"group":    session.Get("group"),
		},
	})
}
