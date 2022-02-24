const queryGwas = geneId => ({
	from: 'Gene',
	select: [
		'geneDiseasePairs.title',
		'geneDiseasePairs.gwas.pvalue',
		'geneDiseasePairs.publications.pubMedId',
		'geneDiseasePairs.snps.primaryIdentifier'
	],
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
			.records(queryGwas(geneId))
			.then(data => {
				if (data.length) resolve(data[0]);
				else reject('No associated GWAS catalog data.');
			})
			.catch(reject);
	});
}

module.exports = queryData;
