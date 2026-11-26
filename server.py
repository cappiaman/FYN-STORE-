#!/usr/bin/env python3
"""
FYN Storefront & Hostinger E-Commerce Local Server
Serves static files, brand assets, and provides mock endpoints for FYN mountain lifestyle store.
"""
import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class FYNStoreHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def run_server():
    port = PORT
    for try_port in [8080, 8000, 3000, 5000, 8888]:
        try:
            socketserver.TCPServer.allow_reuse_address = True
            with socketserver.TCPServer(("", try_port), FYNStoreHandler) as httpd:
                print(f"======================================================")
                print(f"🌲 FYN Mountain E-Commerce Server Running!")
                print(f"📍 Storefront URL : http://localhost:{try_port}/index.html")
                print(f"🛡️  Admin Portal   : http://localhost:{try_port}/admin.html")
                print(f"📦 Brand Assets    : http://localhost:{try_port}/brand_assets/")
                print(f"======================================================")
                sys.stdout.flush()
                httpd.serve_forever()
                break
        except OSError:
            continue

if __name__ == '__main__':
    run_server()
