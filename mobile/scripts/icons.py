"""Render the existing team monogram for app launchers; no generated imagery."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parents[2]
out=root/'assets/app';out.mkdir(parents=True,exist_ok=True)
def icon(size,path,mask=False):
    image=Image.new('RGB',(size,size),'#081c35');draw=ImageDraw.Draw(image)
    font=ImageFont.truetype(str(root/'assets/fonts/barlow-condensed-black.ttf'),int(size*(.58 if mask else .7)))
    box=draw.textbbox((0,0),'a/',font=font)
    draw.text(((size-(box[2]-box[0]))/2-box[0],(size-(box[3]-box[1]))/2-box[1]),'a/',fill='#e5ff4b',font=font)
    image.save(path)
for size in [192,512,1024]:icon(size,out/f'icon-{size}.png')
icon(512,out/'icon-maskable.png',True);icon(180,out/'apple-touch-icon.png')
android=root/'mobile/android/app/src/main/res'
if android.exists():
    for p in android.glob('mipmap-*/*.png'):
        size=Image.open(p).width;icon(size,p,True)
    for p in android.glob('drawable*/splash.png'):
        size=Image.open(p).size
        image=Image.new('RGB',size,'#081c35');image.save(p)
    for p in [android/'values/ic_launcher_background.xml',android/'drawable/ic_launcher_background.xml']:
        if p.exists():
            import re
            p.write_text(re.sub(r'#[0-9a-fA-F]{6,8}','#081c35',p.read_text()))
ios=root/'mobile/ios/App/App/Assets.xcassets'
if ios.exists():
    icon(1024,ios/'AppIcon.appiconset/AppIcon-512@2x.png')
    for p in (ios/'Splash.imageset').glob('*.png'):
        image=Image.new('RGB',Image.open(p).size,'#081c35');image.save(p)
print('Rendered existing brand monogram app icons.')
