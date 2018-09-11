import os
import time
import json
import http.server
import socketserver

class Api(http.server.BaseHTTPRequestHandler):
	def do_GET(self):
		if self.path == '/' or self.path == '':
			self.send_response(200)
			self.send_header('Content-Type', 'text/html')
			self.end_headers()

			docs = []
			for path in os.listdir(db):
				with open(os.path.join(db, path), 'r') as f:
					docs.append(json.load(f))
			docs = list(sorted(docs, key = lambda doc: -doc['added_at']))
			self.wfile.write(open('zrxiv.html', 'rb').read().replace(b'$zrxiv_docs', json.dumps(docs).encode()))
		else:
			self.send_response(500)
			self.end_headers()

	def do_POST(self):
		if self.path == '/add':
			data = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
			path = os.path.join(db, data['id'] + '.json')

			data_ = {}
			if os.path.exists(path):
				with open(path, 'r') as f:
					data_ = json.load(f)

			data_['tags'] = data_.get('tags', [])
			for tag, add_remove in data.pop('tags', {}).items():
				(data_['tags'].append if add_remove else data_['tags'].remove)(tag)
			data_.update(data)
			data_['added_at'] = time.time()

			with open(path, 'w') as f:
				json.dump(data_, f)
			tags_all = set()
			for path in os.listdir(db):
				with open(os.path.join(db, path), 'r') as f:
					tags_all.update(json.load(f).get('tags', []))

			res = dict(tags = {tag : tag in data_['tags'] for tag in tags_all})

			self.send_response(200)
			self.send_header('Content-type', 'application/json')
			self.send_header('Access-Control-Allow-Origin', '*')
			self.end_headers()
			self.wfile.write(json.dumps(res).encode())
		else:
			self.send_response(500)
			self.end_headers()

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
	pass

if __name__ == '__main__':
	db = 'db'
	if not os.path.exists(db):
		os.makedirs(db)
	httpd = ThreadedHTTPServer(('localhost', 8000), Api)
	try:
		httpd.serve_forever()
	except KeyboardInterrupt:
		httpd.server_close()
