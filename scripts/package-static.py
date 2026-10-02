#!/usr/bin/env python3
"""Copy the portable canonical source into the Sites static adapter."""
from pathlib import Path
import shutil
root=Path(__file__).resolve().parent.parent
out=root/'dist';out.mkdir(exist_ok=True)
for name in ['index.html','styles.css','app.js','site.config.js']:
    shutil.copy2(root/name,out/name)
shutil.copytree(root/'assets',out/'assets',dirs_exist_ok=True)
print('Static adapter ready: dist/')
