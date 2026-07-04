from openai import OpenAI
import base64
import os

client = OpenAI(
    api_key="sk-JrOay9HbkBhqTtfNS9OOy4Fbna0lgx0VTLQFDX7Bea2dgTwg",  # 平台颁发的令牌
    base_url="https://modelrec.net/v1"
)

# ===== 图像识别示例数据（图片 URL 或本地路径）=====
# 方式一：使用图片 URL（需要模型支持 URL 方式）
samples_with_url = [
    {"id": 1, "image": "https://muse-ai.oss-cn-hangzhou.aliyuncs.com/img/9366f8a0-cb67-4146-8d0c-129e1139ec67.png?x-oss-process=image/format,jpg/quality,Q_50"},
    {"id": 2, "image": "https://muse-ai.oss-cn-hangzhou.aliyuncs.com/img/faa12077-033e-4ab3-be0d-18d92fe35b5e.png?x-oss-process=image/format,jpg/quality,Q_50"},
    {"id": 3, "image": "https://muse-ai.oss-cn-hangzhou.aliyuncs.com/img/75a194b0-3054-4719-9e81-5f947e117b70.png?x-oss-process=image/format,jpg/quality,Q_50"},
]

# 方式二：使用本地图片路径（将图片转为 base64 编码）
samples_with_local = [
    {"id": 1, "image_path": "/home/one/Downloads/faa12077-033e-4ab3-be0d-18d92fe35b5e.png"},
    # {"id": 2, "image_path": "images/car.jpg"},
    # 按需添加本地图片路径
]


# ===== 将本地图片转为 base64 编码 =====
def encode_image_to_base64(image_path):
    """
    读取本地图片文件并转换为 base64 字符串。
    """
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    return encoded_string


# ===== 调用模型进行图像识别 =====
VISION_MODEL = "qwen3.6-plus"  # ← 请修改为平台支持的实际视觉模型名称


def recognize_image(
    image_input, 
    model=VISION_MODEL, 
    is_url=True, 
    mime_type="image/png",
    prompt="请描述这张图片中的主要内容和物体。"
):
    """
    使用支持视觉能力的 LLM 对图片进行识别。

    参数：
        image_input: 图片 URL 或 base64 编码字符串。
        model:       模型名称。
        is_url:      True 为 URL，False 为 base64 字符串。
        mime_type:   图片格式 (如 'image/jpeg', 'image/png')，仅 is_url=False 时有效。
        prompt:      自定义提示词。
    """
    try:
        # 1. 构建图片内容
        if is_url:
            image_content = {
                "type": "image_url",
                "image_url": {"url": image_input}
            }
        else:
            # 修正逻辑：不再尝试从 base64 字符串推断后缀，而是依赖参数传入或默认值
            image_content = {
                "type": "image_url",
                "image_url": {"url": f"data:{mime_type};base64,{image_input}"}
            }

        # 2. 构建消息体
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    image_content
                ]
            }
        ]

        # 3. 发送请求
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=300,
        )

        # 4. 安全提取结果
        if response.choices and len(response.choices) > 0:
            return response.choices[0].message.content.strip()
        else:
            return "错误：模型未返回有效内容。"

    except Exception as e:
        return f"识别过程中发生错误: {str(e)}"


# ===== 示例一：使用图片 URL 进行识别 =====
print("🖼️ 图像识别 Demo — 使用图片 URL（共 3 条样本）\n")

for sample in samples_with_url:
    print(f"样本 {sample['id']}")
    print(f"图片地址：{sample['image']}")
    try:
        result = recognize_image(sample["image"], is_url=True)
        print(f"识别结果：{result}")
    except Exception as e:
        print(f"识别失败：{e}")
    print("-" * 60)

# ===== 示例二：使用本地图片进行识别 =====
# 如需使用本地图片，取消下面代码的注释，并确保图片路径正确
#
# print("\n🖼️ 图像识别 Demo — 使用本地图片\n")

# for sample in samples_with_local:
#     print(f"样本 {sample['id']}")
#     print(f"本地路径：{sample['image_path']}")
#     if not os.path.exists(sample['image_path']):
#         print("图片文件不存在，跳过。")
#         print("-" * 60)
#         continue
#     try:
#         base64_image = encode_image_to_base64(sample['image_path'])
#         result = recognize_image(base64_image, is_url=False, mime_type="image/png")
#         print(f"识别结果：{result}")
#     except Exception as e:
#         print(f"识别失败：{e}")
#     print("-" * 60)
