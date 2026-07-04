from openai import OpenAI

client = OpenAI(
    api_key="sk-kXY7NiE2adr63WgsuSVTHl3GTTB9bB3pC5hJLhlHtcYGuIl0",  # 平台颁发的令牌
    base_url="https://modelrec.net/v1"
)

# ===== 文本分类示例数据 =====
samples = [
    "中国女篮在巴黎奥运会上取得历史性突破，成功晋级四强。",
    "苹果公司发布了最新一代 iPhone，搭载全新 AI 芯片。",
    "知名演员因出演热门电视剧一夜爆红，粉丝数量激增。",
    "央行宣布下调存款准备金率，释放长期资金约5000亿元。",
    "某地发生地震，救援队伍已第一时间赶赴现场。",
    "世界杯预选赛亚洲区比赛将于下周正式开打。",
    "量子计算机研发取得重大突破，计算速度提升百倍。",
    "春节档电影票房再创新高，观影人数突破一亿。",
    "多家上市公司发布年报，整体净利润同比增长15%。",
    "社区志愿者开展关爱孤寡老人公益活动。"
]

# 可选分类标签
CATEGORIES = ["体育", "科技", "娱乐", "财经", "社会"]

# ===== 调用模型进行文本分类 =====
def classify_text(text, model="deepseek-v4-pro"):
    """
    使用 LLM 对文本进行分类，返回类别及置信度说明。
    """
    system_prompt = (
        "你是一个文本分类助手。请将用户输入的文本分为以下类别之一："
        f"{'、'.join(CATEGORIES)}。"
        "请严格按照 JSON 格式输出，例如："
        '{"category": "体育", "reason": "内容涉及体育赛事"}。'
        "不要输出任何其他内容。"
    )

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text},
        ],
        temperature=0.0,  # 分类任务使用低温，结果更稳定
        max_tokens=100,
    )

    content = response.choices[0].message.content.strip()
    return content


# ===== 输出 10 个样本及预测结果 =====
print("📊 文本分类 Demo（共 10 条样本）\n")

for i, text in enumerate(samples, 1):
    result = classify_text(text)
    print(f"样本 {i}：")
    print(f"文本：{text}")
    print(f"模型返回：{result}")
    print("-" * 60)
