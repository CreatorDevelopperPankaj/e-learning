export interface FileAttachment {
  id: string;
  messageId?: string;
  fileName: string;
  mimeType: string;
  url: string;
  sizeBytes?: number;
  uploadedAt: string;
}

