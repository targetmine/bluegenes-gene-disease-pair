const queryDisease = geneId => ({
	from: 'Gene',
	select: [
		'diseases.diseaseTerm.identifier',
		'diseases.diseaseTerm.name',
		'diseases.dataSet.name',
		'diseases.publications.pubMedId'
	],
	joins: ['diseases.publications'],
	where: [
		{
			path: 'Gene.id',
			op: '=',
			value: geneId
		}
	]
});

// eslint-disable-next-line
function queryData(geneId, serviceUrl, imjsClient = imjs) {
	return new Promise((resolve, reject) => {
		const service = new imjsClient.Service({ root: serviceUrl });
		service
			.records(queryDisease(geneId))
			.then(data => {
				if (data.length) resolve(data[0]);
				else reject('No associated disease information.');
			})
			.catch(reject);
	});
}

module.exports = queryData;
