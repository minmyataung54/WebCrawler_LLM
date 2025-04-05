from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch
from accelerate import dispatch_model, infer_auto_device_map, disk_offload

model_id = "aisingapore/gemma2-9b-cpt-sea-lionv3-instruct"

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Load model
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.bfloat16,  # Memory efficient
    low_cpu_mem_usage=True
)

# Enable **manual disk offloading**
device_map = infer_auto_device_map(model, max_memory={0: "6GiB", "cpu": "32GiB"})
dispatch_model(model, device_map=device_map)  # Only dispatching to CPU/GPU
disk_offload(model, offload_folder="offload", execution_device=0)  # Move unused layers to disk

# Create pipeline
pipeline = pipeline("text-generation", model=model, tokenizer=tokenizer)

# Generate response
prompt = "Apa sentimen dari kalimat berikut ini?\nKalimat: Buku ini sangat membosankan.\nJawaban: "
outputs = pipeline(prompt, max_new_tokens=256)

print(outputs[0]["generated_text"])