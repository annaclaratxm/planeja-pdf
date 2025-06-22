// src/app/client/widget/components/chat-types.tsx

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessageData {
	id: string;
	role: MessageRole;
	content: string;
	created_at?: string;
}

export interface SessionData {
	id: string;
	title: string;
	created_at: string;
	conversations: {
		prompt: string;
		response: string;
		created_at: string;
	}[];
}

export interface ChatMessageProps {
	role: MessageRole;
	content: string;
}

// NOVO: Tipo para os Clientes
export interface CustomerData {
	id: number;
	name: string;
}

// NOVO: Tipo para os Documentos PDF
export interface PdfDocumentData {
	id: number;
	file_name: string;
	created_at: string;
	download_url: string;
}