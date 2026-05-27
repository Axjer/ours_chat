import sys
from PIL import Image

def process_gif(input_path, output_path):
    img = Image.open(input_path)
    frames = []
    duration = img.info.get('duration', 100)
    
    img.seek(0)
    rgba = img.convert("RGBA")
    bg_color = rgba.getpixel((0,0))
    
    for frame in range(img.n_frames):
        img.seek(frame)
        rgba = img.convert("RGBA")
        datas = rgba.getdata()
        
        newData = []
        for item in datas:
            if abs(item[0]-bg_color[0]) < 30 and abs(item[1]-bg_color[1]) < 30 and abs(item[2]-bg_color[2]) < 30:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
                
        rgba.putdata(newData)
        frames.append(rgba)
        
    frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0, duration=duration, disposal=2)

if __name__ == "__main__":
    process_gif("1280.gif", "1280_transparent.gif")
    print("Done")
