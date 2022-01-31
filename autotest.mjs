import axios from 'axios';
import fs from 'fs';
let institutions = JSON.parse(fs.readFileSync('./institutions.json'));
let currentDate = new Date();
let cDay = currentDate.getDate().toString().padStart(2, '0');
let cMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
let cYear = currentDate.getFullYear().toString();
let resultPassedString = `${cYear}-${cMonth}-${cDay}`;
let results = [];
for await (let i of institutions) {
	console.log(`starting validation for p=${i.project}&e=${i.facility}`);
	const res = await axios.get(
		`http://localhost:3005/api/?p=${i.project}&e=${i.facility}`,
		{ validateStatus: () => true }
	);
	i.tested = false;
	if (res.data.status === 'ok') {
		i.tested = resultPassedString;
	}
	results.push(i);
	console.log(`finished validation for p=${i.project}&e=${i.facility}`);
	fs.writeFileSync('./validated.json', JSON.stringify(results));
	console.log(`updated validated.json`);
}

fs.writeFileSync('./validated.json', JSON.stringify(results));
// console.log(results);