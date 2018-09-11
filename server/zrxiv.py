import os
import json
import http.server

class Api(http.server.BaseHTTPRequestHandler):
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

			with open(path, 'w') as f:
				json.dump(data_, f)
			tags_all = set()
			for path in os.listdir(db):
				path = os.path.join(db, path)
				with open(path, 'r') as f:
					tags_all.update(json.load(f).get('tags', []))
			res = dict(tags = {tags : tag in tags for tag in tags_all})

			self.send_response(200)
			self.send_header('Content-type', 'application/json')
			self.send_header('Access-Control-Allow-Origin', '*')
			self.end_headers()
			self.wfile.write(json.dumps(res).encode())
		else:
			self.send_response(500)
			self.end_headers()

if __name__ == '__main__':
	db = 'db'
	if not os.path.exists(db):
		os.makedirs(db)
	httpd = http.server.HTTPServer(('localhost', 8000), Api)
	try:
		httpd.serve_forever()
	except KeyboardInterrupt:
		httpd.server_close()
