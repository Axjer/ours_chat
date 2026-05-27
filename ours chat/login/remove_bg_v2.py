import sys
from PIL import Image

def process_gif(input_path, output_path):
    img = Image.open(input_path)
    frames = []
    duration = img.info.get('duration', 100)
    
    for frame in range(img.n_frames):
        img.seek(frame)
        rgba = img.convert("RGBA")
        datas = rgba.getdata()
        
        newData = []
        for item in datas:
            r, g, b, a = item
            # The background is light grey, the shadow is dark grey.
            # Grey means r,g,b are close to each other.
            # We remove all pixels where the difference between colors is small
            # AND the brightness is between 60 and 230 (to avoid removing white belly or black body).
            if abs(r-g) < 20 and abs(g-b) < 20 and abs(r-b) < 20 and 60 < r < 230:
                newData.append((255, 255, 255, 0)) # transparent
            else:
                newData.append(item)
                
        rgba.putdata(newData)
        frames.append(rgba)
        
    frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0, duration=duration, disposal=2)

if __name__ == "__main__":
    process_gif("woo.gif", "woo_transparent.gif")
    print("Done")
