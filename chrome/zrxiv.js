var zrxiv_document_id = new RegExp('abs/(\\d+\.\\d+)', 'g').exec(window.location.href)[2];

var zrxiv_url = 'http://localhost:8000/add';

function zrxiv_tags_render(doc)
{
	var tags = document.getElementById('zrxiv_tags');
	tags.innerHTML = '';
	for(var tag in doc['tags'])
	{
		var checkbox = document.createElement('input');
		checkbox.type = 'checkbox'
		checkbox.value = tag;
		checkbox.checked = doc['tags'][tag];
		checkbox.addEventListener('change', function() { zrxiv_tag_changed(this); });
		var label = document.createElement('label');
		label.appendChild(checkbox);
		label.appendChild(document.createTextNode(tag));
		tags.appendChild(label);
	}
	document.getElementById('zrxiv_tag').value = '';
}

function zrxiv_tag_add()
{
	var tag = document.getElementById('zrxiv_tag').value;
	var tags = {};
	tags[tag] = true;
	fetch(zrxiv_url,
	{
		method : 'post',
		headers : {'Content-Type' : 'text/plain'},
		body : JSON.stringify({id : zrxiv_document_id, tags : tags})
	})
	.then(res => res.json())
	.then(zrxiv_tags_render);
}

function zrxiv_tag_changed(checkbox)
{
	var tag = checkbox.value;
	var tags = {};
	tags[tag] = checkbox.checked;
	fetch(zrxiv_url,
	{
		method : 'post',
		headers : {'Content-Type' : 'text/plain'},
		body : JSON.stringify({id : zrxiv_document_id, tags : tags})
	})
	.then(res => res.json())
	.then(zrxiv_tags_render);
}

function zrxiv_document_add()
{
	fetch(zrxiv_url,
	{
		method : 'post',
		headers : {'Content-Type' : 'text/plain'},
		body : JSON.stringify({id : zrxiv_document_id, title : document.title, url : window.location.href})
	})
	.then(res => res.json())
	.then(zrxiv_tags_render);

	var zrxiv_tag = document.getElementById('zrxiv_tag'), zrxiv_tag_add = document.getElementById('zrxiv_tag_add');
	zrxiv_tag.addEventListener('keyup', function(event)
	{
		event.preventDefault();
		if (event.keyCode === 13)
			zrxiv_tag_add.click();
	});
}

if(!document.getElementById('zrxiv_tags'))
{
	fetch(chrome.extension.getURL('zrxiv.html'))
	.then(response => response.text())
	.then(data => {
		var container = document.createElement('div');
		container.innerHTML = data;
		document.body.insertBefore(container, document.body.firstChild);
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = chrome.extension.getURL('zrxiv.js');
		document.body.appendChild(script);
	});
}
else
{
	zrxiv_document_add();
}
