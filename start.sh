#!/bin/bash
gunicorn wsgi_app:app
