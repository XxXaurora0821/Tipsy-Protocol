#!/usr/bin/env bash
# Soul Spirits 本地一键启动脚本
#
# 用法：
#   ./start.sh           # 同时启动后端 (8787) + 前端 (3000)
#   ./start.sh server    # 只启动后端
#   ./start.sh build     # 仅做生产构建
#   ./start.sh preview   # 构建并预览生产版本

set -e

cd "$(dirname "$0")"

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[info]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC}  $*"; }
err()   { echo -e "${RED}[err]${NC}   $*" >&2; }

# 1) 检查 Node.js
if ! command -v node >/dev/null 2>&1; then
  err "未检测到 Node.js，请先安装 Node 18+ (https://nodejs.org)"
  exit 1
fi

NODE_MAJOR=$(node -v | sed -E 's/v([0-9]+).*/\1/')
if [ "$NODE_MAJOR" -lt 18 ]; then
  warn "当前 Node 版本 $(node -v)，建议升级到 18+ 以避免兼容性问题"
fi

# 2) 检查 .env.local
if [ ! -f .env.local ]; then
  warn ".env.local 不存在，正在创建模板..."
  cat > .env.local <<'EOF'
ANTHROPIC_API_KEY=sk-ant-在这里填你的-key

CLAUDE_MODEL=claude-opus-4-7

PORT=8787
EOF
  err "已生成 .env.local 模板，请填入 ANTHROPIC_API_KEY 后重新运行 ./start.sh"
  exit 1
fi

if ! grep -q '^ANTHROPIC_API_KEY=sk-' .env.local; then
  err ".env.local 里的 ANTHROPIC_API_KEY 看起来还没填（应以 sk- 开头）"
  err "编辑 .env.local 后再运行 ./start.sh"
  exit 1
fi

# 3) 装依赖（仅在 node_modules 不存在或 package.json 更新时）
if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
  info "安装依赖中..."
  npm install
else
  info "依赖已就绪，跳过 npm install"
fi

# 4) 加载 .env.local 到当前 shell（让 node 后端能读到 process.env）
set -a
# shellcheck disable=SC1091
source .env.local
set +a

API_PORT=${PORT:-8787}

MODE=${1:-dev}
case "$MODE" in
  dev|"")
    info "启动后端：http://127.0.0.1:${API_PORT}"
    npm run server &
    SERVER_PID=$!
    trap 'info "shutting down..."; kill $SERVER_PID 2>/dev/null || true; wait $SERVER_PID 2>/dev/null || true' EXIT INT TERM

    # 等后端就绪（最长 ~10s）
    for i in $(seq 1 20); do
      if curl -fsS "http://127.0.0.1:${API_PORT}/api/health" >/dev/null 2>&1; then
        info "后端已就绪"
        break
      fi
      sleep 0.5
      if [ "$i" -eq 20 ]; then
        warn "后端 10 秒内未响应 /api/health，仍继续启动前端"
      fi
    done

    info "启动前端：http://127.0.0.1:3000  (Ctrl-C 同时退出前后端)"
    npm run dev
    ;;
  server)
    info "仅启动后端：http://127.0.0.1:${API_PORT}"
    npm run server
    ;;
  build)
    info "开始生产构建..."
    npm run build
    info "构建完成，产物在 ./dist"
    ;;
  preview)
    info "构建并预览生产版本..."
    npm run build
    npm run preview
    ;;
  *)
    err "未知模式：$MODE"
    err "可用：dev | server | build | preview"
    exit 1
    ;;
esac
