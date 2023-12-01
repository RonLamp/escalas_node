export function TestaCPF(cpf: string) {
	cpf = cpf.replace(/[^\d]+/g, "");
	if (cpf.length !== 11) return false;
	let soma: number;
	let resto: number;
	soma = 0;
	if (cpf === "00000000000") return false;
	for (let i = 1; i <= 9; i++)
		soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
	resto = (soma * 10) % 11;
	if (resto === 10 || resto === 11) resto = 0;
	if (resto !== parseInt(cpf.substring(9, 10))) return false;
	soma = 0;
	for (let i = 1; i <= 10; i++)
		soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
	resto = (soma * 10) % 11;
	if (resto === 10 || resto === 11) resto = 0;
	if (resto !== parseInt(cpf.substring(10, 11))) return false;
	return true;
}

export function TestaCNPJ(cnpj: string) {
	cnpj = cnpj.replace(/[^\d]+/g, "");
	if (cnpj.length !== 14) return false;
	let tamanhoTotal: number = cnpj.length - 2;
	let cnpjSemDigitos: string = cnpj.substring(0, tamanhoTotal);
	let digitosVerificadores: string = cnpj.substring(tamanhoTotal);
	let soma: number = 0;
	let pos: number = tamanhoTotal - 7;
	for (let i: number = tamanhoTotal; i >= 1; i--) {
		//soma += cnpjSemDigitos.charAt(tamanhoTotal - i) * pos--;
		const digito: number = parseInt(
			cnpjSemDigitos.charAt(tamanhoTotal - i),
			10
		);
		soma += digito * pos--;
		if (pos < 2) pos = 9;
	}

	let resultado: number = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	//if (resultado !== digitosVerificadores.charAt(0)) return false;
	const primeiroDigitoVerificador: number = parseInt(
		digitosVerificadores.charAt(0),
		10
	);
	if (resultado !== primeiroDigitoVerificador) return false;

	tamanhoTotal = tamanhoTotal + 1;
	cnpjSemDigitos = cnpj.substring(0, tamanhoTotal);
	soma = 0;
	pos = tamanhoTotal - 7;
	for (let i: number = tamanhoTotal; i >= 1; i--) {
		//soma += cnpjSemDigitos.charAt(tamanhoTotal - i) * pos--;
		const digito: number = parseInt(
			cnpjSemDigitos.charAt(tamanhoTotal - i),
			10
		);
		soma += digito * pos--;
		if (pos < 2) pos = 9;
	}

	resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	//if (resultado != digitosVerificadores.charAt(1)) return false;
	const segundoDigitoVerificador: number = parseInt(
		digitosVerificadores.charAt(1),
		10
	);
	if (resultado !== segundoDigitoVerificador) {
		return false;
	}

	return true;
}
