// Purpose: Interface for JWT payload.
export default interface IJWTPayload {
	name: string | null;
	email: string;
	avatar_url: string | null;
	level: number;
	verified: boolean;
	exp?: number;
}
