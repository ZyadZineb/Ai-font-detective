export interface SearchSource {
  title: string;
  uri: string;
}

export interface IdentificationResult {
  analysisText: string;
  sources: SearchSource[];
  identifiedName?: string;
}

export interface UploadedFile {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export interface GeneratedGlyph {
  char: string;
  path: string;
  width?: number;
}