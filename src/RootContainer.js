import React from 'react';
import queryDisease from './queries/queryDisease';
import queryGwas from './queries/queryGwas';
import queryClinvar from './queries/queryClinvar';
import querySnpMesh from './queries/querySnpMesh';
import Loading from './loading';

class RootContainer extends React.Component {
	constructor(props) {
		super(props);
		// console.log(props);
		this.state = {
			gwasItems: [],
			clinvarItems: [],
			meshItems: [],
			diseaseItems: []
		};
	}

	componentDidMount() {
		queryGwas(this.props.entity.Gene.value, this.props.serviceUrl)
			.then(res => {
				// console.log(res);
				const gwasItems = [];
				res.geneDiseasePairs.forEach((gdp, index) => {
					const allPvalues = gdp.gwas
						.map(entry => (
							//<span><a href={entry.class + '/' + entry.objectId}>{entry.pvalue.toExponential()}</a></span>
							<span
								key={entry.objectId}
								onClick={() => {
									this.props.navigate('report', {
										type: entry.class,
										id: entry.objectId
									});
								}}
							>
								{entry.pvalue ? entry.pvalue.toExponential() : '0'}
							</span>
						))
						.reduce((prev, curr) => [prev, ', ', curr]);
					// console.log(allPvalues);
					const [symbol, term] = gdp.title.split(' > ', 2);
					gwasItems.push(
						<tr className={index % 2 ? 'odd' : 'even'}>
							<td>
								<span
									onClick={() => {
										this.props.navigate('report', {
											type: gdp.class,
											id: gdp.objectId
										});
									}}
								>
									{term} - {symbol}
								</span>
							</td>
							<td>{allPvalues}</td>
							<td>{gdp.publications ? gdp.publications.length : '0'}</td>
							<td>{gdp.snps ? gdp.snps.length : '0'}</td>
						</tr>
					);
				});
				this.setState({ gwasItems: gwasItems });
			})
			.catch(error => {
				// console.log(error);
				this.setState({
					gwasItems: [
						<tr key="gwasnd">
							<td colSpan="4" className="noData">
								{error}
							</td>
						</tr>
					]
				});
			});

		queryClinvar(this.props.entity.Gene.value, this.props.serviceUrl)
			.then(res => {
				// console.log(res);
				const clinvarItems = [];
				res.geneDiseasePairs.forEach((gdp, index) => {
					let mySet = new Set();
					gdp.alleles.forEach(entry => {
						mySet.add(entry.clinicalSignificance);
					});
					let myArr = Array.from(mySet);
					// console.log(mySet);
					const [symbol, term] = gdp.title.split(' > ', 2);
					clinvarItems.push(
						<tr className={index % 2 ? 'odd' : 'even'}>
							<td>
								<span
									onClick={() => {
										this.props.navigate('report', {
											type: gdp.class,
											id: gdp.objectId
										});
									}}
								>
									{term} - {symbol}
								</span>
							</td>
							<td>{myArr.join(', ')}</td>
							<td>{gdp.publications ? gdp.publications.length : '0'}</td>
							<td>{gdp.snps ? gdp.snps.length : '0'}</td>
						</tr>
					);
				});
				this.setState({ clinvarItems: clinvarItems });
			})
			.catch(error => {
				// console.log(error);
				this.setState({
					clinvarItems: [
						<tr key="clinvarnd">
							<td colSpan="4" className="noData">
								{error}
							</td>
						</tr>
					]
				});
			});

		querySnpMesh(this.props.entity.Gene.value, this.props.serviceUrl)
			.then(res => {
				// console.log(res);
				const meshItems = [];
				res.geneDiseasePairs.forEach((gdp, index) => {
					const [symbol, term] = gdp.title.split(' > ', 2);
					meshItems.push(
						<tr className={index % 2 ? 'odd' : 'even'}>
							<td>
								<span
									onClick={() => {
										this.props.navigate('report', {
											type: gdp.class,
											id: gdp.objectId
										});
									}}
								>
									{term} - {symbol}
								</span>
							</td>
							<td>&nbsp;</td>
							<td>{gdp.publications ? gdp.publications.length : '0'}</td>
							<td>{gdp.snps ? gdp.snps.length : '0'}</td>
						</tr>
					);
				});
				this.setState({ meshItems: meshItems });
			})
			.catch(error => {
				// console.log(error);
				this.setState({
					meshItems: [
						<tr key="meshnd">
							<td colSpan="4" className="noData">
								{error}
							</td>
						</tr>
					]
				});
			});

		queryDisease(this.props.entity.Gene.value, this.props.serviceUrl)
			.then(res => {
				// console.log(res);
				const diseaseItems = [];
				res.diseases.forEach((disease, index) => {
					diseaseItems.push(
						<tr className={index % 2 ? 'odd' : 'even'}>
							<td>
								<span
									onClick={() => {
										this.props.navigate('report', {
											type: disease.class,
											id: disease.objectId
										});
									}}
								>
									{disease.diseaseTerm.name}
								</span>
							</td>
							<td>
								{disease.publications ? disease.publications.length : '0'}
							</td>
							<td>
								<span
									onClick={() => {
										this.props.navigate('report', {
											type: disease.dataSet.class,
											id: disease.dataSet.objectId
										});
									}}
								>
									{disease.dataSet.name}
								</span>
							</td>
						</tr>
					);
				});
				this.setState({ diseaseItems: diseaseItems });
			})
			.catch(error => {
				// console.log(error);
				this.setState({
					diseaseItems: [
						<tr key="diseasend">
							<td colSpan="3" className="noData">
								{error}
							</td>
						</tr>
					]
				});
			});
	}

	render() {
		return (
			<div className="rootContainer">
				<h2>Genetic disease associations</h2>
				<table className="geneDiseaseTable">
					<thead>
						<tr>
							<th colSpan="4" className="header">
								GWAS catalog
							</th>
						</tr>
						<tr>
							<th style={{ minWidth: '390px' }}>Title</th>
							<th style={{ minWidth: '150px' }}>p-value</th>
							<th style={{ minWidth: '82px' }}>Number of publications</th>
							<th style={{ minWidth: '82px' }}>Number of SNPs</th>
						</tr>
					</thead>
					<tbody>
						{this.state.gwasItems.length ? this.state.gwasItems : <Loading />}
					</tbody>
					<thead>
						<tr>
							<th colSpan="4" className="header">
								ClinVar
							</th>
						</tr>
						<tr>
							<th>Title</th>
							<th>Clinical significant</th>
							<th>Number of publications</th>
							<th>Number of SNPs</th>
						</tr>
					</thead>
					<tbody>
						{this.state.clinvarItems.length ? (
							this.state.clinvarItems
						) : (
							<Loading />
						)}
					</tbody>
					<thead>
						<tr>
							<th colSpan="4" className="header">
								dbSNP-PubMed-MeSH
							</th>
						</tr>
						<tr>
							<th>Title</th>
							<th>&nbsp;</th>
							<th>Number of publications</th>
							<th>Number of SNPs</th>
						</tr>
					</thead>
					<tbody>
						{this.state.meshItems.length ? this.state.meshItems : <Loading />}
					</tbody>
				</table>
				<h2>Disease associations from other databases</h2>
				<table className="geneDiseaseTable">
					<thead>
						<tr>
							<th>Disease title</th>
							<th>Number of publications</th>
							<th>Source database</th>
						</tr>
					</thead>
					<tbody>
						{this.state.diseaseItems.length ? (
							this.state.diseaseItems
						) : (
							<Loading />
						)}
					</tbody>
				</table>
			</div>
		);
	}
}

export default RootContainer;
