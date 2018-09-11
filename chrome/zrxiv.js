var zrxiv_document_id = 'asd';
var zrxiv_url = 'http://localhost:8000/add';

function zrxiv_tags_render(obj)
{
	var tags = document.getElementById('zrxiv_tags');
	tags.innerHTML = '';
	for(var tag in obj['tags'])
	{
		var checkbox = document.createElement('input');
		checkbox.type = 'checkbox'
		checkbox.value = tag;
		checkbox.checked = obj['tags'][tag];
		checkbox.onclick = 'zrxiv_tag_changed';
		tags.appendChild(checkbox);
	}
	document.getElementById('zrxiv_tag').value = '';
}

function zrxiv_tag_add()
{
	var tag = document.getElementById('zrxiv_tag').value;
	console.log(tag);
	fetch(zrxiv_url,
	{
		method : 'post',
		headers : {'Content-Type' : 'text/plain'},
		body : JSON.stringify({id : zrxiv_document_id, tags : { tag : true } })
	})
	.then(res => res.json())
	.then(zrxiv_tags_render);
}

function zrxiv_tag_changed(ev)
{
	var tag = event.target.value;
	var checked = event.target.checked;
	fetch(zrxiv_url,
	{
		method : 'post',
		headers : {'Content-Type' : 'text/plain'},
		body : JSON.stringify({id : zrxiv_document_id, tags : { tag : checked } })
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
}

if(!document.getElementById('zrxiv_tags'))
{
	var iframe  = document.createElement('iframe');
	iframe.src  = chrome.extension.getURL('zrxiv.html');
	iframe.width = '100%';
	iframe.height = '60px';
	document.body.insertBefore(iframe, document.body.firstChild);
}
else
	zrxiv_document_add();
