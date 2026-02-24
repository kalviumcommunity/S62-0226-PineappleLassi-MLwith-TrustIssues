Here is a **clean merged version** — short, verification-focused, and PR-ready without unnecessary parts:

---

# S62-0226-PineappleLassi-MLwith-TrustIssues

## Environment Verification

### Python

```bash
python --version
```

Python 3.x.x → verified working

---

### Conda

```bash
conda --version
```

conda x.x.x → verified working

---

### Conda Fix (Git Bash)

```bash
source ~/anaconda3/etc/profile.d/conda.sh
```

---

### Environment

```bash
conda create -n ds_env python=3.10
conda activate ds_env
```

---

### Environment Verification

```bash
python --version
conda info --envs
```

---

### Jupyter

```bash
jupyter notebook
```

Jupyter launched successfully in the browser

---

### Python Execution (Jupyter)

```python
print("Environment working")
```

Output:

```
Environment working
```

---

### Status

Environment verified and ready for Data Science work.
