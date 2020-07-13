const fs = require('fs');
module.exports = (rel = '/', req, res) => {
	if (typeof rel !== 'string') rel = '/';
	fs.readFile(rel + 'web-template.html', 'utf8', function read(
		err,
		templateData
	) {
		if (err) {
			console.log(err);
			res.status(500).end();
		} else {
			fs.readFile(rel + 'institutions.json', 'utf8', function read(
				err,
				content
			) {
				if (err) {
					console.log(err);
					res.status(500).end();
				} else {
					content = JSON.parse(content);
					let table = '';
					content.forEach((src) => {
						let tested_insert = '❓ not tested';
						if (src.tested === true) {
							tested_insert = `👍 tested on: ${src.tested_on}`;
						}

						table += `
						<h4>${src.name}</h4>
						${tested_insert}
						<br>
						Project: <code data-clipboard-text="${src.project}">${src.project}</code>
						<br>
						Facility: <code data-clipboard-text="${src.facility}">${src.facility}</code>
						<br>
						data provider: <code data-clipboard-text="${src.provider}">${src.provider}</code>
						<br>
						sample raw link: <a target="_blank" href="${src.sample_url}">${src.sample_url}</a>
						<br>
						sample api link: <a target="_blank" href="../api/?p=${src.project}&e=${src.facility}">/api/?p=${src.project}&e=${src.facility}</a>
						<hr>
						`;
					});
					const rendered = templateData.replace(
						/{{{content}}}/gi,
						table
					);
					res.send(rendered);
				}
			});
		}
	});
};