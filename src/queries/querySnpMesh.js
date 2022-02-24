const querySnpMesh = geneId => ({
	from: 'Gene',
	select: [
		'geneDiseasePairs.title',
		'geneDiseasePairs.diseaseTerm.identifier',
		'geneDiseasePairs.publications.pubMedId',
		'geneDiseasePairs.snps.primaryIdentifier'
	],
	joins: ['geneDiseasePairs.publications', 'geneDiseasePairs.snps'],
	where: [
		{
			path: 'geneDiseasePairs.diseaseTerm',
			type: 'MeshTerm'
		},
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
			.records(querySnpMesh(geneId))
			.then(data => {
				if (data.length) resolve(data[0]);
				else reject('No associated MeSH data.');
			})
			.catch(reject);
	});
}

module.exports = queryData;
