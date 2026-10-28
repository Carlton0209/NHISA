"""Per-pixel sky probability from SegFormer-B5 (ADE20K), averaged over scales and flips."""
import sys
import numpy as np
import torch
from PIL import Image
from transformers import SegformerForSemanticSegmentation, SegformerImageProcessor

MODEL = "nvidia/segformer-b5-finetuned-ade-640-640"
SKY = 2  # ADE20K class index for "sky"

src, out = sys.argv[1], sys.argv[2]
image = Image.open(src).convert("RGB")
W, H = image.size

processor = SegformerImageProcessor.from_pretrained(MODEL)
model = SegformerForSemanticSegmentation.from_pretrained(MODEL).eval()
torch.set_num_threads(max(1, torch.get_num_threads()))

acc = np.zeros((H, W), np.float32)
n = 0
for short in (640, 960, 1280):
    w = round(W * short / H / 32) * 32
    h = round(short / 32) * 32
    resized = image.resize((w, h), Image.BICUBIC)
    for flip in (False, True):
        img = resized.transpose(Image.FLIP_LEFT_RIGHT) if flip else resized
        inputs = processor(images=img, return_tensors="pt", do_resize=False)
        with torch.no_grad():
            logits = model(**inputs).logits  # 1 x C x h/4 x w/4
        logits = torch.nn.functional.interpolate(logits, size=(H, W), mode="bilinear", align_corners=False)
        prob = logits.softmax(1)[0, SKY].numpy()
        if flip:
            prob = prob[:, ::-1]
        acc += prob
        n += 1
        print(f"scale {short} flip {flip} done", flush=True)

np.save(out, acc / n)
Image.fromarray((acc / n * 255).clip(0, 255).astype(np.uint8)).save(out.replace(".npy", ".png"))
