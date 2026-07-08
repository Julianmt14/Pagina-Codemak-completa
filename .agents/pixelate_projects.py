import os
import shutil
from PIL import Image

def pixelate_area(img, box, pixel_size=12):
    cropped = img.crop(box)
    small = cropped.resize((max(1, cropped.width // pixel_size), max(1, cropped.height // pixel_size)), Image.Resampling.BILINEAR)
    pixelated = small.resize(cropped.size, Image.Resampling.NEAREST)
    img.paste(pixelated, box)

def main():
    # 1. Restore the original unpixelated image from cache
    cached_path = r"C:\Users\Usuario\\.gemini\\antigravity-ide\\brain\\d3e70530-cedc-4484-92b2-8ca97fb0af14\\.tempmediaStorage\\media_d3e70530-cedc-4484-92b2-8ca97fb0af14_1779917770164.png"
    target_path = r"c:\Users\Usuario\Desktop\pagina cdk 29 de abril\img\chatgot proyectos\Captura de pantalla 2026-05-27 163318.png"
    
    if os.path.exists(cached_path):
        shutil.copy(cached_path, target_path)
        print("Successfully restored fresh original screenshot.")
    else:
        print(f"Error: Cache file not found at {cached_path}")
        return

    # 2. Open and pixelate
    img = Image.open(target_path)
    
    boxes = [
        # === LEFT SIDEBAR PROJECTS ===
        (55, 72, 180, 84),    # JURIDICA (starts at x=55 to completely cover "JU")
        (55, 102, 200, 117),  # CENTRO ATENCIÓN HUMA... (starts at x=55 to completely cover "CE")
        (55, 137, 180, 149),  # PROYECTO ECA (starts at x=55 to completely cover "PR")
        (45, 166, 100, 183),  # R.H (starts at x=45 to completely cover "R.H")
        (55, 202, 205, 214),  # INTERVENTORIA CONSORCI... (starts at x=55, stops at x=205 to avoid touching popup menu border)
        
        # === LEFT SIDEBAR CHATS (Recientes) ===
        (20, 312, 205, 325),  # Observación ítem contractual o...
        (20, 345, 205, 358),  # Análisis contrato consultoría
        (20, 377, 205, 390),  # PowerPoint bonito e intuitivo
        (20, 410, 205, 420),  # Tabla de áreas proyecto
        (78, 433, 205, 445),  # ASISTENCIA CODEMAK (starts at x=78 to keep the user profile circle green/clean)
        
        # === RIGHT POPUP MENU PROJECTS ===
        (265, 217, 415, 231), # CCV
        (265, 249, 415, 263), # CONTABILIDAD
        (265, 281, 415, 295), # SUMINISTRO ECA
        (265, 314, 415, 328), # LEGAL
        (265, 346, 415, 360), # CODIGOS UNSPSC
        (265, 379, 415, 393), # VILLA-GAITAN
        (265, 411, 415, 425), # ERP ODOO
        (265, 443, 415, 457), # CHORR - VPS
    ]
    
    for box in boxes:
        pixelate_area(img, box, pixel_size=12)
        
    img.save(target_path)
    print("Perfect strong pixelation completed and saved successfully!")

if __name__ == "__main__":
    main()
