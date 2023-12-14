import { CorsOptions } from "cors";

var whitelist: string[] = [
  "http://localhost:5173",
  "https://escalas.rc12.tech",
  "https://accounts.google.com",
];

export const corsOptions: CorsOptions = {
  origin: whitelist,
  // origin: (origin, callback) => {
  // 	if (!origin || whitelist.indexOf(origin) !== -1) {
  // 		callback(null, true);
  // 	} else {
  // 		callback(new Error("Not allowed by CORS"));
  // 	}
  // },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization", "authorization"],
  exposedHeaders: [],
  maxAge: 86400,
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

/**
//-- more details https://www.npmjs.com/package/cors

//--- The default configuration is the equivalent of:
{
  //  Configures the Access-Control-Allow-Origin CORS header
  "origin": "*",

  // Configures the Access-Control-Allow-Methods CORS header. 
  // Expects a comma-delimited string (ex: 'GET,PUT,POST') or 
  // an array (ex: ['GET', 'PUT', 'POST']).
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",

  // Configures the Access-Control-Allow-Headers CORS header. 
  // Expects a comma-delimited string (ex: 'Content-Type,Authorization') or 
  // an array (ex: ['Content-Type', 'Authorization']). 
  // If not specified, defaults to reflecting the headers specified in 
  // the request's Access-Control-Request-Headers header.
  "allowed headers": ["Content-Type", "Authorization"],

  // exposedHeaders: Configures the Access-Control-Expose-Headers CORS header.
  // Expects a comma-delimited string (ex: 'Content-Range,X-Content-Range') or 
  // an array (ex: ['Content-Range', 'X-Content-Range']).
  // If not specified, no custom headers are exposed.
  "exposedHeaders": [],

  // credentials: Configures the Access-Control-Allow-Credentials CORS header.
  // Set to true to pass the header, otherwise it is omitted.
  "credentials": false,

  // maxAge: Configures the Access-Control-Max-Age CORS header.
  // Set to an integer to pass the header, otherwise it is omitted.
  "maxAge": 86400,

  // Pass the CORS preflight response to the next handle
  "preflightContinue": false,

  // Provides a status code to use for successful OPTIONS requests, 
  // since some legacy browsers (IE11, various SmartTVs) choke on 204
  "optionsSuccessStatus": 204
}

//--- Configuring CORS w/ Dynamic Origin

// Se origin for undefined, a condição !origin será verdadeira,
// permitindo a requisição. Isso garante que solicitações sem origem 
// (como requisições feitas diretamente a partir do código do cliente)
// sejam permitidas.
// Se origin for uma string, a função irá procurar a origem na lista branca 
// whitelist) usando o método indexOf.
// Se a origem estiver na lista branca ou se origin for undefined,
// a requisição é permitida.
// Caso contrário, uma mensagem de erro é retornada para o cliente.

origin: (origin, callback) => {
		if (!origin || whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},

 */
