# Soul Spirits — AI 鸡尾酒匹配工作流

一个把"性格 / 感官测试 → AI 调酒师 → 结构化推荐"串成一条线的 AI 工作流小产品。前端 React + Vite + Tailwind，后端 Node + Express，AI 调用走 Anthropic **Claude Opus**（`claude-opus-4-7`）。一键脚本同时拉起前后端，全部本地运行。

---

## 1. 用户、场景与痛点

- **目标用户**：偶尔小酌、对酒单选择困难的都市年轻人；不熟悉调酒、又想喝点"懂自己"的饮品。
- **使用场景**：周末晚上独自在家，或者朋友聚会前需要一份"有故事感"的饮品清单。
- **痛点**：
  1. 传统鸡尾酒菜单太长，名字记不住、不知道哪一款适合自己当下情绪。
  2. 通用推荐（"销量榜单"）和"我此刻的心情"匹配度低。
  3. 不懂调酒原料的用户，希望能直接拿到配方、装饰、调制步骤。
- **验证方式**：
  1. 找了一家鸡尾酒吧，与bartender交流，获得正反馈

---

## 2. AI 工作流结构

```
用户 (Web 端 :3000)
  │  10 道情绪 / 感官 / 性格选择题
  ▼
前端 claudeService.ts
  │  POST /api/cocktail  { answers, lang }
  ▼
本地后端 server/index.js (Express, :8787)
  │  · 拼 prompt（按 lang 选中/英）
  │  · @anthropic-ai/sdk → Claude Opus (claude-opus-4-7)
  │  · stripCodeFence + 容错 JSON 抓取
  │  · 字段校验
  ▼
HTTP 200  { classic, custom, rationale }
  ▼
前端渲染：经典款 / 灵魂签名款两张卡片 + 灵魂画像
```

> dev 模式下，Vite 把 `/api/*` 反向代理到 `127.0.0.1:8787`，所以前端用相对路径 `/api/cocktail` 就能调到后端，且 API Key **不会**出现在浏览器里。

返回结构（见 `types.ts` 的 `CocktailRecommendation`）：

```ts
{
  classic:  { name, description, ingredients[], origin },
  custom:   { name, vibe, flavorNotes, ingredients[], garnish, instructions },
  rationale: string  // 灵魂画像，10 个维度综合分析
}
```

---

## 3. 启动方式（本地运行）

### 前置条件

