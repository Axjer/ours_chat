import sys
from PIL import Image

def process_gif(input_path, output_path):
    img = Image.open(input_path)
    
    # Try to determine background color from top-left pixel
    bg_color = None
    
    frames = []
    duration = img.info.get('duration', 100)
    
    for frame in range(img.n_frames):
        img.seek(frame)
        rgba = img.convert("RGBA")
        datas = rgba.getdata()
        
        if bg_color is None:
            bg_color = datas[0] # Top-left pixel
            
        newData = []
        for item in datas:
            # Check if color is close to bg_color
            if abs(item[0]-bg_color[0]) < 15 and abs(item[1]-bg_color[1]) < 15 and abs(item[2]-bg_color[2]) < 15:
                # Fully transparent
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
                
        rgba.putdata(newData)
        frames.append(rgba)
        
    frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0, duration=duration, disposal=2)

if __name__ == "__main__":
    process_gif("woo.gif", "woo_transparent.gif")
    print("Done")
