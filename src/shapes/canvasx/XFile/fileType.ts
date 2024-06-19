export enum FileEmum {
  DOC = 'doc',
  DOCX = 'docx',
  XLS = 'xls',
  XLSX = 'xlsx',
  PPT = 'ppt',
  PPTX = 'pptx',
  PDF = 'pdf',
  ZIP = 'zip',
  MP4 = 'mp4',
  WEBM = 'webm',
  UNKNOWN = 'unknown',
}

export enum FileDocument {
  DOC = 'Word Document',
  DOCX = 'Word Document',
  XLS = 'Excel Document',
  XLSX = 'Excel Document',
  PPT = 'PPT Document',
  PPTX = 'PPT Document',
  PDF = 'PDF Document',
  ZIP = 'ZIP File',
  MP4 = 'Video Document',
  WEBM = 'Video Document',
}

export type FileType = keyof typeof FileEmum;
