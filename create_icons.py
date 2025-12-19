"""
アイコン生成スクリプト
リロードを表す循環矢印アイコンを作成
"""

from PIL import Image, ImageDraw
import os
import math

def create_reload_icon(size: int, output_path: str) -> None:
    """
    リロードアイコンを生成する

    Args:
        size: アイコンサイズ（ピクセル）
        output_path: 出力ファイルパス
    """
    # 透明な背景で画像作成
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # パディングとサイズ計算
    padding = size * 0.1
    center = size / 2
    radius = (size - padding * 2) / 2.5

    # 背景円（水色系）
    bg_radius = size * 0.45
    draw.ellipse(
        [center - bg_radius, center - bg_radius,
         center + bg_radius, center + bg_radius],
        fill=(125, 211, 252, 255)  # パステル水色 #7DD3FC
    )

    # 矢印の線の太さ
    line_width = max(2, int(size * 0.08))
    arrow_color = (15, 23, 42, 255)  # ダーク色 #0F172A

    # 円弧を描画（リロード矢印）
    arc_radius = radius * 0.7
    arc_bbox = [
        center - arc_radius, center - arc_radius,
        center + arc_radius, center + arc_radius
    ]

    # 上半分の円弧
    draw.arc(arc_bbox, start=200, end=340, fill=arrow_color, width=line_width)

    # 下半分の円弧
    draw.arc(arc_bbox, start=20, end=160, fill=arrow_color, width=line_width)

    # 矢印の先端（上側）
    arrow_size = max(3, int(size * 0.12))
    # 上の矢印（右向き）
    angle_top = math.radians(340)
    tip_x1 = center + arc_radius * math.cos(angle_top)
    tip_y1 = center + arc_radius * math.sin(angle_top)

    # 三角形の矢印
    draw.polygon([
        (tip_x1, tip_y1),
        (tip_x1 - arrow_size * 0.8, tip_y1 - arrow_size),
        (tip_x1 - arrow_size * 1.2, tip_y1 + arrow_size * 0.3)
    ], fill=arrow_color)

    # 下の矢印（左向き）
    angle_bottom = math.radians(160)
    tip_x2 = center + arc_radius * math.cos(angle_bottom)
    tip_y2 = center + arc_radius * math.sin(angle_bottom)

    draw.polygon([
        (tip_x2, tip_y2),
        (tip_x2 + arrow_size * 0.8, tip_y2 + arrow_size),
        (tip_x2 + arrow_size * 1.2, tip_y2 - arrow_size * 0.3)
    ], fill=arrow_color)

    img.save(output_path)
    print(f"作成完了: {output_path}")


def main():
    # iconsフォルダ作成
    icons_dir = os.path.join(os.path.dirname(__file__), "icons")
    os.makedirs(icons_dir, exist_ok=True)

    # 各サイズのアイコンを生成
    sizes = [16, 32, 48, 128]
    for size in sizes:
        output_path = os.path.join(icons_dir, f"icon{size}.png")
        create_reload_icon(size, output_path)

    print("全てのアイコン生成が完了しました")


if __name__ == "__main__":
    main()
