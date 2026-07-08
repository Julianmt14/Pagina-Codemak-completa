import os
from PIL import Image, ImageDraw

def main():
    img_path = r"c:\Users\Usuario\Desktop\pagina cdk 29 de abril\img\chatgot proyectos\Captura de pantalla 2026-05-27 163350.png"
    if not os.path.exists(img_path):
        print("Error: Image not found!")
        return
        
    img = Image.open(img_path)
    width, height = img.size
    print(f"Image size: {width} x {height}")
    
    # Let's search for bright pixels (R > 180, G > 180, B > 180) to find the text lines
    # We will print rows y where bright pixels are located.
    found_rows = {}
    for y in range(height):
        bright_x = []
        for x in range(width):
            pixel = img.getpixel((x, y))
            r, g, b = pixel[:3]
            if r > 185 and g > 185 and b > 185:
                bright_x.append(x)
        if bright_x:
            found_rows[y] = bright_x
            
    # Group rows
    spans = []
    current_span = []
    for y in sorted(found_rows.keys()):
        if not current_span:
            current_span.append(y)
        elif y == current_span[-1] + 1:
            current_span.append(y)
        else:
            spans.append(current_span)
            current_span = [y]
    if current_span:
        spans.append(current_span)
        
    print("\nDetected bright vertical spans in the entire image:")
    for span in spans:
        sy, ey = span[0], span[-1]
        h = ey - sy + 1
        if h >= 3:
            xs = found_rows[sy]
            min_x = min(xs)
            max_x = max(xs)
            print(f"  y={sy} to {ey} (height={h}) | x={min_x} to {max_x}")
            
    # Let's crop and save horizontal slices to identify the coordinates perfectly!
    # Let's save a visual debug copy as vps_annotated.png where we highlight candidates
    draw_img = img.convert("RGBA")
    draw = ImageDraw.Draw(draw_img)
    
    # We will draw candidate rectangles for pixelation:
    # Candidate 1: The title "CHORR - VPS" at the top left.
    # In standard ChatGPT UI, the title at the top left is around y=30 to y=65, and starts after the folder icon.
    # From the spans output we will see the exact y coordinates, but let's draw some candidates.
    
    draw_img.save(r"c:\Users\Usuario\Desktop\pagina cdk 29 de abril\.agents\vps_annotated.png")

if __name__ == "__main__":
    main()
