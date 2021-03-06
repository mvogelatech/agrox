// template function to generate an HTML diagnosis report

export function reportTemplate(
	imageBase64: string,
	farmName: string,
	areaName: string,
	fieldName: string,
	cropType: string,
	cropAreaHa: string,
	cropTypeVariety: string,
	sowingDate: string,
	harvestDate: string,
	reportDate: string,
	infectedTotalArea: string,
	indectedArea: string,
	infestationPercentage: string,
	trepadeirasPercentage: string,
	mamonaPercentage: string,
	gpaPercentage: string,
	gpbPercentage: string,
	oflPercentage: string,
	undefinedPercentage: string,
) {
	return `<!DOCTYPE html>
	<html>
		<head>
			<title>Page Title</title>
			<meta charset="utf-8">
			<style>
			#table{
				/* background: gray; */
				position: fixed;
				width: 720px;
				height: 960px;
				/* border: none; */
			}
			#logoS{
				position: fixed;
				/* background: red; */
				height: 50px;
				width: 720px;
				text-align: center;
			}
			#logoI{
				position: fixed;
				/* background: red; */
				height: 50px;
				width: 720px;
				margin-top: 900px;
				text-align: center;
			}
			#titlePage{
				margin-top: 45px;
				position: fixed;
				height: 30px;
				width: 720px;
				text-align: center;
				color: #454F63;
				font-weight: 700;
			}
			#img{
				margin-top: 75px;
				position: fixed;
				height: 480px;
				width: 700px;
				margin-left: 10px;
			}
			#contL{
				border-width: thin;
				border-style: solid;
				border-color: #D1D4D5;
				margin-top: 570px;
				position: fixed;
				height: 300px;
				width: 230px;
				margin-left: 10px;
			}
			#contR{
				border-width: thin;
				border-style: solid;
				border-color: #D1D4D5;
				background: white;
				margin-top: 570px;
				position: fixed;
				height: 300px;
				width: 442px;
				margin-left: 260px;
			}
			#titleContL{

				background: #F7F7FA;
				height: 25px;
				padding-top: 7.5px;
				font-weight: 600;
				color: #327387;
				font-size: 12px;
				text-align: center;
			}
			#farmDescription{
				padding-top: 1px;
				padding-left: 10px;
				background: #F7F7FA;
				height: 168px;
			}
			#label1{
				font-size: 11px;
				color: #454F63;
				font-weight: 400;
			}
			#label2{
				font-size: 11px;
				color: #78849E;
				font-weight: 400;
			}
			#titleContR{
				background: #F7F7FA;
				height: 25px;
				padding-top: 7.5px;
				font-weight: 600;
				color: #327387;
				font-size: 12px;
				padding-left: 10px;
			}
			#plaguesInf{
				margin-top: 25px;
				background: #F7F7FA;
				height: 147px;
			}
			#div1{
				width: 126px;
				height: 50px;
				padding-left: 20px;
			}
			#div2{
				width: 126px;
				height: 50px;
				margin-top: -61px;
				margin-left: 136px;
			}
			#div3{
				width: 126px;
				height: 50px;
				margin-top: -61px;
				margin-left: 264px;
			}
			#label3{
				font-size: 23px;
				color: #78849E;
				font-weight: 400;
			}
			#plagues{
				/* background-color: cornflowerblue; */
				height: 147px;
				margin-top: 41px;
				padding-left: 20px;
			}
			.row{
				/* background-color: cyan; */
				height: 40px;
				width: 350px;
			}
			#plague1{
				/* background-color: rebeccapurple; */
				height: 25px;
				width: 165px;
			}
			#plague2{
				/* background-color: red; */
				height: 25px;
				width: 165px;
				margin-left: 185px;
				margin-top: -25px;
			}
			.label4{
				font-size: 13px; color: #454F63; font-weight: 400;
			}
			#plagues {
				height: 147px;
				margin-top: 41px;
				padding-left: 20px;
			  }
			  .plagues-container {
				margin-top: 10px;
				display: grid;
				grid-template-columns: 175px 175px;
				grid-template-rows: auto;
				column-gap: 34px;
				row-gap: 12px;
			  }
			  .plague {
				display: grid;
				grid-template-columns: 12px 150px;
				column-gap: 13px;
				grid-template-rows: 1fr 1fr;
				grid-template-areas:
				  'circulo nome'
				  'circulo porcentagem';
				width: 165px;
			  }
			  .circulo {
				margin-top: 2px;
				width: 12px;
				height: 12px;
				border-radius: 50%;
				grid-area: circulo;
			  }
			  .nome {
				font-size: 13px;
				color: #454F63;
				font-weight: 400;
				grid-area: nome;
			  }
			  .porcentagem {
				font-size: 11px;
				color: #78849E;
				font-weight: 400;
				grid-area: porcentagem;
			  }
			</style>
		</head>
		<body>
			<div id="table">
				<div id="logoS">
					<img style="width: 200px; height: 40px;" src="data:image/png;base64, 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" alt="Red dot" >
				</div>
				<div id="titlePage">
					<h>RELAT??RIO DE DIAGN??STICO DE ERVAS DANINHAS</h>
				</div>
				<div id="img">
					<img style=" height: 480px; margin: 0 auto; display: block;" src="${imageBase64}">
				</div>
				<div id="contL">
					<div id= "titleContL">
						INFORMA????ES T??CNICAS
					</div>
					<div style="margin-left: 10px;">
						<p style="font-size: 12px; color: #454F63; font-weight: 700;">${farmName}</p>
						<p style="font-size: 12px; color: #78849E; font-weight: 700;">??REA: ${areaName}</p>
						<p style="font-size: 12px; color: #454F63; font-weight: 700;">${fieldName}</p>
					</div>
					<div id= "farmDescription">
						<p id="label1">Tipo(s) de Plantio: <h id="label2"> ${cropType}</h></p>
						<p id="label1">??rea (ha): <h id="label2"> ${cropAreaHa}</h></p>
						<p id="label1">Corte: <h id="label2"> 3</h></p>
						<p id="label1">Variedade: <h id="label2"> ${cropTypeVariety}</h></p>
						<p id="label1">Data de Plantio: <h id="label2"> ${sowingDate}</h></p>
						<p id="label1">Data de Colheita: <h id="label2"> ${harvestDate}</h></p>
					</div>
				</div>
				<div id="contR">
					<div id= "titleContR">
						DIAGN??STICO
						<h style="padding-left: 130px">Data: ${reportDate}</h>
					</div>
					<div>
						<div id= "div1">
							<p id="label1">??rea Total (ha) </p>
							<h id="label3"> ${infectedTotalArea}</h>
						</div>
						<div id= "div2">
							<p id="label1">??rea Afetada (ha) </p>
							<h id="label3"> ${indectedArea}</h>
						</div>
						<div id= "div3">
							<p id="label1">Infesta????o</p>
							<h id="label3"> ${infestationPercentage}%</h>
						</div>
					</div>
					<div id="plagues">
						<h id="label1">Tipo de Pragas (5)</h>
						<div class="plagues-container">
							<div class="plague">
							<div class="circulo" style="background-color: #FFF73B;"></div>
							<h class="nome">Trepadeiras</h>
							<h class="porcentagem">${trepadeirasPercentage}%</h>
							</div>

							<div class="plague">
							<div class="circulo" style="background-color: #FFBA52;"></div>
							<h class="nome">Mamona</h>
							<h class="porcentagem">${mamonaPercentage}%</h>
							</div>

							<div class="plague">
							<div class="circulo" style="background-color: #4DF100;"></div>
							<h class="nome">Gram??neas Porte Alto</h>
							<h class="porcentagem">${gpaPercentage}%</h>
							</div>

							<div class="plague">
							<div class="circulo" style="background-color: #97F7FF;"></div>
							<h class="nome">Gram??neas Porte Baixo</h>
							<h class="porcentagem">${gpbPercentage}%</h>
							</div>

							<div class="plague">
							<div class="circulo" style="background-color: #FFBCC8;"></div>
							<h class="nome">Outras Folhas Largas</h>
							<h class="porcentagem">${oflPercentage}%</h>
							</div>

							<div class="plague">
							<div class="circulo" style="background-color: #DE81FF;"></div>
							<h class="nome">Daninhas Indefinidas</h>
							<h class="porcentagem">${undefinedPercentage}%</h>
							</div>
						</div>
					</div>
				</div>
				<div id="logoI">
					<img style="width: 300px; height: 25px;" src="data:image/png;base64, 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">
				</div>
			</div>
		</body>
	</html>
	`;
}