- Node.js ≥ 18
- 一个 Anthropic API Key（[console.anthropic.com](https://console.anthropic.com)）

### 一键启动

```bash
./start.sh
```

首次运行时，脚本会自动：

1. 检查 Node 版本；
2. 如果没有 `.env.local`，生成模板并提示你填 `ANTHROPIC_API_KEY`；
3. 如果 `node_modules` 不存在或 `package.json` 更新过，自动 `npm install`；
4. 加载 `.env.local` 到环境，后台启动 Express 后端（http://127.0.0.1:8787）；
5. 等待 `/api/health` 通过后，前台启动 Vite dev（http://127.0.0.1:3000）；
6. Ctrl-C 时一并 kill 后端。

其他模式：

```bash
./start.sh server     # 只启动后端（方便用 curl 测 API）
./start.sh build      # 仅做生产构建
./start.sh preview    # 构建并本地预览生产版
```

### 手动启动

分两个终端：

```bash
# 终端 1：后端
npm install
echo 'ANTHROPIC_API_KEY=sk-ant-你的key' > .env.local
set -a; source .env.local; set +a
npm run server        # http://127.0.0.1:8787

# 终端 2：前端
npm run dev           # http://127.0.0.1:3000
```

`.env.local` 支持以下变量（均**仅后端**读取，不会泄漏到浏览器）：

```bash
ANTHROPIC_API_KEY=sk-ant-xxxx       # 必填
CLAUDE_MODEL=claude-opus-4-7        # 可选，默认即此值
PORT=8787                           # 可选，后端监听端口
```

---

## 4. 关键文件说明

| 文件 | 作用 |
| --- | --- |
| `start.sh` | 一键启动：检查环境、装依赖、同时拉起前后端 |
| `server/index.js` | **后端入口**：Express，暴露 `POST /api/cocktail` 与 `GET /api/health`，内部调用 Anthropic SDK，处理 prompt 构造与 JSON 解析 |
| `App.tsx` | 顶层状态机：WELCOME → QUIZ → LOADING → RESULT，中英文切换 |
| `constants.tsx` | 10 道题目和选项的中英文文案 |
| `claudeService.ts` | 前端 API 客户端：`fetch('/api/cocktail')`，处理错误与字段校验 |
| `types.ts` | 共享类型：`Question`、`Option`、`CocktailRecommendation`、`AppState`、`Locale` |
| `components/Layout.tsx` | 整体视觉框架（背景、玻璃质感等） |
| `vite.config.ts` | Vite 配置；端口 3000；`/api` 反向代理到后端 |
| `metadata.json` | AI Studio 项目元信息 |

---

## 5. 三条输入 / 输出样例

下面三组输入对应不同的"灵魂"画像，体现工作流对维度差异的敏感度。完整 prompt 见 `claudeService.ts` 的 `buildPrompt`。

### 样例 A：内敛 / 复杂型

输入（10 道题 trait）：

```json
{
  "mood": "calm",
  "social": "introverted",
  "taste_base": "complex",
  "scene": "rainy_night",
  "rhythm": "slow",
  "color": "deep_blue",
  "texture": "smoky",
  "memory": "old_film",
  "dream": "library",
  "finish": "lingering"
}
```

输出（节选）：

```json
{
  "classic": {
    "name": "Old Fashioned",
    "description": "波本的醇厚被糖与苦精轻轻收束……",
    "ingredients": ["波本威士忌 60ml", "方糖 1 颗", "Angostura 苦精 2 滴", "橙皮"],
    "origin": "19 世纪美国肯塔基州"
  },
  "custom": {
    "name": "雾色书页",
    "flavorNotes": "前调焦糖与橡木，中段烟熏过桥，尾韵留下一丝纸张陈香",
    "ingredients": ["艾雷岛单一麦芽 45ml", "陈年雪莉 15ml", "蜂蜜糖浆 10ml", "雪茄烟熏雾"],
    "garnish": "脱水橙片 + 一根迷迭香",
    "instructions": "...搅拌而非摇匀，保留液体的安静..."
  },
  "rationale": "你像一本旧书……"
}
```

### 样例 B：外向 / 直接型

输入：

```json
{
  "mood": "passionate",
  "social": "extroverted",
  "taste_base": "straightforward",
  "scene": "rooftop_party",
  "rhythm": "fast",
  "color": "sunset_orange",
  "texture": "fizzy",
  "memory": "festival",
  "dream": "stage",
  "finish": "bright"
}
```
输出(节选):

```json
{ "classic":
    {"name":"玛格丽特・夕阳之吻",
    "description":"一杯诞生于墨西哥烈日下的传奇之作，酸甜交织、清冽明亮，盐边轻触舌尖的瞬间，仿佛点燃了一场盛夏的狂欢。它是外向灵魂的语言，是热情澎湃者的勋章。",
    "ingredients":["龙舌兰酒 50ml","君度橙酒 20ml","新鲜青柠汁 25ml","海盐（杯沿）","青柠角"],
    "origin":"据传于1938年诞生于墨西哥蒂华纳，由调酒师Carlos 'Danny' Herrera为一位名叫Marjorie的舞者特调，自此成为世界三大鸡尾酒之一，象征着拉丁式的奔放与不羁。"},
  "custom":{"name":"落日狂想・橘焰之诗",
    "vibe":"屋顶之上，霓虹未起，夕阳正浓。一杯入喉，是节日烟火炸开的瞬间，是聚光灯打在舞台中央的那一刻——你即是光本身。",
    "flavorNotes":"前调以血橙与百香果的果香炸裂开场，明亮如初遇的火花；中调由龙舌兰的烟熏与生姜的微辛缓缓铺陈，像鼓点般层层推进；尾韵则以气泡水的轻盈与柚子皮油的清冽收束，余味鲜活、绵长不散，宛如狂欢落幕后心跳仍在的回响。",
    "ingredients":["珍藏级白龙舌兰 45ml","血橙利口酒 20ml","新鲜百香果肉 1颗","鲜榨青柠汁 15ml","生姜蜂蜜糖浆 10ml","冰镇苏打水 顶层补满","一抹安高天娜苦精"],
    "garnish":"炙烤过的血橙片一枚，撒以微量喜马拉雅粉盐，佐以一支燃烧后熄灭的迷迭香——烟气如夕阳余烬。",
    "instructions":"1. 将百香果肉、生姜蜂蜜糖浆与青柠汁置于摇酒壶中，轻捣释放果香。2. 注入龙舌兰与血橙利口酒，加入满壶冰块，强力摇荡12秒，让风味在低温中迸发。3. 双重过滤至预先冰镇的高球杯中。4. 缓缓注入苏打水至九分满，滴入一抹苦精以稳固层次。5. 点燃迷迭香数秒后熄灭，置于杯沿，最后摆上炙烤血橙片——上桌时，烟气尚存。"},

  "rationale":"你的灵魂画像，是一场被精心编排的盛夏交响。从『passionate』的炽热基调出发，到『extroverted』向外辐射的能量，你天生属于人群中那束最亮的光；『straightforward』的味觉偏好揭示了你不愿被矫饰束缚的本性——你要的是直击心灵的真实。『rooftop_party』与『fast』的节奏，描绘出你对开阔与速度的渴望，仿佛灵魂永远在向高处奔赴；而『sunset_orange』与『fizzy』则透露了你内在的诗意：你不是单纯的烈火，而是黄昏时分被点燃的橘色海洋，气泡般跳跃，却又温柔克制。『festival』的记忆与『stage』的梦境互为镜像——你既怀念人群中的共鸣，也渴望成为被注视的中心；最终以『bright』收尾，证明你拒绝任何形式的灰暗。因此，经典款『玛格丽特』回应你直率而热烈的本能，而定制款『落日狂想・橘焰之诗』则是为你量身雕琢的灵魂签名：它用血橙复刻你的色彩，用百香果释放你的激情，用气泡书写你的节奏，用烟气封存你对舞台的执念。这一杯，是你站在屋顶之上、夕阳之下，对整个世界举杯的方式。"}

```

> 两组样例的实际响应已在 dev 环境跑通，可在录屏中看到完整渲染。

---

## 6. AI 协作说明

- **使用的 AI 工具**：开发过程中使用 Claude Code 协助：拆功能模块、对接 Anthropic SDK、调试 JSON 解析，以及补完中英双语 prompt。
- **AI 不负责的部分**：交互动效、整体色系、Tailwind 样式细节由人工把控；题目选项的"性格分布"由人工设计，确保 10 个维度的覆盖度。
- **提示词工程**：
  - 强约束 JSON 输出（"不要 markdown、不要 code block"）+ 客户端兜底剥离 ```` ``` ````；
  - 中英文两套 prompt 分开维护，保证语种自洽；
  - 解析失败时分两步降级：先 `stripCodeFence` 后整体 parse，再退而求其次抓最外层 `{...}`。
- **AI 的局限与人工兜底**：模型偶尔会用 markdown 包 JSON，已在 `extractJson` 里做了二次容错；返回结构缺字段时由 `validateRecommendation` 抛出可读错误并回到欢迎页。

---

## 7. 测试样例 / 接口调用

后端暴露两个端点（前提：`./start.sh` 已把后端跑起来）：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET`  | `/api/health`   | 健康检查，返回 `{ ok: true, model }` |
| `POST` | `/api/cocktail` | 主接口，body 为 `{ answers, lang }`，返回结构化推荐 |

### 调用示例

```bash
# 1) 健康检查
curl -i http://127.0.0.1:8787/api/health
# => 200 {"ok":true,"model":"claude-opus-4-7"}

# 2) 正常调用：传入 10 道题的 trait + 语言，返回结构化 JSON
curl -i http://127.0.0.1:8787/api/cocktail \
  -H 'Content-Type: application/json' \
  -d '{
    "lang": "zh",
    "answers": {
      "mood": "calm",
      "social": "introverted",
      "taste_base": "complex",
      "scene": "rainy_night",
      "rhythm": "slow",
      "color": "deep_blue",
      "texture": "smoky",
      "memory": "old_film",
      "dream": "library",
      "finish": "lingering"
    }
  }'
# => 200 { "classic": {...}, "custom": {...}, "rationale": "..." }

# 3) 缺字段：验证错误处理路径
curl -i http://127.0.0.1:8787/api/cocktail \
  -H 'Content-Type: application/json' \
  -d '{}'
# => 400 {"error":"Invalid payload: answers is required (object)"}
```

> 前端走 Vite 代理时可直接用相对路径：`POST /api/cocktail`（自动转到 `:8787`）。

录屏中包含一次完整的"10 题 → 加载 → 推荐卡翻面"操作，以及一次 DevTools Network 截图（请求体为 `{ answers, lang }`，响应体为结构化 JSON）。

---

## 8. 真实排错记录

**现象**：把 Anthropic 调用从前端搬到 Express 后端后，连续走了几次 10 题流程，偶发收到后端日志：

```
[server] /api/cocktail failed: SyntaxError: Expected ',' or '}' after property value in JSON at position 1551 (line 31 column 369)
    at JSON.parse (<anonymous>)
```

前端那边则一直停在加载圈，过几秒抛出 `HTTP 500`，体验非常差。

**排查过程**：
1. 看后端日志，错误确实来自 `JSON.parse`，不是 prompt 失败或网络问题。第一反应是 Claude 又包了 code fence，但已经有 `stripCodeFence` 兜底，应该不是这个。
2. 把 `message.content[0].text` 完整打印出来：HTTP 上游 200，code fence 已经被剥掉了，但 JSON 字符串值里偶尔出现**未转义的换行**或**未转义的反斜杠**（猜测和模型在长描述里塞诗化排版有关）。
3. `JSON.parse` 对控制字符是零容忍的，靠正则去"修"反而容易把别的字段也改坏，硬修不靠谱。
4. 同时还发现：即便后端能稳定区分错误类型，前端原本只是把整段错误信息 `alert` 出来后再 `resetToWelcome()`，但因为消息里夹着 `HTTP 500: SyntaxError ...` 这种栈，用户根本不知道该怎么办。

**修复**（分两层）：

1. **后端区分错误类型**——`server/index.js` 把 `/api/cocktail` 拆成两段 try/catch：
   - 上游调用失败（鉴权 / 网络 / 配额）→ 502 + 错误原文；
   - JSON 解析或字段校验失败→ 502 + 一条按 `lang` 返回的友好提示（中文："AI 返回的内容格式异常，请重新开始测试"），同时把 raw text 前 500 字符打到服务器日志，方便后续调 prompt。
2. **前端走"友好提示 + 自动重来"路径**——`claudeService.ts` 不再给错误加 `HTTP xxx:` 前缀，直接把后端 `error` 字段透传；`App.tsx` 已经在 catch 里做了 `alert(...)` + `resetToWelcome()`，所以一旦解析失败，用户看到的就是"调酒师在密室迷路了：AI 返回的内容格式异常，请重新开始测试"，点确定自动回到欢迎页，可以从第 1 题重新走。

**为什么不上 tool use / JSON schema 强结构化**：考虑过，但这次想保留"模型可能出错 → 工作流要能优雅降级"这条链路，作为对 LLM 输出不稳定性的真实演示。50+ 次连续测试里，这种偶发失败大约 1/20 出现一次，靠"重新答一遍"基本无感。后续如果需要更稳，再切 tool use。

---

## 9. License

仅用于演示，未授权商用。
