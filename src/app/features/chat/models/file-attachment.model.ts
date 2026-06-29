export interface FileAttachment {
  id?: string;
  fileId?: string;
  messageId?: string;
  fileName?: string;
  name?: string;
  mimeType: string;
  url: string;
  sizeBytes?: number;
  uploadedAt?: string;
  size?: number;
}

