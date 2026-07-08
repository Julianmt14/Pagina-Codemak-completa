from PIL import Image

def main():
    img_path = r"c:\Users\Usuario\Desktop\pagina cdk 29 de abril\img\chatgot proyectos\Captura de pantalla 2026-05-27 163318.png"
    img = Image.open(img_path)
    width, height = img.size

    print("--- Searching for text-like pixels in left sidebar (x=65 to x=200) ---")
    for y in range(height):
        bright_pixels = []
        for x in range(65, 200):
            pixel = img.getpixel((x, y))
            r, g, b = pixel[:3]
            # White text has bright pixels
            if r > 100 and g > 100 and b > 100:
                bright_pixels.append(x)
        if bright_pixels:
            print(f"y={y}: found bright pixels at x={bright_pixels[:5]}... (count={len(bright_pixels)})")

if __name__ == "__main__":
    main()
