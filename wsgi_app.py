from backend.app import app

# This allows gunicorn to find the app directly
if __name__ == "__main__":
    app.run() 