import time, os, shutil, glob

TMP_DIR = '/tmp/paimon-main-website-build-' + str(round(time.time() * 1000))

if os.path.exists('target'):
    shutil.rmtree('target')
shutil.copytree('.', TMP_DIR)

templates = {}
for filename in glob.glob(TMP_DIR + '/template/*.html'):
    with open(filename, 'r') as f:
        content = ''.join(f.readlines())
    key = filename.split('/')[-1].split('.')[0]
    templates[key] = content

for filename in glob.glob(TMP_DIR + '/*.html'):
    with open(filename, 'r') as f:
        content = ''.join(f.readlines())
    for key, val in templates.items():
        content = content.replace('<!-- template: %s -->' % key, val)
    os.remove(filename)
    with open(filename, 'w') as f:
        f.write(content)

os.remove(TMP_DIR + '/build.py')
shutil.rmtree(TMP_DIR + '/template')
shutil.move(TMP_DIR, 'target')
