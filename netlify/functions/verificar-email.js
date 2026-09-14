const dns = require("dns").promises;

exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                valido: false,
                mensagem: "Método não permitido."
            })
        };
    }

    try {

        const { email } = JSON.parse(event.body || "{}");

        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    valido: false,
                    mensagem: "E-mail não informado."
                })
            };
        }

        const emailNormalizado = email.trim().toLowerCase();

        const partes = emailNormalizado.split("@");

        if (partes.length !== 2 || !partes[0] || !partes[1]) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    valido: false,
                    mensagem: "Formato de e-mail inválido."
                })
            };
        }

        const dominio = partes[1];

        const registrosMX = await dns.resolveMx(dominio);

        if (!registrosMX || registrosMX.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    valido: false,
                    mensagem: "O domínio informado não possui configuração de e-mail."
                })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                valido: true,
                mensagem: "Domínio de e-mail válido."
            })
        };

    } catch (erro) {

        console.error("Erro ao verificar domínio:", erro);

        return {
            statusCode: 200,
            body: JSON.stringify({
                valido: false,
                mensagem: "Não foi possível verificar o domínio do e-mail."
            })
        };
    }
};