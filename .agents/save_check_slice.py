from PIL import Image

def main():
    cached_path = r"C:\Users\Usuario\\.gemini\\antigravity-ide\\brain\\d3e70530-cedc-4484-92b2-8ca97fb0af14\\.tempmediaStorage\\media_d3e70530-cedc-4484-92b2-8ca97fb0af14_1779917770164.png"
    img = Image.open(cached_path)
    
    # Crop the JURIDICA row (should be around y=74-82)
    # Let's crop x=0 to 200, y=60 to 130
    cropped = img.crop((0, 60, 200, 130))
    cropped.save(r"c:\Users\Usuario\Desktop\pagina cdk 29 de abril\.agents\slice_check.png")
    print("Crop saved successfully!")

if __name__ == "__main__":
    main()
