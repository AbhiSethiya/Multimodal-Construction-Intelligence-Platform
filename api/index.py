import sys
import os

# Add the backend directory to Python sys.path so routers and schemas resolve cleanly
current_dir = os.path.dirname(__file__)
backend_dir = os.path.abspath(os.path.join(current_dir, "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app

# Export app for Vercel Serverless Function runtime
__all__ = ["app"]
