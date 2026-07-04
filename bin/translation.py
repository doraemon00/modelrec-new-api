from openai import OpenAI

client = OpenAI(
    api_key="sk-kXY7NiE2adr63WgsuSVTHl3GTTB9bB3pC5hJLhlHtcYGuIl0",  # 平台颁发的令牌
    base_url="https://modelrec.net/v1"
)

# ===== 英文翻译示例数据 =====
samples = [
    "Artificial intelligence is transforming the way we live and work.",
    "The quick brown fox jumps over the lazy dog.",
    "Climate change poses a major threat to global ecosystems.",
    "She has a keen interest in classical music and literature.",
    "The company aims to achieve carbon neutrality by 2030.",
    "Learning a new language opens doors to different cultures.",
    "Autonomous vehicles are expected to reshape transportation.",
    "Honesty is the best policy in both personal and professional life.",
    "The conference will bring together experts from around the world.",
    "Technology should serve humanity, not replace it."
]

# ===== 调用模型进行翻译 =====
def translate_text(text, model="deepseek-v4-flash"):
    """
    使用 LLM 将英文文本翻译为中文，返回翻译结果。
    """
    system_prompt = (
        "你是一个专业翻译助手。请将用户输入的英文句子翻译成中文。"
        "只输出翻译结果，不要输出任何解释、编号或其他内容。"
    )

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text},
        ],
        temperature=0.0,  # 翻译任务使用低温，保证结果准确稳定
        max_tokens=200,
    )

    translation = response.choices[0].message.content.strip()
    return translation


# ===== 输出 10 个样本及翻译结果 =====
print("🌐 英译中翻译 Demo（共 10 条样本）\n")

for i, text in enumerate(samples, 1):
    translation = translate_text(text)
    print(f"样本 {i}")
    print(f"英文：{text}")
    print(f"中文：{translation}")
    print("-" * 60)
